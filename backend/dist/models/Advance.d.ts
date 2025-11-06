import mongoose, { Document } from 'mongoose';
export interface IAdvance extends Document {
    workerId: mongoose.Types.ObjectId;
    amount: number;
    date: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=Advance.d.ts.map