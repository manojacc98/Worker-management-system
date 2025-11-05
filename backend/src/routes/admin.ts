import express, { Request, Response } from 'express';
import { workerQueries } from '../db/queries/workers';
import { updateQueries } from '../db/queries/updates';
import { salaryQueries } from '../db/queries/salaries';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { calculateHours } from '../utils/salaryCalculation';

const router = express.Router();

// Get dashboard stats (admin only)
router.get('/dashboard', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const totalWorkers = await workerQueries.count();

    // Get recent updates (last 10)
    const recentUpdates = await updateQueries.getAll(undefined, undefined, 10);

    // Get pending work count
    const pendingWorkCount = await updateQueries.countPending();

    // Get pending salaries
    const pendingSalaries = await salaryQueries.countPending();

    // Get total pending salary amount
    const pendingSalaryAmount = await salaryQueries.sumPendingAmount();

    res.json({
      totalWorkers,
      recentUpdates,
      pendingWorkCount,
      pendingSalaries,
      pendingSalaryAmount,
    });
  } catch (error: any) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export CSV reports
router.get('/export/:type', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;
    const { startDate, endDate, workerId } = req.query;

    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'payroll': {
        const salaries = await salaryQueries.getAll(
          workerId as string | undefined,
          undefined,
          undefined
        );

        // Filter by date range if provided
        let filteredSalaries = salaries;
        if (startDate && endDate) {
          filteredSalaries = salaries.filter((s: any) => {
            const sDate = new Date(s.startDate);
            return sDate >= new Date(startDate as string) && sDate <= new Date(endDate as string);
          });
        }

        data = filteredSalaries.map((salary: any) => ({
          'Worker Name': salary.workerId?.name || 'Unknown',
          'Cycle Type': salary.cycleType,
          'Start Date': salary.startDate,
          'End Date': salary.endDate,
          'Total Hours': salary.totalHours.toFixed(2),
          'Hourly Rate': salary.hourlyRate.toFixed(2),
          'Gross Salary': salary.grossSalary.toFixed(2),
          'Advances': salary.advances.toFixed(2),
          'Net Salary': salary.netSalary.toFixed(2),
          'Status': salary.status,
          'Paid At': salary.paidAt || '',
        }));

        filename = `payroll-${Date.now()}.csv`;
        break;
      }

      case 'attendance': {
        const updates = await updateQueries.getAll(workerId as string | undefined, undefined, 1000);

        // Filter by date range if provided
        let filteredUpdates = updates;
        if (startDate && endDate) {
          filteredUpdates = updates.filter((u: any) => {
            const uDate = new Date(u.date);
            return uDate >= new Date(startDate as string) && uDate <= new Date(endDate as string);
          });
        }

        data = filteredUpdates.map((update: any) => {
          const worker = update.workerId;
          let hours = 0;
          if (worker && worker.startTime && worker.endTime) {
            try {
              hours = calculateHours(worker.startTime, worker.endTime);
            } catch (error) {
              hours = 0;
            }
          } else if (worker && worker.hourlyRate) {
            // Fallback: try to get from worker query
            workerQueries.getById(update.workerId?.id || '').then((w: any) => {
              if (w) {
                hours = calculateHours(w.start_time, w.end_time);
              }
            }).catch(() => {});
          }

          return {
            'Worker Name': worker?.name || 'Unknown',
            'Date': update.date,
            'Total Hours': hours.toFixed(2),
            'Has Pending Work': update.hasPendingWork ? 'Yes' : 'No',
            'Update Time': update.createdAt,
          };
        });

        filename = `attendance-${Date.now()}.csv`;
        break;
      }

      case 'pending-work': {
        const updates = await updateQueries.getAll(undefined, undefined, 1000);
        const pendingUpdates = updates.filter((u: any) => u.hasPendingWork);

        data = pendingUpdates.map((update: any) => ({
          'Worker Name': update.workerId?.name || 'Unknown',
          'Date': update.date,
          'Comment': update.comment,
          'Update Time': update.createdAt,
        }));

        filename = `pending-work-${Date.now()}.csv`;
        break;
      }

      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    // Convert to CSV
    if (data.length === 0) {
      return res.status(404).json({ error: 'No data found for export' });
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) => headers.map((header) => JSON.stringify(row[header] || '')).join(',')),
    ];

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error: any) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Server error during export' });
  }
});

export default router;
