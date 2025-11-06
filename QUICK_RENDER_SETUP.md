# Quick Render Setup - Next Steps

## ✅ Step 1: Database Created (DONE!)
You've successfully created the PostgreSQL database on Render.

## 🔧 Step 2: Initialize Database Schema

You have two options:

### Option A: Using Render's PostgreSQL Console (Easiest)

1. In Render dashboard, go to your PostgreSQL service
2. Click **"Connect"** tab
3. Click **"Connect"** button (opens PostgreSQL console)
4. Copy the entire SQL from `backend/src/db/schema.sql` 
5. Paste it into the console
6. Press Enter to execute
7. You should see "CREATE TABLE" messages if successful

### Option B: Using Local Terminal (psql)

```bash
# Connect to database using External Database URL
psql "postgresql://worker_management_user:6dEIDkS0vDLsPIW4h2op1gMBLpotY5uS@dpg-d462himuk2gs73cskhc0-a.oregon-postgres.render.com/worker_management"

# Then run the schema file
\i backend/src/db/schema.sql

# Or directly:
psql "postgresql://worker_management_user:6dEIDkS0vDLsPIW4h2op1gMBLpotY5uS@dpg-d462himuk2gs73cskhc0-a.oregon-postgres.render.com/worker_management" < backend/src/db/schema.sql
```

## 👤 Step 3: Create Admin User

**Using psql:**

```bash
# Connect to database
psql "postgresql://worker_management_user:6dEIDkS0vDLsPIW4h2op1gMBLpotY5uS@dpg-d462himuk2gs73cskhc0-a.oregon-postgres.render.com/worker_management"

# Then run this SQL (password will be hashed):
```

Or use the Node.js script:

```bash
cd backend
# Create .env file with:
DATABASE_URL=postgresql://worker_management_user:6dEIDkS0vDLsPIW4h2op1gMBLpotY5uS@dpg-d462himuk2gs73cskhc0-a.oregon-postgres.render.com/worker_management
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRES_IN=7d

npm install
npm run init-admin
# Enter: username: admin, password: admin123
```

## 🚀 Step 4: Deploy Backend Service on Render

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select: `manojacc98/Worker-management-system`
4. Configure:
   - **Name**: `worker-management-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**
5. Add Environment Variables:
   ```
   PORT=10000
   DATABASE_URL=postgresql://worker_management_user:6dEIDkS0vDLsPIW4h2op1gMBLpotY5uS@dpg-d462himuk2gs73cskhc0-a/worker_management
   JWT_SECRET=<generate-random-secret-here>
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=jpg,jpeg,png,webp
   CORS_ORIGIN=https://worker-management-system-eight.vercel.app,http://localhost:3000
   ```
   **Important**: Use **Internal Database URL** (without `.oregon-postgres.render.com`)
6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. Get your backend URL (e.g., `https://worker-management-backend.onrender.com`)

## 🔗 Step 5: Update Vercel

1. Go to Vercel dashboard → Your project → **Settings** → **Environment Variables**
2. Add/Update:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
3. Click **Save**
4. Go to **Deployments** → Click **"..."** → **"Redeploy"**

## ✅ Step 6: Test

1. Visit: `https://worker-management-system-eight.vercel.app/admin/login`
2. Login with:
   - Username: `admin`
   - Password: `admin123`

Done! 🎉

