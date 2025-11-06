"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workers_1 = require("../db/queries/workers");
const updates_1 = require("../db/queries/updates");
const salaries_1 = require("../db/queries/salaries");
const auth_1 = require("../middleware/auth");
const salaryCalculation_1 = require("../utils/salaryCalculation");
const router = express_1.default.Router();
// Get dashboard stats (admin only)
router.get('/dashboard', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const totalWorkers = await workers_1.workerQueries.count();
        // Get recent updates (last 10)
        const recentUpdates = await updates_1.updateQueries.getAll(undefined, undefined, 10);
        // Get pending work count
        const pendingWorkCount = await updates_1.updateQueries.countPending();
        // Get pending salaries
        const pendingSalaries = await salaries_1.salaryQueries.countPending();
        // Get total pending salary amount
        const pendingSalaryAmount = await salaries_1.salaryQueries.sumPendingAmount();
        res.json({
            totalWorkers,
            recentUpdates,
            pendingWorkCount,
            pendingSalaries,
            pendingSalaryAmount,
        });
    }
    catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Export CSV reports
router.get('/export/:type', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { type } = req.params;
        const { startDate, endDate, workerId } = req.query;
        let data = [];
        let filename = '';
        switch (type) {
            case 'payroll': {
                const salaries = await salaries_1.salaryQueries.getAll(workerId, undefined, undefined);
                // Filter by date range if provided
                let filteredSalaries = salaries;
                if (startDate && endDate) {
                    filteredSalaries = salaries.filter((s) => {
                        const sDate = new Date(s.startDate);
                        return sDate >= new Date(startDate) && sDate <= new Date(endDate);
                    });
                }
                data = filteredSalaries.map((salary) => ({
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
                const updates = await updates_1.updateQueries.getAll(workerId, undefined, 1000);
                // Filter by date range if provided
                let filteredUpdates = updates;
                if (startDate && endDate) {
                    filteredUpdates = updates.filter((u) => {
                        const uDate = new Date(u.date);
                        return uDate >= new Date(startDate) && uDate <= new Date(endDate);
                    });
                }
                data = filteredUpdates.map((update) => {
                    const worker = update.workerId;
                    let hours = 0;
                    if (worker && worker.startTime && worker.endTime) {
                        try {
                            hours = (0, salaryCalculation_1.calculateHours)(worker.startTime, worker.endTime);
                        }
                        catch (error) {
                            hours = 0;
                        }
                    }
                    else if (worker && worker.hourlyRate) {
                        // Fallback: try to get from worker query
                        workers_1.workerQueries.getById(update.workerId?.id || '').then((w) => {
                            if (w) {
                                hours = (0, salaryCalculation_1.calculateHours)(w.start_time, w.end_time);
                            }
                        }).catch(() => { });
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
                const updates = await updates_1.updateQueries.getAll(undefined, undefined, 1000);
                const pendingUpdates = updates.filter((u) => u.hasPendingWork);
                data = pendingUpdates.map((update) => ({
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
    }
    catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Server error during export' });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map