"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQueries = void 0;
const connection_1 = __importDefault(require("../connection"));
exports.updateQueries = {
    getAll: async (workerId, date, limit = 50) => {
        let query = `
      SELECT u.*, 
             json_build_object('id', w.id, 'name', w.name, 'photo', w.photo) as "workerId"
      FROM updates u
      JOIN workers w ON u.worker_id = w.id
      WHERE 1=1
    `;
        const params = [];
        let paramCount = 1;
        if (workerId) {
            query += ` AND u.worker_id = $${paramCount++}`;
            params.push(workerId);
        }
        if (date) {
            query += ` AND u.date = $${paramCount++}`;
            params.push(date);
        }
        query += ` ORDER BY u.date DESC, u.created_at DESC LIMIT $${paramCount}`;
        params.push(limit);
        const result = await connection_1.default.query(query, params);
        return result.rows.map((row) => ({
            id: row.id,
            workerId: row.workerId,
            comment: row.comment,
            images: row.images || [],
            hasPendingWork: row.has_pending_work,
            date: row.date,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));
    },
    getById: async (id) => {
        const result = await connection_1.default.query(`SELECT u.*, 
              json_build_object('id', w.id, 'name', w.name, 'photo', w.photo) as "workerId"
       FROM updates u
       JOIN workers w ON u.worker_id = w.id
       WHERE u.id = $1`, [id]);
        if (result.rows.length === 0)
            return null;
        const row = result.rows[0];
        return {
            id: row.id,
            workerId: row.workerId,
            comment: row.comment,
            images: row.images || [],
            hasPendingWork: row.has_pending_work,
            date: row.date,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    },
    getByWorkerId: async (workerId, limit = 50) => {
        const result = await connection_1.default.query(`SELECT u.*, 
              json_build_object('id', w.id, 'name', w.name, 'photo', w.photo) as "workerId"
       FROM updates u
       JOIN workers w ON u.worker_id = w.id
       WHERE u.worker_id = $1
       ORDER BY u.date DESC, u.created_at DESC
       LIMIT $2`, [workerId, limit]);
        return result.rows.map((row) => ({
            id: row.id,
            workerId: row.workerId,
            comment: row.comment,
            images: row.images || [],
            hasPendingWork: row.has_pending_work,
            date: row.date,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));
    },
    create: async (update) => {
        const result = await connection_1.default.query(`INSERT INTO updates (worker_id, comment, images, has_pending_work, date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [
            update.workerId,
            update.comment,
            update.images || [],
            update.hasPendingWork || false,
            update.date || new Date().toISOString().split('T')[0],
        ]);
        const row = result.rows[0];
        // Get worker info
        const workerResult = await connection_1.default.query('SELECT id, name, photo FROM workers WHERE id = $1', [update.workerId]);
        return {
            id: row.id,
            workerId: workerResult.rows[0] ? {
                id: workerResult.rows[0].id,
                name: workerResult.rows[0].name,
                photo: workerResult.rows[0].photo,
            } : null,
            comment: row.comment,
            images: row.images || [],
            hasPendingWork: row.has_pending_work,
            date: row.date,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    },
    countPending: async () => {
        const result = await connection_1.default.query('SELECT COUNT(*) FROM updates WHERE has_pending_work = true');
        return parseInt(result.rows[0].count);
    },
    count: async (query) => {
        let sql = 'SELECT COUNT(*) FROM updates WHERE 1=1';
        const params = [];
        let paramCount = 1;
        if (query?.workerId) {
            sql += ` AND worker_id = $${paramCount++}`;
            params.push(query.workerId);
        }
        if (query?.hasPendingWork !== undefined) {
            sql += ` AND has_pending_work = $${paramCount++}`;
            params.push(query.hasPendingWork);
        }
        const result = await connection_1.default.query(sql, params);
        return parseInt(result.rows[0].count);
    },
};
//# sourceMappingURL=updates.js.map