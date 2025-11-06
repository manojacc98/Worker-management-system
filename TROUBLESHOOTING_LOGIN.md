# Troubleshooting Login Error - Backend Connection

## Error Message
"Cannot connect to backend server. Please ensure the backend is deployed and NEXT_PUBLIC_API_URL is set correctly."

## Quick Fixes

### Step 1: Verify Vercel Environment Variable

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Check if `NEXT_PUBLIC_API_URL` exists and value is:
   ```
   https://worker-management-system-jcp0.onrender.com
   ```
3. Make sure it's set for **All Environments** (Production, Preview, Development)
4. Click **Save**
5. **IMPORTANT:** Go to **Deployments** tab → Click **"..."** → **"Redeploy"**
   - Vercel needs to redeploy for environment variables to take effect!

### Step 2: Test Backend Directly

Open in browser:
```
https://worker-management-system-jcp0.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Worker Management API is running",
  "database": "connected"
}
```

If this doesn't work:
- Backend might be spinning down (free tier)
- Wait 30 seconds and try again
- First request after spin-down takes ~30 seconds

### Step 3: Check Browser Console

1. Open login page
2. Press **F12** or **Right-click → Inspect → Console**
3. Look for errors
4. Check **Network** tab for failed requests

### Step 4: Verify CORS Settings

In Render dashboard → Backend service → **Environment Variables**:
```
CORS_ORIGIN=https://worker-management-system-eight.vercel.app,https://worker-management-system-git-main-manojs-projects-4ea21a96.vercel.app,http://localhost:3000
```

Make sure your Vercel URL is included!

### Step 5: Force Vercel Redeploy

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete
5. Try login again

## Common Issues

### Issue 1: Environment Variable Not Taking Effect
**Solution:** Vercel needs to redeploy after setting environment variables. Always redeploy after adding/updating env vars.

### Issue 2: Backend Spun Down (Free Tier)
**Solution:** Render free tier spins down after 15 min inactivity. First request takes ~30 seconds. Subsequent requests are fast.

### Issue 3: Wrong Backend URL
**Solution:** Verify the URL is exactly:
```
https://worker-management-system-jcp0.onrender.com
```
(No trailing slash, no `/api`)

### Issue 4: CORS Error
**Solution:** Add your Vercel URL to `CORS_ORIGIN` in Render environment variables.

## Debug Steps

1. ✅ Check Vercel environment variable is set
2. ✅ Redeploy Vercel after setting env var
3. ✅ Test backend health endpoint directly
4. ✅ Check browser console for errors
5. ✅ Verify CORS settings in Render
6. ✅ Wait 30 seconds if backend spun down

## Still Not Working?

1. Check browser console for exact error message
2. Check Network tab for request URL
3. Verify backend logs in Render dashboard
4. Test backend health endpoint directly

