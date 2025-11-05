import mongoose, { Schema, Document } from 'mongoose';

export interface ISalary extends Document {
  workerId: mongoose.Types.ObjectId;
  cycleType: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  totalHours: number;
  hourlyRate: number;
  grossSalary: number;
  advances: number;
  netSalary: number;
  status: 'pending' | 'paid';
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SalarySchema: Schema = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: 'Worker',
      required: [true, 'Worker ID is required'],
    },
    cycleType: {
      type: String,
      enum: ['weekly', 'monthly'],
      required: [true, 'Cycle type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    totalHours: {
      type: Number,
      required: [true, 'Total hours is required'],
      min: [0, 'Total hours must be positive'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Hourly rate must be positive'],
    },
    grossSalary: {
      type: Number,
      required: [true, 'Gross salary is required'],
      min: [0, 'Gross salary must be positive'],
    },
    advances: {
      type: Number,
      default: 0,
      min: [0, 'Advances must be positive'],
    },
    netSalary: {
      type: Number,
      required: [true, 'Net salary is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    paidAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
SalarySchema.index({ workerId: 1, startDate: -1 });
SalarySchema.index({ status: 1 });

export default mongoose.model<ISalary>('Salary', SalarySchema);

