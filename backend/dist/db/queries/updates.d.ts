import { Update } from '../../types';
export declare const updateQueries: {
    getAll: (workerId?: string, date?: string, limit?: number) => Promise<{
        id: any;
        workerId: any;
        comment: any;
        images: any;
        hasPendingWork: any;
        date: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    getById: (id: string) => Promise<{
        id: any;
        workerId: any;
        comment: any;
        images: any;
        hasPendingWork: any;
        date: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
    getByWorkerId: (workerId: string, limit?: number) => Promise<{
        id: any;
        workerId: any;
        comment: any;
        images: any;
        hasPendingWork: any;
        date: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    create: (update: Partial<Update>) => Promise<{
        id: any;
        workerId: {
            id: any;
            name: any;
            photo: any;
        } | null;
        comment: any;
        images: any;
        hasPendingWork: any;
        date: any;
        createdAt: any;
        updatedAt: any;
    }>;
    countPending: () => Promise<number>;
    count: (query?: {
        workerId?: string;
        hasPendingWork?: boolean;
    }) => Promise<number>;
};
//# sourceMappingURL=updates.d.ts.map