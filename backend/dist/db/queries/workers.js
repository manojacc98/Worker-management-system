"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerQueries = void 0;
const connection_1 = __importDefault(require("../connection"));
exports.workerQueries = {
    getAll: async (search, sortBy = 'name', sortOrder = 'ASC') => {
        let query = 'SELECT * FROM workers';
        const params = [];
        if (search) {
            query += ' WHERE name ILIKE $1';
            params.push(`%${search}%`);
        }
        const validSortBy = ['name', 'created_at', 'hourly_rate'];
        const validSortOrder = ['ASC', 'DESC'];
        const sortField = validSortBy.includes(sortBy) ? sortBy : 'name';
        const sort = validSortOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
        query += ` ORDER BY ${sortField} ${sort}`;
        const result = await connection_1.default.query(query, params);
        return result.rows;
    },
    getById: async (id) => {
        const result = await connection_1.default.query('SELECT * FROM workers WHERE id = $1', [id]);
        return result.rows[0];
    },
    create: async (worker) => {
        const result = await connection_1.default.query(`INSERT INTO workers (name, photo, hourly_rate, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [worker.name, worker.photo || '', worker.hourlyRate, worker.startTime, worker.endTime]);
        return result.rows[0];
    },
    update: async (id, worker) => {
        const updates = [];
        const values = [];
        let paramCount = 1;
        if (worker.name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(worker.name);
        }
        if (worker.photo !== undefined) {
            updates.push(`photo = $${paramCount++}`);
            values.push(worker.photo);
        }
        if (worker.hourlyRate !== undefined) {
            updates.push(`hourly_rate = $${paramCount++}`);
            values.push(worker.hourlyRate);
        }
        if (worker.startTime !== undefined) {
            updates.push(`start_time = $${paramCount++}`);
            values.push(worker.startTime);
        }
        if (worker.endTime !== undefined) {
            updates.push(`end_time = $${paramCount++}`);
            values.push(worker.endTime);
        }
        if (updates.length === 0) {
            return exports.workerQueries.getById(id);
        }
        values.push(id);
        const result = await connection_1.default.query(`UPDATE workers SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
        return result.rows[0];
    },
    delete: async (id) => {
        const result = await connection_1.default.query('DELETE FROM workers WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },
    count: async () => {
        const result = await connection_1.default.query('SELECT COUNT(*) FROM workers');
        return parseInt(result.rows[0].count);
    },
};
//# sourceMappingURL=workers.js.map