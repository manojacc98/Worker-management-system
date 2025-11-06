/**
 * Non-interactive script to create admin user
 * Run with: npm run create-admin -- username password
 * Or: tsx src/scripts/createAdmin.ts username password
 */

import dotenv from 'dotenv';
import { adminQueries } from '../db/queries/admins';
import pool from '../db/connection';

dotenv.config();

async function createAdmin() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin123';

  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL');

    // Check if admin exists
    const existingAdmin = await adminQueries.findByUsername(username);
    if (existingAdmin) {
      console.log(`⚠️  Admin user "${username}" already exists`);
      console.log('   Skipping creation.');
      await pool.end();
      process.exit(0);
    }

    // Create admin
    const admin = await adminQueries.create(username, password);

    console.log('✅ Admin user created successfully!');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('   Please keep your password secure.');
  } catch (error: any) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

createAdmin();

