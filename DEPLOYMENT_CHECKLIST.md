# Deployment Checklist - Fix Login Issues

## Current Problem
Login is failing on Vercel because the backend is not deployed or not properly configured.

## Step-by-Step Fix

### ✅ Step 1: Deploy Backend First (Railway/Render)

**Option A: Railway (Recommended)**

1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository: `manojacc98/Worker-management-system`
5. Click **"Add Service"** → **"GitHub Repo"** → Select your repo again
6. In the service settings:
   - **Root Directory**: Set to `backend`
   - **Build Command**: Leave empty (Railway auto-detects)
   - **Start Command**: `npm start` (or `npm run dev` for development)
7. Add PostgreSQL database:
   - Click **"New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway will create a PostgreSQL database
   - Copy the **DATABASE_URL** from the PostgreSQL service
8. Add Environment Variables to your backend service:
   ```
   PORT=5000
   DATABASE_URL=<paste-your-railway-postgres-url>
   JWT_SECRET=<generate-a-random-secret-key-here>
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=jpg,jpeg,png,webp
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```
9. Initialize database schema:
   - Go to PostgreSQL service → **"Connect"** → **"Postgres URL"**
   - Use Railway's built-in PostgreSQL console or connect via psql
   - Run: Copy the SQL from `backend/src/db/schema.sql` and execute it
10. Deploy - Railway will auto-deploy
11. Get your Railway backend URL (e.g., `https://your-app.railway.app`)

### ✅ Step 2: Create Admin User in Production Database

**Using Railway PostgreSQL Console:**

1. In Railway, go to your PostgreSQL service
2. Click **"Connect"** → **"Postgres URL"**
3. Use Railway's PostgreSQL console or connect via terminal:
   ```bash
   psql <your-railway-postgres-url>
   ```
4. Run this SQL to create admin user:
   ```sql
   INSERT INTO admins (username, password) 
   VALUES ('admin', '$2a$10$YourHashedPasswordHere');
   ```
   
   **OR** use the Node.js script:
   - In Railway, go to your backend service
   - Click **"View Logs"** → **"Open Shell"**
   - Run:
     ```bash
     cd backend
     npm run init-admin
     ```
   - Enter username: `admin`
   - Enter password: `admin123`

### ✅ Step 3: Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add/Update:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
   ```
   (Replace with your actual Railway backend URL)
4. Click **Save**
5. Go to **Deployments** tab
6. Click **"..."** on latest deployment → **"Redeploy"**

### ✅ Step 4: Update Backend CORS

Make sure your backend CORS includes your Vercel URL:

In `backend/src/index.ts`, the CORS should include:
```typescript
origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000']
```

Set `CORS_ORIGIN` in Railway to:
```
https://your-vercel-app.vercel.app,http://localhost:3000
```

### ✅ Step 5: Test Login

1. Visit your Vercel URL: `https://your-app.vercel.app/admin/login`
2. Use credentials:
   - Username: `admin`
   - Password: `admin123`
3. Should work now!

## Quick Troubleshooting

### Check Backend is Running
- Visit: `https://your-railway-backend-url.railway.app/api/health`
- Should return: `{"status":"ok","message":"Worker Management API is running","database":"connected"}`

### Check Frontend API URL
- Open browser console on Vercel site
- Check Network tab when logging in
- Verify requests go to your Railway backend URL

### Check Database Connection
- Railway PostgreSQL should show "Running"
- Backend logs should show "✅ Connected to PostgreSQL"

### Common Issues

**Issue**: "Network Error" or "Cannot connect"
- **Solution**: Backend not deployed or `NEXT_PUBLIC_API_URL` not set correctly

**Issue**: "Invalid credentials"
- **Solution**: Admin user not created in production database

**Issue**: CORS errors
- **Solution**: Add Vercel URL to `CORS_ORIGIN` in backend environment variables

## Summary

1. ✅ Deploy backend to Railway
2. ✅ Create PostgreSQL database
3. ✅ Initialize database schema
4. ✅ Create admin user in production database
5. ✅ Set `NEXT_PUBLIC_API_URL` in Vercel
6. ✅ Update backend CORS_ORIGIN
7. ✅ Test login

Once all steps are complete, login will work!

