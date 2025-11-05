-- Worker Management System Database Schema

-- Create database (run this manually: CREATE DATABASE worker_management;)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workers table
CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  photo VARCHAR(500),
  hourly_rate DECIMAL(10, 2) NOT NULL CHECK (hourly_rate >= 0),
  start_time VARCHAR(5) NOT NULL CHECK (start_time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'),
  end_time VARCHAR(5) NOT NULL CHECK (end_time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Updates table
CREATE TABLE IF NOT EXISTS updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  images TEXT[], -- Array of image URLs
  has_pending_work BOOLEAN DEFAULT FALSE,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Advances table
CREATE TABLE IF NOT EXISTS advances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Salaries table
CREATE TABLE IF NOT EXISTS salaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  cycle_type VARCHAR(10) NOT NULL CHECK (cycle_type IN ('weekly', 'monthly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_hours DECIMAL(10, 2) NOT NULL CHECK (total_hours >= 0),
  hourly_rate DECIMAL(10, 2) NOT NULL CHECK (hourly_rate >= 0),
  gross_salary DECIMAL(10, 2) NOT NULL CHECK (gross_salary >= 0),
  advances DECIMAL(10, 2) DEFAULT 0 CHECK (advances >= 0),
  net_salary DECIMAL(10, 2) NOT NULL,
  status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  paid_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_updates_worker_id ON updates(worker_id);
CREATE INDEX IF NOT EXISTS idx_updates_date ON updates(date DESC);
CREATE INDEX IF NOT EXISTS idx_advances_worker_id ON advances(worker_id);
CREATE INDEX IF NOT EXISTS idx_advances_date ON advances(date DESC);
CREATE INDEX IF NOT EXISTS idx_salaries_worker_id ON salaries(worker_id);
CREATE INDEX IF NOT EXISTS idx_salaries_status ON salaries(status);
CREATE INDEX IF NOT EXISTS idx_salaries_start_date ON salaries(start_date DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_updates_updated_at BEFORE UPDATE ON updates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advances_updated_at BEFORE UPDATE ON advances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salaries_updated_at BEFORE UPDATE ON salaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

