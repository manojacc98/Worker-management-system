import pool from '../connection';
import { Salary, Advance } from '../../types';

export const salaryQueries = {
  getAll: async (workerId?: string, status?: string, cycleType?: string) => {
    let query = `
      SELECT s.*, 
             json_build_object('id', w.id, 'name', w.name, 'photo', w.photo, 'hourlyRate', w.hourly_rate) as "workerId"
      FROM salaries s
      JOIN workers w ON s.worker_id = w.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (workerId) {
      query += ` AND s.worker_id = $${paramCount++}`;
      params.push(workerId);
    }
    if (status) {
      query += ` AND s.status = $${paramCount++}`;
      params.push(status);
    }
    if (cycleType) {
      query += ` AND s.cycle_type = $${paramCount++}`;
      params.push(cycleType);
    }

    query += ' ORDER BY s.start_date DESC';

    const result = await pool.query(query, params);
    return result.rows.map((row: any) => ({
      id: row.id,
      workerId: row.workerId,
      cycleType: row.cycle_type,
      startDate: row.start_date,
      endDate: row.end_date,
      totalHours: parseFloat(row.total_hours),
      hourlyRate: parseFloat(row.hourly_rate),
      grossSalary: parseFloat(row.gross_salary),
      advances: parseFloat(row.advances),
      netSalary: parseFloat(row.net_salary),
      status: row.status,
      paidAt: row.paid_at,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  getById: async (id: string) => {
    const result = await pool.query(
      `SELECT s.*, 
              json_build_object('id', w.id, 'name', w.name, 'photo', w.photo, 'hourlyRate', w.hourly_rate) as "workerId"
       FROM salaries s
       JOIN workers w ON s.worker_id = w.id
       WHERE s.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      workerId: row.workerId,
      cycleType: row.cycle_type,
      startDate: row.start_date,
      endDate: row.end_date,
      totalHours: parseFloat(row.total_hours),
      hourlyRate: parseFloat(row.hourly_rate),
      grossSalary: parseFloat(row.gross_salary),
      advances: parseFloat(row.advances),
      netSalary: parseFloat(row.net_salary),
      status: row.status,
      paidAt: row.paid_at,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  create: async (salary: Partial<Salary>) => {
    const result = await pool.query(
      `INSERT INTO salaries (worker_id, cycle_type, start_date, end_date, total_hours, 
                           hourly_rate, gross_salary, advances, net_salary, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        salary.workerId,
        salary.cycleType,
        salary.startDate,
        salary.endDate,
        salary.totalHours,
        salary.hourlyRate,
        salary.grossSalary,
        salary.advances || 0,
        salary.netSalary,
        salary.status || 'pending',
        salary.notes || null,
      ]
    );
    const row = result.rows[0];
    // Get worker info
    const workerResult = await pool.query('SELECT id, name, photo, hourly_rate FROM workers WHERE id = $1', [salary.workerId]);
    return {
      id: row.id,
      workerId: workerResult.rows[0] ? {
        id: workerResult.rows[0].id,
        name: workerResult.rows[0].name,
        photo: workerResult.rows[0].photo,
        hourlyRate: parseFloat(workerResult.rows[0].hourly_rate),
      } : null,
      cycleType: row.cycle_type,
      startDate: row.start_date,
      endDate: row.end_date,
      totalHours: parseFloat(row.total_hours),
      hourlyRate: parseFloat(row.hourly_rate),
      grossSalary: parseFloat(row.gross_salary),
      advances: parseFloat(row.advances),
      netSalary: parseFloat(row.net_salary),
      status: row.status,
      paidAt: row.paid_at,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  markPaid: async (id: string) => {
    const result = await pool.query(
      'UPDATE salaries SET status = $1, paid_at = $2 WHERE id = $3 RETURNING *',
      ['paid', new Date(), id]
    );
    return result.rows[0];
  },

  countPending: async () => {
    const result = await pool.query("SELECT COUNT(*) FROM salaries WHERE status = 'pending'");
    return parseInt(result.rows[0].count);
  },

  sumPendingAmount: async () => {
    const result = await pool.query(
      "SELECT COALESCE(SUM(net_salary), 0) as total FROM salaries WHERE status = 'pending'"
    );
    return parseFloat(result.rows[0].total);
  },

  getByWorkerId: async (workerId: string) => {
    return salaryQueries.getAll(workerId);
  },
};

export const advanceQueries = {
  getByWorkerId: async (workerId: string, startDate?: string, endDate?: string) => {
    let query = `
      SELECT a.*, 
             json_build_object('id', w.id, 'name', w.name) as "workerId"
      FROM advances a
      JOIN workers w ON a.worker_id = w.id
      WHERE a.worker_id = $1
    `;
    const params: any[] = [workerId];
    let paramCount = 2;

    if (startDate && endDate) {
      query += ` AND a.date >= $${paramCount++} AND a.date <= $${paramCount++}`;
      params.push(startDate, endDate);
    }

    query += ' ORDER BY a.date DESC';

    const result = await pool.query(query, params);
    return result.rows.map((row: any) => ({
      id: row.id,
      workerId: row.workerId,
      amount: parseFloat(row.amount),
      date: row.date,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  create: async (advance: Partial<Advance>) => {
    const result = await pool.query(
      'INSERT INTO advances (worker_id, amount, date, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [advance.workerId, advance.amount, advance.date || new Date().toISOString().split('T')[0], advance.notes || null]
    );
    const row = result.rows[0];
    // Get worker info
    const workerResult = await pool.query('SELECT id, name FROM workers WHERE id = $1', [advance.workerId]);
    return {
      id: row.id,
      workerId: workerResult.rows[0] ? {
        id: workerResult.rows[0].id,
        name: workerResult.rows[0].name,
      } : null,
      amount: parseFloat(row.amount),
      date: row.date,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  sumByWorkerId: async (workerId: string, startDate: string, endDate: string) => {
    const result = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM advances 
       WHERE worker_id = $1 AND date >= $2 AND date <= $3`,
      [workerId, startDate, endDate]
    );
    return parseFloat(result.rows[0].total);
  },
};

