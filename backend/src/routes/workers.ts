import express, { Request, Response } from 'express';
import { workerQueries } from '../db/queries/workers';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { upload } from '../utils/fileUpload';

const router = express.Router();

// Get all workers (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const workers = await workerQueries.getAll(
      search as string | undefined,
      sortBy as string,
      sortOrder as string
    );

    // Transform database format to API format
    const formattedWorkers = workers.map((w: any) => ({
      _id: w.id,
      name: w.name,
      photo: w.photo || '',
      hourlyRate: parseFloat(w.hourly_rate),
      startTime: w.start_time,
      endTime: w.end_time,
      createdAt: w.created_at,
      updatedAt: w.updated_at,
    }));

    res.json(formattedWorkers);
  } catch (error: any) {
    console.error('Get workers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single worker (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const worker = await workerQueries.getById(req.params.id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json({
      _id: worker.id,
      name: worker.name,
      photo: worker.photo || '',
      hourlyRate: parseFloat(worker.hourly_rate),
      startTime: worker.start_time,
      endTime: worker.end_time,
      createdAt: worker.created_at,
      updatedAt: worker.updated_at,
    });
  } catch (error: any) {
    console.error('Get worker error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create worker (admin only)
router.post(
  '/',
  authenticate,
  requireAdmin,
  upload.single('photo'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, hourlyRate, startTime, endTime } = req.body;

      if (!name || !hourlyRate || !startTime || !endTime) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';

      const worker = await workerQueries.create({
        name,
        photo: photoUrl,
        hourlyRate: parseFloat(hourlyRate),
        startTime,
        endTime,
      });

      res.status(201).json({
        _id: worker.id,
        name: worker.name,
        photo: worker.photo || '',
        hourlyRate: parseFloat(worker.hourly_rate),
        startTime: worker.start_time,
        endTime: worker.end_time,
        createdAt: worker.created_at,
        updatedAt: worker.updated_at,
      });
    } catch (error: any) {
      console.error('Create worker error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update worker (admin only)
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  upload.single('photo'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, hourlyRate, startTime, endTime } = req.body;
      const existingWorker = await workerQueries.getById(req.params.id);

      if (!existingWorker) {
        return res.status(404).json({ error: 'Worker not found' });
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (hourlyRate) updateData.hourlyRate = parseFloat(hourlyRate);
      if (startTime) updateData.startTime = startTime;
      if (endTime) updateData.endTime = endTime;
      if (req.file) updateData.photo = `/uploads/${req.file.filename}`;

      const worker = await workerQueries.update(req.params.id, updateData);

      res.json({
        _id: worker.id,
        name: worker.name,
        photo: worker.photo || '',
        hourlyRate: parseFloat(worker.hourly_rate),
        startTime: worker.start_time,
        endTime: worker.end_time,
        createdAt: worker.created_at,
        updatedAt: worker.updated_at,
      });
    } catch (error: any) {
      console.error('Update worker error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete worker (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const worker = await workerQueries.delete(req.params.id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json({ message: 'Worker deleted successfully' });
  } catch (error: any) {
    console.error('Delete worker error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

