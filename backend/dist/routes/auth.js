"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admins_1 = require("../db/queries/admins");
const jwt_1 = require("../utils/jwt");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        // Find admin
        const admin = await admins_1.adminQueries.findByUsername(username);
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await admins_1.adminQueries.comparePassword(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate token
        const token = (0, jwt_1.generateToken)(admin.id, 'admin');
        res.json({
            token,
            user: {
                id: admin.id,
                username: admin.username,
                role: 'admin',
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});
// Change password (requires authentication)
router.post('/change-password', auth_1.authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }
        const admin = await admins_1.adminQueries.findByUsername((await admins_1.adminQueries.findById(req.userId))?.username || '');
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        // Verify current password
        const isMatch = await admins_1.adminQueries.comparePassword(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        // Update password
        await admins_1.adminQueries.updatePassword(req.userId, newPassword);
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server error during password change' });
    }
});
// Verify token
router.get('/verify', auth_1.authenticate, async (req, res) => {
    try {
        const admin = await admins_1.adminQueries.findById(req.userId);
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
    }
    catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map