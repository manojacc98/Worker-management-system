# Vercel Deployment Guide

This guide will help you deploy the Worker Management System frontend to Vercel.

## Prerequisites

1. GitHub repository pushed (✅ Done)
2. Vercel account (sign up at https://vercel.com)
3. Backend API deployed (Railway/Render/AWS) - See backend deployment section

## Frontend Deployment on Vercel

### Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `manojacc98/Worker-management-system`
4. Vercel will auto-detect it's a Next.js project

### Step 2: Configure Project Settings

**Root Directory:** Set to `frontend`

**Build Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install`

**Environment Variables:**
Add these in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```
(Replace with your actual backend URL)

### Step 3: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Your app will be live at: `https://your-project.vercel.app`

## Backend Deployment (Railway/Render)

### Option 1: Railway

1. Go to [Railway](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Set Root Directory to `backend`
5. Add Environment Variables:
   ```
   PORT=5000
   DATABASE_URL=your-postgresql-connection-string
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=jpg,jpeg,png,webp
   ```
6. Railway will auto-detect Node.js and deploy
7. Get your Railway URL (e.g., `https://your-app.railway.app`)
8. Update `NEXT_PUBLIC_API_URL` in Vercel with this URL

### Option 2: Render

1. Go to [Render](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Set:
   - Name: worker-management-backend
   - Root Directory: `backend`
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add Environment Variables (same as Railway)
6. Deploy and get your Render URL
7. Update `NEXT_PUBLIC_API_URL` in Vercel

## Post-Deployment Steps

### 1. Initialize Database

Run the SQL schema on your PostgreSQL database:
```bash
psql your-database-url < backend/src/db/schema.sql
```

### 2. Create Admin User

SSH into your backend or use Railway/Render console:
```bash
cd backend
npm run init-admin
```

### 3. Update CORS

In `backend/src/index.ts`, update CORS to allow your Vercel domain:
```typescript
app.use(cors({
  origin: ['https://your-project.vercel.app', 'http://localhost:3000']
}));
```

### 4. File Uploads

For production, consider using AWS S3 or Cloudflare R2 instead of local storage.

## Environment Variables Summary

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` - Your backend API URL

### Backend (Railway/Render)
- `PORT` - Server port (usually 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (e.g., 7d)
- `NODE_ENV` - Set to `production`
- `UPLOAD_DIR` - Upload directory (default: ./uploads)
- `MAX_FILE_SIZE` - Max file size in bytes
- `ALLOWED_FILE_TYPES` - Allowed file types

## Troubleshooting

### Frontend not connecting to backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend CORS allows your Vercel domain
- Check backend is running and accessible

### Database connection errors
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is accessible from your backend server
- Check firewall rules

### Build errors
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

## Support

For issues, check:
- Vercel deployment logs
- Backend server logs
- Database connection status

