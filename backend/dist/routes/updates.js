"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const updates_1 = require("../db/queries/updates");
const workers_1 = require("../db/queries/workers");
const fileUpload_1 = require("../utils/fileUpload");
const router = express_1.default.Router();
// Get all updates (admin only) or for specific worker
router.get('/', async (req, res) => {
    try {
        const { workerId, date, limit = '50' } = req.query;
        const updates = await updates_1.updateQueries.getAll(workerId, date, parseInt(limit));
        res.json(updates);
    }
    catch (error) {
        console.error('Get updates error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get single update
router.get('/:id', async (req, res) => {
    try {
        const update = await updates_1.updateQueries.getById(req.params.id);
        if (!update) {
            return res.status(404).json({ error: 'Update not found' });
        }
        res.json(update);
    }
    catch (error) {
        console.error('Get update error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Create update (public - workers can submit)
router.post('/', fileUpload_1.uploadMultiple, async (req, res) => {
    try {
        const { workerId, comment, hasPendingWork } = req.body;
        if (!workerId || !comment) {
            return res.status(400).json({ error: 'Worker ID and comment are required' });
        }
        // Verify worker exists
        const worker = await workers_1.workerQueries.getById(workerId);
        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }
        // Get uploaded images
        const images = req.files
            ? req.files.map((file) => `/uploads/${file.filename}`)
            : [];
        const update = await updates_1.updateQueries.create({
            workerId,
            comment,
            images,
            hasPendingWork: hasPendingWork === 'true' || hasPendingWork === true,
            date: new Date().toISOString().split('T')[0],
        });
        res.status(201).json(update);
    }
    catch (error) {
        console.error('Create update error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get updates for a specific worker (public)
router.get('/worker/:workerId', async (req, res) => {
    try {
        const { limit = '50' } = req.query;
        const updates = await updates_1.updateQueries.getByWorkerId(req.params.workerId, parseInt(limit));
        res.json(updates);
    }
    catch (error) {
        console.error('Get worker updates error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=updates.js.map