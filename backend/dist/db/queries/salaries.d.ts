import { Salary, Advance } from '../../types';
export declare const salaryQueries: {
    getAll: (workerId?: string, status?: string, cycleType?: string) => Promise<{
        id: any;
        workerId: any;
        cycleType: any;
        startDate: any;
        endDate: any;
        totalHours: number;
        hourlyRate: number;
        grossSalary: number;
        advances: number;
        netSalary: number;
        status: any;
        paidAt: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    getById: (id: string) => Promise<{
        id: any;
        workerId: any;
        cycleType: any;
        startDate: any;
        endDate: any;
        totalHours: number;
        hourlyRate: number;
        grossSalary: number;
        advances: number;
        netSalary: number;
        status: any;
        paidAt: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
    create: (salary: Partial<Salary>) => Promise<{
        id: any;
        workerId: {
            id: any;
            name: any;
            photo: any;
            hourlyRate: number;
        } | null;
        cycleType: any;
        startDate: any;
        endDate: any;
        totalHours: number;
        hourlyRate: number;
        grossSalary: number;
        advances: number;
        netSalary: number;
        status: any;
        paidAt: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    markPaid: (id: string) => Promise<any>;
    countPending: () => Promise<number>;
    sumPendingAmount: () => Promise<number>;
    getByWorkerId: (workerId: string) => Promise<{
        id: any;
        workerId: any;
        cycleType: any;
        startDate: any;
        endDate: any;
        totalHours: number;
        hourlyRate: number;
        grossSalary: number;
        advances: number;
        netSalary: number;
        status: any;
        paidAt: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
};
export declare const advanceQueries: {
    getByWorkerId: (workerId: string, startDate?: string, endDate?: string) => Promise<{
        id: any;
        workerId: any;
        amount: number;
        date: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    create: (advance: Partial<Advance>) => Promise<{
        id: any;
        workerId: {
            id: any;
            name: any;
        } | null;
        amount: number;
        date: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    sumByWorkerId: (workerId: string, startDate: string, endDate: string) => Promise<number>;
};
//# sourceMappingURL=salaries.d.ts.map