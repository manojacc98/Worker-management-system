import { Worker } from '../../types';
export declare const workerQueries: {
    getAll: (search?: string, sortBy?: string, sortOrder?: string) => Promise<any[]>;
    getById: (id: string) => Promise<any>;
    create: (worker: Partial<Worker>) => Promise<any>;
    update: (id: string, worker: Partial<Worker>) => Promise<any>;
    delete: (id: string) => Promise<any>;
    count: () => Promise<number>;
};
//# sourceMappingURL=workers.d.ts.map