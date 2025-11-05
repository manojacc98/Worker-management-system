import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvance extends Document {
  workerId: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdvanceSchema: Schema = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: 'Worker',
      required: [true, 'Worker ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Advance amount is required'],
      min: [0.01, 'Advance amount must be positive'],
    },
    date: {
      type: Date,
      default: Date.now,
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
AdvanceSchema.index({ workerId: 1, date: -1 });

export default mongoose.model<IAdvance>('Advance', AdvanceSchema);

