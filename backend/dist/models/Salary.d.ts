import mongoose, { Document } from 'mongoose';
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
declare const _default: any;
export default _default;
//# sourceMappingURL=Salary.d.ts.map