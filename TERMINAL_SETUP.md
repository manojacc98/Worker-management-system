# Terminal Setup - Troubleshooting Guide

## Issue: Password Authentication Failed

The connection is failing because:
1. The password might contain special characters that need escaping
2. The password might be truncated in the screenshot
3. SSL/TLS is required for external connections

## Solution 1: Get Exact Connection String from Render

1. Go to Render dashboard → Your PostgreSQL service
2. Click **"Connect"** tab
3. **Copy the exact External Database URL** (it should be fully visible)
4. Make sure there are no `...` truncations

## Solution 2: Use Environment Variable (Recommended)

Instead of putting the password in the command, use an environment variable:

```bash
# Export the password as environment variable
export PGPASSWORD='6dEIDkS0vDLsPIW4h2op1gMBLpotY5uS'

# Then connect with SSL
psql -h dpg-d462himuk2gs73cskhc0-a.oregon-postgres.render.com \
     -U worker_management_user \
     -d worker_management \
     --set=sslmode=require \
     -f backend/src/db/schema.sql
```

## Solution 3: Use Connection String with SSL

```bash
# Use the connection string with sslmode parameter
psql "postgresql://worker_management_user:YOUR_PASSWORD@dpg-d462himuk2gs73cskhc0-a.oregon-postgres.render.com/worker_management?sslmode=require" < backend/src/db/schema.sql
```

**Important**: Replace `YOUR_PASSWORD` with the exact password from Render dashboard (copy it fully, don't type it)

## Solution 4: Use Render's Built-in Console (Easiest - No SSL Issues)

1. Go to Render dashboard → PostgreSQL service
2. Click **"Connect"** tab
3. Click **"Connect"** button (opens PostgreSQL console)
4. Copy all SQL from `backend/src/db/schema.sql`
5. Paste into the console
6. Press Enter

This method handles SSL automatically and is the easiest way!

## Verify Password

If password authentication still fails:
1. Go to Render dashboard → PostgreSQL service
2. Click **"Info"** tab
3. Click the **eye icon** to show password
4. **Copy the full password** (make sure it's not truncated)
5. Try the connection again

## Next Step After Schema Initialization

Once schema is initialized, create admin user:

```bash
cd backend
# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://worker_management_user:YOUR_PASSWORD@dpg-d462himuk2gs73cskhc0-a.oregon-postgres.render.com/worker_management
JWT_SECRET=render-production-secret-key-change-this
JWT_EXPIRES_IN=7d
EOF

npm install
npm run init-admin
# Enter: username: admin, password: admin123
```

