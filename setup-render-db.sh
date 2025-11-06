#!/bin/bash

# Quick setup script for Render PostgreSQL database
# Usage: ./setup-render-db.sh

echo "🚀 Setting up Render PostgreSQL Database..."
echo ""

# Database connection details (UPDATE THESE WITH YOUR VALUES)
DB_URL="postgresql://worker_management_user:6dEIDkS0vDLsPIW4h2op1gMBLpotY5uS@dpg-d462himuk2gs73cskhc0-a.oregon-postgres.render.com/worker_management"

# Step 1: Initialize Schema
echo "📋 Step 1: Initializing database schema..."
psql "$DB_URL" < backend/src/db/schema.sql
if [ $? -eq 0 ]; then
    echo "✅ Schema initialized successfully!"
else
    echo "❌ Schema initialization failed. Make sure psql is installed."
    echo "   Install: brew install postgresql (macOS) or apt-get install postgresql-client (Linux)"
    exit 1
fi

echo ""
echo "👤 Step 2: Creating admin user..."
echo "   This will create admin user with password 'admin123'"
echo ""

# Step 2: Create admin user (using Node.js script)
cd backend
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
DATABASE_URL=$DB_URL
JWT_SECRET=render-production-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
EOF
fi

npm install
npm run init-admin

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Deploy backend service on Render"
echo "2. Set DATABASE_URL environment variable to:"
echo "   postgresql://worker_management_user:6dEIDkS0vDLsPIW4h2op1gMBLpotY5uS@dpg-d462himuk2gs73cskhc0-a/worker_management"
echo "   (Use INTERNAL URL for backend service, not external)"
echo "3. Update Vercel with backend URL"

