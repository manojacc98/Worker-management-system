# Worker Management & Admin Portal

A comprehensive web-based Worker Management and Tracking System for simplifying worker activity tracking, daily updates, and salary management.

## Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT + bcrypt
- **File Storage**: Local filesystem (configurable for AWS S3/Cloudflare R2)

## Project Structure

```
Worker_management/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── shared/            # Shared types and utilities
└── README.md          # This file
```

## Features

### Public/Worker Features
- View worker directory
- View worker details
- Submit daily updates (comments, images, pending work)

### Admin Features
- Secure password-protected login
- Dashboard with overview
- Worker management (CRUD)
- View all worker updates
- Salary management (hourly rate, advances, calculations)
- Weekly/Monthly salary cycles
- CSV report exports

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn

### Installation

1. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

2. Set up environment variables:
- Copy `.env.example` to `.env` in both frontend and backend folders
- Configure MongoDB connection string and JWT secret

3. Run development servers:
```bash
# Backend (from backend folder)
npm run dev

# Frontend (from frontend folder)
npm run dev
```

## Deployment

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway/Render/AWS

## License

MIT

