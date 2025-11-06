"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workers_1 = require("../db/queries/workers");
const auth_1 = require("../middleware/auth");
const fileUpload_1 = require("../utils/fileUpload");
const router = express_1.default.Router();
// Get all workers (public)
router.get('/', async (req, res) => {
    try {
        const { search, sortBy = 'name', sortOrder = 'asc' } = req.query;
        const workers = await workers_1.workerQueries.getAll(search, sortBy, sortOrder);
        // Transform database format to API format
        const formattedWorkers = workers.map((w) => ({
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
    }
    catch (error) {
        console.error('Get workers error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get single worker (public)
router.get('/:id', async (req, res) => {
    try {
        const worker = await workers_1.workerQueries.getById(req.params.id);
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
    }
    catch (error) {
        console.error('Get worker error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Create worker (admin only)
router.post('/', auth_1.authenticate, auth_1.requireAdmin, fileUpload_1.upload.single('photo'), async (req, res) => {
    try {
        const { name, hourlyRate, startTime, endTime } = req.body;
        if (!name || !hourlyRate || !startTime || !endTime) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const worker = await workers_1.workerQueries.create({
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
    }
    catch (error) {
        console.error('Create worker error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Update worker (admin only)
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, fileUpload_1.upload.single('photo'), async (req, res) => {
    try {
        const { name, hourlyRate, startTime, endTime } = req.body;
        const existingWorker = await workers_1.workerQueries.getById(req.params.id);
        if (!existingWorker) {
            return res.status(404).json({ error: 'Worker not found' });
        }
        const updateData = {};
        if (name)
            updateData.name = name;
        if (hourlyRate)
            updateData.hourlyRate = parseFloat(hourlyRate);
        if (startTime)
            updateData.startTime = startTime;
        if (endTime)
            updateData.endTime = endTime;
        if (req.file)
            updateData.photo = `/uploads/${req.file.filename}`;
        const worker = await workers_1.workerQueries.update(req.params.id, updateData);
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
    }
    catch (error) {
        console.error('Update worker error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Delete worker (admin only)
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const worker = await workers_1.workerQueries.delete(req.params.id);
        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }
        res.json({ message: 'Worker deleted successfully' });
    }
    catch (error) {
        console.error('Delete worker error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=workers.js.map