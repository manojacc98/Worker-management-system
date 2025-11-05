# PostgreSQL Migration Guide

The system has been converted from MongoDB to PostgreSQL. Here's what changed:

## Changes Made

1. **Database Client**: Replaced Mongoose with `pg` (node-postgres)
2. **Database Models**: Converted to SQL queries with a query layer
3. **Connection**: PostgreSQL connection pool instead of Mongoose
4. **Schema**: SQL schema with proper relationships and constraints

## Setup Instructions

### 1. Install PostgreSQL

```bash
# macOS
brew install postgresql
brew services start postgresql

# Create database
createdb worker_management
```

### 2. Update .env File

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/worker_management
# OR use individual settings:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=worker_management
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp
```

### 3. Run Database Schema

```bash
cd backend
psql worker_management < src/db/schema.sql
```

Or connect to PostgreSQL and run the SQL manually:

```bash
psql worker_management
\i src/db/schema.sql
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Create Admin User

```bash
cd backend
npm run init-admin
```

### 6. Start Server

```bash
npm run dev
```

## Database Schema

The schema includes:
- `workers` - Worker profiles
- `admins` - Admin users
- `updates` - Daily worker updates
- `advances` - Salary advances
- `salaries` - Salary records

All tables use UUID primary keys and have proper foreign key relationships.

## Query Layer

All database operations are now handled through query functions in:
- `src/db/queries/workers.ts`
- `src/db/queries/admins.ts`
- `src/db/queries/updates.ts`
- `src/db/queries/salaries.ts`

These functions handle the PostgreSQL queries and format the results for the API.

## Notes

- UUIDs are used instead of MongoDB ObjectIds
- Snake_case for database columns, camelCase for API responses
- All relationships use proper foreign keys with CASCADE deletes
- Indexes are created for performance

