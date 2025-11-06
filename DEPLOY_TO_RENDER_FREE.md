# Deploy to Render (FREE) - Complete Guide

## ✅ Why Render?
- **100% FREE** for small applications (with some limitations)
- Free PostgreSQL database included
- Easy deployment from GitHub
- No credit card required for free tier

## 📋 Prerequisites
- GitHub account with your code pushed
- 5-10 minutes of time

## 🚀 Step-by-Step Deployment

### Step 1: Deploy PostgreSQL Database (FREE)

1. Go to [render.com](https://render.com)
2. Sign up/login with GitHub
3. Click **"New +"** → **"PostgreSQL"**
4. Configure:
   - **Name**: `worker-management-db`
   - **Database**: `worker_management`
   - **User**: `admin` (default)
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: Latest (14 or 15)
   - **Plan**: **Free** (512 MB RAM)
5. Click **"Create Database"**
6. Wait 2-3 minutes for database to be created
7. **IMPORTANT**: Copy these values:
   - **Internal Database URL** (for backend connection)
   - **External Database URL** (for local testing if needed)
   - Save these - you'll need them!

### Step 2: Initialize Database Schema

1. In Render dashboard, go to your PostgreSQL service
2. Click **"Connect"** tab
3. Copy the **Connection String** (looks like: `postgresql://user:pass@host:5432/dbname`)
4. Use one of these methods:

**Method A: Using Render's PostgreSQL Console (Easiest)**
1. Click **"Connect"** → **"psql"** (opens terminal)
2. Copy and paste the SQL from `backend/src/db/schema.sql`
3. Press Enter to execute

**Method B: Using Local Terminal**
```bash
# Install psql if not installed
# macOS: brew install postgresql
# Or use Docker: docker run -it postgres psql <your-connection-string>

# Connect and run schema
psql <your-connection-string> < backend/src/db/schema.sql
```

### Step 3: Create Admin User

**Option A: Using psql (Recommended)**
```bash
# Connect to database
psql <your-connection-string>

# Run this SQL (password will be hashed)
INSERT INTO admins (username, password) 
VALUES ('admin', '$2a$10$YourHashedPasswordHere');
```

**Option B: Using Node.js Script**
1. Clone your repo locally
2. Create `.env` file in `backend/`:
   ```
   DATABASE_URL=<your-render-postgres-connection-string>
   JWT_SECRET=your-secret-key-123
   JWT_EXPIRES_IN=7d
   ```
3. Run:
   ```bash
   cd backend
   npm install
   npm run init-admin
   ```
   Enter:
   - Username: `admin`
   - Password: `admin123`

### Step 4: Deploy Backend Service (FREE)

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository: `manojacc98/Worker-management-system`
4. Configure:
   - **Name**: `worker-management-backend`
   - **Region**: Same as database (for speed)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free** (512 MB RAM)
5. Click **"Advanced"** → **"Add Environment Variable"**
6. Add these environment variables:
   ```
   PORT=10000
   DATABASE_URL=<your-postgres-internal-connection-string>
   JWT_SECRET=<generate-random-secret-here>
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=jpg,jpeg,png,webp
   CORS_ORIGIN=https://your-vercel-app.vercel.app,http://localhost:3000
   ```
   **Important Notes**:
   - Use **Internal Database URL** for `DATABASE_URL` (faster and free)
   - Generate a random `JWT_SECRET` (e.g., use `openssl rand -base64 32`)
   - Replace `your-vercel-app.vercel.app` with your actual Vercel URL
7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment
9. Once deployed, you'll get a URL like: `https://worker-management-backend.onrender.com`
10. Test it: Visit `https://your-backend-url.onrender.com/api/health`
    - Should return: `{"status":"ok","message":"Worker Management API is running","database":"connected"}`

### Step 5: Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add/Update:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
   (Replace with your actual Render backend URL)
4. Click **Save**
5. Go to **Deployments** tab
6. Click **"..."** on latest deployment → **"Redeploy"**

### Step 6: Test Login

1. Visit your Vercel URL: `https://your-app.vercel.app/admin/login`
2. Use credentials:
   - Username: `admin`
   - Password: `admin123`
3. Should work now! 🎉

## ⚠️ Render Free Tier Limitations

- **Spins down after 15 minutes of inactivity** (first request after spin-down takes ~30 seconds)
- **512 MB RAM** (should be enough for this app)
- **Database**: 512 MB storage (free tier)
- **No custom domains** (but you can use Render's free subdomain)

## 🔧 Troubleshooting

### Backend not connecting to database?
- Make sure you're using **Internal Database URL** (not external)
- Check that `DATABASE_URL` environment variable is set correctly
- Verify database is running in Render dashboard

### Login still failing?
- Check browser console for errors
- Verify `NEXT_PUBLIC_API_URL` is set in Vercel
- Make sure admin user exists in production database
- Test backend health endpoint directly

### Backend URL not working?
- Render free tier spins down after inactivity
- First request after spin-down takes ~30 seconds
- Subsequent requests are fast

## 📝 Summary

1. ✅ Create PostgreSQL database on Render (FREE)
2. ✅ Initialize database schema
3. ✅ Create admin user
4. ✅ Deploy backend service on Render (FREE)
5. ✅ Set environment variables
6. ✅ Update Vercel `NEXT_PUBLIC_API_URL`
7. ✅ Test login

**Total Cost: $0.00** 🎉

## 🆚 Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| Free Tier | Yes ($5 credit/month) | Yes (with limitations) |
| PostgreSQL | Separate service | Free tier included |
| Spin Down | No | Yes (15 min inactivity) |
| Setup Time | ~10 min | ~15 min |
| Best For | Always-on apps | Development/testing |

**Recommendation**: Use **Render** for free deployment, or **Railway** if you have their free credit and want no spin-down.

