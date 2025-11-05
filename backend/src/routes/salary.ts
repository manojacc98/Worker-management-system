import express, { Request, Response } from 'express';
import { salaryQueries, advanceQueries } from '../db/queries/salaries';
import { workerQueries } from '../db/queries/workers';
import { updateQueries } from '../db/queries/updates';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { calculateHours, calculateSalary, getSalaryCycleDates } from '../utils/salaryCalculation';

const router = express.Router();

// Get all salary records (admin only)
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { workerId, status, cycleType } = req.query;

    const salaries = await salaryQueries.getAll(
      workerId as string | undefined,
      status as string | undefined,
      cycleType as string | undefined
    );

    res.json(salaries);
  } catch (error: any) {
    console.error('Get salaries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get salary for a specific worker
router.get('/worker/:workerId', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const salaries = await salaryQueries.getAll(req.params.workerId);
    res.json(salaries);
  } catch (error: any) {
    console.error('Get worker salary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single salary record
router.get('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const salary = await salaryQueries.getById(req.params.id);
    if (!salary) {
      return res.status(404).json({ error: 'Salary record not found' });
    }
    res.json(salary);
  } catch (error: any) {
    console.error('Get salary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Calculate and create salary record
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { workerId, cycleType, endDate, notes } = req.body;

    if (!workerId || !cycleType || !endDate) {
      return res.status(400).json({ error: 'Worker ID, cycle type, and end date are required' });
    }

    const worker = await workerQueries.getById(workerId);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Get date range
    const { startDate, endDate: cycleEndDate } = getSalaryCycleDates(cycleType, new Date(endDate));

    // Get all updates within the date range
    const updates = await updateQueries.getAll(workerId, undefined, 1000);
    const filteredUpdates = updates.filter((u: any) => {
      const updateDate = new Date(u.date);
      return updateDate >= startDate && updateDate <= cycleEndDate;
    });

    // Calculate total hours
    const hoursPerDay = calculateHours(worker.start_time, worker.end_time);
    const totalDays = filteredUpdates.length;
    const totalHours = hoursPerDay * totalDays;

    // Get total advances for this period
    const advances = await advanceQueries.getByWorkerId(
      workerId,
      startDate.toISOString().split('T')[0],
      cycleEndDate.toISOString().split('T')[0]
    );

    const totalAdvances = advances.reduce((sum, advance) => sum + advance.amount, 0);

    // Calculate salary
    const salaryBreakdown = calculateSalary(totalHours, parseFloat(worker.hourly_rate), totalAdvances);

    // Create salary record
    const salary = await salaryQueries.create({
      workerId,
      cycleType,
      startDate: startDate.toISOString().split('T')[0],
      endDate: cycleEndDate.toISOString().split('T')[0],
      totalHours: salaryBreakdown.totalHours,
      hourlyRate: salaryBreakdown.hourlyRate,
      grossSalary: salaryBreakdown.grossSalary,
      advances: salaryBreakdown.advances,
      netSalary: salaryBreakdown.netSalary,
      notes,
      status: 'pending',
    });

    res.status(201).json(salary);
  } catch (error: any) {
    console.error('Create salary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark salary as paid
router.patch('/:id/paid', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const salary = await salaryQueries.markPaid(req.params.id);
    if (!salary) {
      return res.status(404).json({ error: 'Salary record not found' });
    }
    const fullSalary = await salaryQueries.getById(req.params.id);
    res.json(fullSalary);
  } catch (error: any) {
    console.error('Mark salary paid error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get advances for a worker
router.get('/advances/:workerId', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const advances = await advanceQueries.getByWorkerId(
      req.params.workerId,
      startDate as string | undefined,
      endDate as string | undefined
    );

    res.json(advances);
  } catch (error: any) {
    console.error('Get advances error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create advance
router.post('/advances', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { workerId, amount, date, notes } = req.body;

    if (!workerId || !amount) {
      return res.status(400).json({ error: 'Worker ID and amount are required' });
    }

    const worker = await workerQueries.getById(workerId);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const advance = await advanceQueries.create({
      workerId,
      amount: parseFloat(amount),
      date: date ? date : new Date().toISOString().split('T')[0],
      notes,
    });

    res.status(201).json(advance);
  } catch (error: any) {
    console.error('Create advance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
