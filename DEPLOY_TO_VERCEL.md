# Deploy to Vercel - Step by Step Guide

## ✅ Code Pushed to GitHub
Your code is now available at: `https://github.com/manojacc98/Worker-management-system.git`

## 🚀 Deploy Frontend to Vercel

### Step 1: Sign Up / Login to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended) or email
3. Authorize Vercel to access your GitHub repositories

### Step 2: Import Your Repository
1. Click **"Add New"** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select **`manojacc98/Worker-management-system`**
4. Click **"Import"**

### Step 3: Configure Project Settings

**IMPORTANT:** Set the Root Directory to `frontend`

1. In the **Root Directory** field, enter: `frontend`
2. Framework Preset: **Next.js** (should auto-detect)
3. Build Command: `npm run build` (default)
4. Output Directory: `.next` (default)
5. Install Command: `npm install` (default)

### Step 4: Add Environment Variable

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

**Note:** You'll need to deploy your backend first (see below) to get this URL.

### Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Wait for deployment to complete (2-3 minutes)
4. Your app will be live at: `https://your-project.vercel.app`

## 🔧 Deploy Backend (Railway - Recommended)

### Step 1: Sign Up to Railway
1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **`manojacc98/Worker-management-system`**

### Step 3: Configure Service
1. Click on the service
2. Go to **Settings** → **Root Directory**
3. Set to: `backend`

### Step 4: Add PostgreSQL Database
1. In Railway dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create a PostgreSQL database
4. Copy the **Connection String** (DATABASE_URL)

### Step 5: Add Environment Variables
Go to your backend service → **Variables** and add:

```
PORT=5000
DATABASE_URL=<your-postgresql-connection-string-from-railway>
JWT_SECRET=<generate-a-random-secret-key>
JWT_EXPIRES_IN=7d
NODE_ENV=production
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp
CORS_ORIGIN=https://your-project.vercel.app,http://localhost:3000
```

### Step 6: Initialize Database
1. Go to your PostgreSQL service in Railway
2. Click **"Connect"** → **"Postgres URL"**
3. Use this URL to connect and run:
   ```bash
   psql <your-railway-postgres-url> < backend/src/db/schema.sql
   ```
   Or use Railway's PostgreSQL console to run the SQL schema

### Step 7: Deploy Backend
1. Railway will auto-deploy when you push to GitHub
2. Or click **"Deploy"** manually
3. Get your Railway backend URL (e.g., `https://your-app.railway.app`)

### Step 8: Update Frontend Environment Variable
1. Go back to Vercel
2. Go to your project → **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_API_URL` to your Railway backend URL
4. Redeploy the frontend

### Step 9: Create Admin User
1. In Railway, go to your backend service
2. Click **"View Logs"** → **"Open Shell"**
3. Run:
   ```bash
   cd backend
   npm run init-admin
   ```
4. Enter admin credentials

## 📝 Quick Checklist

- [ ] Code pushed to GitHub ✅
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] PostgreSQL database created
- [ ] Database schema initialized
- [ ] Environment variables configured
- [ ] Admin user created
- [ ] CORS configured on backend
- [ ] Frontend environment variable updated with backend URL

## 🔗 Your URLs

- **GitHub Repo**: https://github.com/manojacc98/Worker-management-system
- **Frontend (Vercel)**: https://your-project.vercel.app (after deployment)
- **Backend (Railway)**: https://your-app.railway.app (after deployment)

## 🎉 You're Done!

Once both are deployed:
1. Visit your Vercel frontend URL
2. Login with admin credentials
3. Start using the Worker Management System!

## 🆘 Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running (check Railway logs)
- Check CORS_ORIGIN includes your Vercel URL

### Database connection errors
- Verify DATABASE_URL is correct
- Check PostgreSQL is running in Railway
- Ensure schema is initialized

### Build errors
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs in Vercel/Railway

