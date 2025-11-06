# Render Deployment Fix - Build Error

## Problem
Error: `Cannot find module '/opt/render/project/src/backend/dist/index.js'`

This happens because:
1. Build command didn't compile TypeScript to JavaScript
2. Root Directory might be incorrectly set
3. Build output path doesn't match start command

## Solution: Update Render Configuration

### Step 1: Go to Render Dashboard
1. Open your Render service: `worker-management-system`
2. Click **"Settings"** tab

### Step 2: Update Build & Start Commands

**Root Directory:** `backend` (should already be set)

**Build Command:** 
```
npm install && npm run build
```

**Note:** TypeScript and type definitions are now in `dependencies` (not `devDependencies`) to ensure they're available during the build process.

**Start Command:** 
```
npm start
```

### Step 3: Verify Environment Variables

Make sure these are set:
```
PORT=10000
DATABASE_URL=postgresql://worker_management_user:6dElDkS0vDLsPlW4h2op1gMBLpotY5uS@dpg-d462himuk2gs73cskhc0-a/worker_management
JWT_SECRET=render-production-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=production
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp
CORS_ORIGIN=https://worker-management-system-eight.vercel.app,http://localhost:3000
```

**Important:** Use **Internal Database URL** (without `.oregon-postgres.render.com`)

### Step 4: Save and Redeploy

1. Click **"Save Changes"**
2. Go to **"Manual Deploy"** → **"Deploy latest commit"**
3. Or push a new commit to trigger auto-deploy

## Alternative: Use tsx for Development (Simpler)

If you want to skip the build step, you can use `tsx` directly:

**Build Command:** 
```
npm install
```

**Start Command:** 
```
npm run dev
```

But this requires adding `tsx` to dependencies (move from devDependencies).

## Recommended: Fix Build Process

The correct approach is to ensure the build works:

1. **Build Command:** `npm install && npm run build`
   - This installs dependencies and compiles TypeScript to `dist/` folder

2. **Start Command:** `npm start`
   - This runs `node dist/index.js` which looks for `dist/index.js` in the current directory

3. **Root Directory:** `backend`
   - This ensures Render runs commands from the `backend/` folder

## Verify Build Output

After deployment, check logs to see:
- ✅ `npm install` completed
- ✅ `npm run build` completed (should show TypeScript compilation)
- ✅ `node dist/index.js` started successfully

If you see errors in the build step, fix those first.

