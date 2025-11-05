/**
 * Script to seed database with dummy data
 * Run with: tsx src/scripts/seedData.ts
 */

import pool from '../db/connection';
import bcrypt from 'bcryptjs';

async function seedData() {
  try {
    console.log('🌱 Seeding database with dummy data...\n');

    // Create workers
    console.log('Creating workers...');
    const workers = await Promise.all([
      pool.query(
        `INSERT INTO workers (name, photo, hourly_rate, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        ['John Smith', '', 25.00, '09:00', '18:00']
      ),
      pool.query(
        `INSERT INTO workers (name, photo, hourly_rate, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        ['Sarah Johnson', '', 30.00, '08:00', '17:00']
      ),
      pool.query(
        `INSERT INTO workers (name, photo, hourly_rate, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        ['Mike Davis', '', 22.50, '10:00', '19:00']
      ),
      pool.query(
        `INSERT INTO workers (name, photo, hourly_rate, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        ['Emily Brown', '', 28.00, '09:30', '18:30']
      ),
      pool.query(
        `INSERT INTO workers (name, photo, hourly_rate, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        ['David Wilson', '', 27.00, '08:30', '17:30']
      ),
    ]);

    const workerIds = workers.map((w) => w.rows[0].id);
    console.log(`✅ Created ${workerIds.length} workers\n`);

    // Create updates for the last 7 days
    console.log('Creating daily updates...');
    const updates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Create updates for each worker
      for (const workerId of workerIds) {
        const comments = [
          'Completed all assigned tasks for the day. Worked on main project deliverables.',
          'Finished installation work at the site. All materials organized and stored properly.',
          'Completed daily maintenance tasks. Equipment checked and serviced.',
          'Worked on construction phase. Progress is on schedule.',
          'Completed painting and finishing work. Quality check passed.',
          'Finished plumbing installation. All connections tested and verified.',
          'Completed electrical work. Safety checks performed.',
        ];

        const hasPending = i === 0 && Math.random() > 0.7; // Some recent updates have pending work

        await pool.query(
          `INSERT INTO updates (worker_id, comment, images, has_pending_work, date)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            workerId,
            comments[Math.floor(Math.random() * comments.length)],
            [],
            hasPending,
            dateStr,
          ]
        );
        updates.push({ workerId, date: dateStr });
      }
    }
    console.log(`✅ Created ${updates.length} updates\n`);

    // Create some advances
    console.log('Creating salary advances...');
    const advances = [
      { workerId: workerIds[0], amount: 500.00, date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], notes: 'Monthly advance' },
      { workerId: workerIds[1], amount: 600.00, date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], notes: 'Emergency advance' },
      { workerId: workerIds[2], amount: 400.00, date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], notes: 'Weekly advance' },
    ];

    for (const advance of advances) {
      await pool.query(
        `INSERT INTO advances (worker_id, amount, date, notes)
         VALUES ($1, $2, $3, $4)`,
        [advance.workerId, advance.amount, advance.date, advance.notes]
      );
    }
    console.log(`✅ Created ${advances.length} advances\n`);

    // Create some salary records
    console.log('Creating salary records...');
    const endDate = new Date(today);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30); // Last month

    for (let i = 0; i < 3; i++) {
      const workerId = workerIds[i];
      const worker = await pool.query('SELECT hourly_rate, start_time, end_time FROM workers WHERE id = $1', [workerId]);
      const hourlyRate = parseFloat(worker.rows[0].hourly_rate);
      const startTime = worker.rows[0].start_time;
      const endTime = worker.rows[0].end_time;
      
      // Calculate hours (9 hours per day)
      const hours = parseInt(startTime.split(':')[0]);
      const endHours = parseInt(endTime.split(':')[0]);
      const dailyHours = endHours - hours;
      
      // Get updates count for this period
      const updatesResult = await pool.query(
        `SELECT COUNT(*) as count FROM updates 
         WHERE worker_id = $1 AND date >= $2 AND date <= $3`,
        [workerId, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
      );
      const daysWorked = parseInt(updatesResult.rows[0].count) || 20;
      const totalHours = dailyHours * daysWorked;
      
      // Get advances for this period
      const advancesResult = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM advances 
         WHERE worker_id = $1 AND date >= $2 AND date <= $3`,
        [workerId, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
      );
      const totalAdvances = parseFloat(advancesResult.rows[0].total) || 0;
      
      const grossSalary = totalHours * hourlyRate;
      const netSalary = Math.max(0, grossSalary - totalAdvances);
      const status = i === 0 ? 'paid' : 'pending';

      await pool.query(
        `INSERT INTO salaries (worker_id, cycle_type, start_date, end_date, total_hours, 
                              hourly_rate, gross_salary, advances, net_salary, status, paid_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          workerId,
          'monthly',
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
          totalHours,
          hourlyRate,
          grossSalary,
          totalAdvances,
          netSalary,
          status,
          status === 'paid' ? new Date() : null,
        ]
      );
    }
    console.log(`✅ Created 3 salary records\n`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Workers: ${workerIds.length}`);
    console.log(`   - Updates: ${updates.length}`);
    console.log(`   - Advances: ${advances.length}`);
    console.log(`   - Salaries: 3`);
  } catch (error: any) {
    console.error('❌ Error seeding database:', error.message);
    if (error.code === '23505') {
      console.log('⚠️  Some data may already exist. Skipping duplicates...');
    } else {
      throw error;
    }
  } finally {
    await pool.end();
  }
}

seedData();

