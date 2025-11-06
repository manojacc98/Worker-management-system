import { Document } from 'mongoose';
export interface IAdmin extends Document {
    username: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=Admin.d.ts.map