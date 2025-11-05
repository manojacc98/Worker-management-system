export interface Worker {
  id: string;
  name: string;
  photo: string;
  hourlyRate: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Update {
  id: string;
  workerId: string;
  comment: string;
  images: string[];
  hasPendingWork: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Salary {
  id: string;
  workerId: string;
  cycleType: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  totalHours: number;
  hourlyRate: number;
  grossSalary: number;
  advances: number;
  netSalary: number;
  status: 'pending' | 'paid';
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Advance {
  id: string;
  workerId: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

