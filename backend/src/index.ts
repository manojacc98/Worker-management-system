import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import pool from './db/connection';

// Import routes
import authRoutes from './routes/auth';
import workerRoutes from './routes/workers';
import updateRoutes from './routes/updates';
import salaryRoutes from './routes/salary';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'Worker Management API is running', database: 'connected' });
  } catch (error) {
    res.json({ status: 'ok', message: 'Worker Management API is running', database: 'disconnected' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/admin', adminRoutes);

// Test PostgreSQL connection and start server
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Connected to PostgreSQL');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ PostgreSQL connection error:', error);
    console.error('Please ensure PostgreSQL is running and connection details are correct in .env');
    process.exit(1);
  });

export default app;

