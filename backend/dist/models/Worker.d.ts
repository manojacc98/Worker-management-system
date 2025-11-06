import { Document } from 'mongoose';
export interface IWorker extends Document {
    name: string;
    photo: string;
    hourlyRate: number;
    startTime: string;
    endTime: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=Worker.d.ts.map