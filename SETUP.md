# Worker Management System - Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- npm or yarn package manager

## Installation Steps

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/worker_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp
```

### 2. Initialize Admin User

Before starting the backend, create an admin user:

```bash
cd backend
npx tsx src/scripts/initAdmin.ts
```

Follow the prompts to create your admin account.

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 5. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
Worker_management/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   ├── utils/           # Utility functions
│   │   ├── scripts/         # Setup scripts
│   │   └── index.ts         # Entry point
│   ├── uploads/             # Uploaded images (created automatically)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   └── lib/             # API client & utilities
│   └── package.json
└── README.md
```

## Features

### Public Pages
- Home page with link to worker directory
- Worker directory with search and filter
- Worker details page with update submission form

### Admin Pages (Password Protected)
- Dashboard with statistics
- Worker management (CRUD)
- View all worker updates
- Salary management with weekly/monthly cycles
- Advance salary management
- CSV export for payroll, attendance, and pending work
- Settings (change password)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/change-password` - Change admin password
- `GET /api/auth/verify` - Verify token

### Workers
- `GET /api/workers` - Get all workers (public)
- `GET /api/workers/:id` - Get worker by ID (public)
- `POST /api/workers` - Create worker (admin)
- `PUT /api/workers/:id` - Update worker (admin)
- `DELETE /api/workers/:id` - Delete worker (admin)

### Updates
- `GET /api/updates` - Get all updates
- `GET /api/updates/:id` - Get update by ID
- `GET /api/updates/worker/:workerId` - Get updates for a worker
- `POST /api/updates` - Create update (public)

### Salary
- `GET /api/salary` - Get all salaries (admin)
- `GET /api/salary/worker/:workerId` - Get salaries for a worker
- `POST /api/salary` - Calculate and create salary (admin)
- `PATCH /api/salary/:id/paid` - Mark salary as paid (admin)
- `GET /api/salary/advances/:workerId` - Get advances for a worker
- `POST /api/salary/advances` - Create advance (admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/export/:type` - Export CSV reports (payroll, attendance, pending-work)

## Database Models

### Worker
- name, photo, hourlyRate, startTime, endTime

### Update
- workerId, comment, images[], hasPendingWork, date

### Salary
- workerId, cycleType, startDate, endDate, totalHours, hourlyRate, grossSalary, advances, netSalary, status

### Advance
- workerId, amount, date, notes

### Admin
- username, password (hashed)

## Security Notes

- All admin routes require JWT authentication
- Passwords are hashed using bcrypt
- File uploads are validated by type and size
- CORS is enabled for frontend communication

## Deployment

### Backend
- Deploy to Railway, Render, or AWS
- Set environment variables
- Ensure MongoDB connection is accessible
- Configure file storage (consider using S3/R2 for production)

### Frontend
- Deploy to Vercel
- Set `NEXT_PUBLIC_API_URL` to your backend URL
- Configure CORS on backend to allow frontend domain

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network access if using cloud MongoDB

### File Upload Issues
- Check `UPLOAD_DIR` exists and is writable
- Verify `MAX_FILE_SIZE` and `ALLOWED_FILE_TYPES` settings
- Ensure uploads directory is served statically

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration settings
- Ensure cookies are enabled in browser

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

