# Fix Vercel 404 Error

## Problem
Vercel is showing a 404 error because it's not configured to use the `frontend` directory.

## Solution

### Option 1: Configure Root Directory in Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Click **Settings** → **General**
3. Scroll down to **Root Directory**
4. Set it to: `frontend`
5. Click **Save**
6. Go to **Deployments** tab
7. Click the **"..."** menu on the latest deployment
8. Click **Redeploy**

### Option 2: Use vercel.json (Alternative)

A `vercel.json` file has been created in the root directory. However, Vercel's dashboard setting takes precedence.

## Important Vercel Settings

### In Vercel Dashboard:

1. **Root Directory**: `frontend`
2. **Framework Preset**: Next.js
3. **Build Command**: `npm run build` (leave as default)
4. **Output Directory**: `.next` (leave as default)
5. **Install Command**: `npm install` (leave as default)

### Environment Variables:

Add this in Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

Replace with your actual backend URL.

## After Configuration

1. Vercel will automatically redeploy
2. Wait for build to complete
3. Your app should now work at `https://your-project.vercel.app`

## Verify Build

Check the build logs in Vercel to ensure:
- ✅ Root directory is set to `frontend`
- ✅ Build completes successfully
- ✅ No errors in build logs

