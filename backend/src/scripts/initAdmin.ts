/**
 * Script to initialize admin user
 * Run with: npm run init-admin
 */

import dotenv from 'dotenv';
import { adminQueries } from '../db/queries/admins';
import pool from '../db/connection';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function initAdmin() {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL');

    // Check if admin exists
    const existingAdmin = await adminQueries.findByUsername('admin');
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      const overwrite = await question('Do you want to create a new admin? (y/n): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Aborted.');
        process.exit(0);
      }
    }

    // Get admin credentials
    const username = await question('Enter admin username: ');
    const password = await question('Enter admin password: ');

    if (!username || !password) {
      console.log('❌ Username and password are required');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    // Create admin
    const admin = await adminQueries.create(username, password);

    console.log('✅ Admin user created successfully!');
    console.log(`   Username: ${username}`);
    console.log('   Please keep your password secure.');
  } catch (error: any) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await pool.end();
    process.exit(0);
  }
}

initAdmin();
