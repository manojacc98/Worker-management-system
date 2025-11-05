import pool from '../connection';
import bcrypt from 'bcryptjs';

export const adminQueries = {
  findByUsername: async (username: string) => {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username.toLowerCase()]);
    return result.rows[0];
  },

  findById: async (id: string) => {
    const result = await pool.query('SELECT id, username, created_at, updated_at FROM admins WHERE id = $1', [id]);
    return result.rows[0];
  },

  create: async (username: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id, username, created_at, updated_at',
      [username.toLowerCase(), hashedPassword]
    );
    return result.rows[0];
  },

  updatePassword: async (id: string, newPassword: string) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      'UPDATE admins SET password = $1 WHERE id = $2 RETURNING id, username',
      [hashedPassword, id]
    );
    return result.rows[0];
  },

  comparePassword: async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
  },
};

