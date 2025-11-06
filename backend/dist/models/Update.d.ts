import mongoose, { Document } from 'mongoose';
export interface IUpdate extends Document {
    workerId: mongoose.Types.ObjectId;
    comment: string;
    images: string[];
    hasPendingWork: boolean;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=Update.d.ts.map