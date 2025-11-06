"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salaries_1 = require("../db/queries/salaries");
const workers_1 = require("../db/queries/workers");
const updates_1 = require("../db/queries/updates");
const auth_1 = require("../middleware/auth");
const salaryCalculation_1 = require("../utils/salaryCalculation");
const router = express_1.default.Router();
// Get all salary records (admin only)
router.get('/', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { workerId, status, cycleType } = req.query;
        const salaries = await salaries_1.salaryQueries.getAll(workerId, status, cycleType);
        res.json(salaries);
    }
    catch (error) {
        console.error('Get salaries error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get salary for a specific worker
router.get('/worker/:workerId', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const salaries = await salaries_1.salaryQueries.getAll(req.params.workerId);
        res.json(salaries);
    }
    catch (error) {
        console.error('Get worker salary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get single salary record
router.get('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const salary = await salaries_1.salaryQueries.getById(req.params.id);
        if (!salary) {
            return res.status(404).json({ error: 'Salary record not found' });
        }
        res.json(salary);
    }
    catch (error) {
        console.error('Get salary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Calculate and create salary record
router.post('/', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { workerId, cycleType, endDate, notes } = req.body;
        if (!workerId || !cycleType || !endDate) {
            return res.status(400).json({ error: 'Worker ID, cycle type, and end date are required' });
        }
        const worker = await workers_1.workerQueries.getById(workerId);
        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }
        // Get date range
        const { startDate, endDate: cycleEndDate } = (0, salaryCalculation_1.getSalaryCycleDates)(cycleType, new Date(endDate));
        // Get all updates within the date range
        const updates = await updates_1.updateQueries.getAll(workerId, undefined, 1000);
        const filteredUpdates = updates.filter((u) => {
            const updateDate = new Date(u.date);
            return updateDate >= startDate && updateDate <= cycleEndDate;
        });
        // Calculate total hours
        const hoursPerDay = (0, salaryCalculation_1.calculateHours)(worker.start_time, worker.end_time);
        const totalDays = filteredUpdates.length;
        const totalHours = hoursPerDay * totalDays;
        // Get total advances for this period
        const advances = await salaries_1.advanceQueries.getByWorkerId(workerId, startDate.toISOString().split('T')[0], cycleEndDate.toISOString().split('T')[0]);
        const totalAdvances = advances.reduce((sum, advance) => sum + advance.amount, 0);
        // Calculate salary
        const salaryBreakdown = (0, salaryCalculation_1.calculateSalary)(totalHours, parseFloat(worker.hourly_rate), totalAdvances);
        // Create salary record
        const salary = await salaries_1.salaryQueries.create({
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
    }
    catch (error) {
        console.error('Create salary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Mark salary as paid
router.patch('/:id/paid', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const salary = await salaries_1.salaryQueries.markPaid(req.params.id);
        if (!salary) {
            return res.status(404).json({ error: 'Salary record not found' });
        }
        const fullSalary = await salaries_1.salaryQueries.getById(req.params.id);
        res.json(fullSalary);
    }
    catch (error) {
        console.error('Mark salary paid error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get advances for a worker
router.get('/advances/:workerId', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const advances = await salaries_1.advanceQueries.getByWorkerId(req.params.workerId, startDate, endDate);
        res.json(advances);
    }
    catch (error) {
        console.error('Get advances error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Create advance
router.post('/advances', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { workerId, amount, date, notes } = req.body;
        if (!workerId || !amount) {
            return res.status(400).json({ error: 'Worker ID and amount are required' });
        }
        const worker = await workers_1.workerQueries.getById(workerId);
        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }
        const advance = await salaries_1.advanceQueries.create({
            workerId,
            amount: parseFloat(amount),
            date: date ? date : new Date().toISOString().split('T')[0],
            notes,
        });
        res.status(201).json(advance);
    }
    catch (error) {
        console.error('Create advance error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=salary.js.map