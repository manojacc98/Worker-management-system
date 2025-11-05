import express, { Request, Response } from 'express';
import { updateQueries } from '../db/queries/updates';
import { workerQueries } from '../db/queries/workers';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { uploadMultiple } from '../utils/fileUpload';

const router = express.Router();

// Get all updates (admin only) or for specific worker
router.get('/', async (req: Request, res: Response) => {
  try {
    const { workerId, date, limit = '50' } = req.query;

    const updates = await updateQueries.getAll(
      workerId as string | undefined,
      date as string | undefined,
      parseInt(limit as string)
    );

    res.json(updates);
  } catch (error: any) {
    console.error('Get updates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single update
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const update = await updateQueries.getById(req.params.id);
    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }
    res.json(update);
  } catch (error: any) {
    console.error('Get update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create update (public - workers can submit)
router.post('/', uploadMultiple, async (req: Request, res: Response) => {
  try {
    const { workerId, comment, hasPendingWork } = req.body;

    if (!workerId || !comment) {
      return res.status(400).json({ error: 'Worker ID and comment are required' });
    }

    // Verify worker exists
    const worker = await workerQueries.getById(workerId);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Get uploaded images
    const images = req.files
      ? (req.files as Express.Multer.File[]).map((file) => `/uploads/${file.filename}`)
      : [];

    const update = await updateQueries.create({
      workerId,
      comment,
      images,
      hasPendingWork: hasPendingWork === 'true' || hasPendingWork === true,
      date: new Date().toISOString().split('T')[0],
    });

    res.status(201).json(update);
  } catch (error: any) {
    console.error('Create update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get updates for a specific worker (public)
router.get('/worker/:workerId', async (req: Request, res: Response) => {
  try {
    const { limit = '50' } = req.query;
    const updates = await updateQueries.getByWorkerId(
      req.params.workerId,
      parseInt(limit as string)
    );

    res.json(updates);
  } catch (error: any) {
    console.error('Get worker updates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
