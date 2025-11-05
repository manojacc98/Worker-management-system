import express, { Request, Response } from 'express';
import { adminQueries } from '../db/queries/admins';
import { generateToken } from '../utils/jwt';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find admin
    const admin = await adminQueries.findByUsername(username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await adminQueries.comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(admin.id, 'admin');

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: 'admin',
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Change password (requires authentication)
router.post('/change-password', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const admin = await adminQueries.findByUsername((await adminQueries.findById(req.userId!))?.username || '');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password
    const isMatch = await adminQueries.comparePassword(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    await adminQueries.updatePassword(req.userId!, newPassword);

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error during password change' });
  }
});

// Verify token
router.get('/verify', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const admin = await adminQueries.findById(req.userId!);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({
      user: {
        id: admin.id,
        username: admin.username,
        role: 'admin',
      },
    });
  } catch (error: any) {
    console.error('Verify token error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

