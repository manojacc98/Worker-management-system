# Quick Start Guide

Get the Worker Management System up and running in 5 minutes!

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment

### Backend `.env` file
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/worker_management
JWT_SECRET=change-this-to-a-random-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp
```

### Frontend `.env.local` file
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Step 3: Start MongoDB

Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env
```

## Step 4: Create Admin User

```bash
cd backend
npm run init-admin
```

Follow the prompts to create your admin account.

## Step 5: Start Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 6: Access the Application

1. **Public Site**: Open `http://localhost:3000`
   - View worker directory
   - Click on a worker to see details
   - Submit daily updates

2. **Admin Panel**: Open `http://localhost:3000/admin/login`
   - Login with your admin credentials
   - Access dashboard, manage workers, view updates, manage salaries

## Next Steps

1. **Add Workers**: Go to Admin Panel → Workers → Add Worker
2. **Submit Updates**: Workers can submit daily updates from their detail pages
3. **Calculate Salary**: Admin Panel → Salary → Select worker → Calculate Salary
4. **Export Reports**: Admin Panel → Salary → Export buttons

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Try `mongosh` to test connection

### Port Already in Use
- Change `PORT` in backend `.env` if 5000 is taken
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local` accordingly

### File Upload Errors
- Ensure `backend/uploads` directory exists (created automatically)
- Check file size limits (default: 5MB)
- Verify allowed file types (jpg, jpeg, png, webp)

## Need Help?

Refer to `SETUP.md` for detailed documentation.

