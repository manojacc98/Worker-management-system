import mongoose, { Schema, Document } from 'mongoose';

export interface IUpdate extends Document {
  workerId: mongoose.Types.ObjectId;
  comment: string;
  images: string[];
  hasPendingWork: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UpdateSchema: Schema = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: 'Worker',
      required: [true, 'Worker ID is required'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    hasPendingWork: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
UpdateSchema.index({ workerId: 1, date: -1 });
UpdateSchema.index({ date: -1 });

export default mongoose.model<IUpdate>('Update', UpdateSchema);

