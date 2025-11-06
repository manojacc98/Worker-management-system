/**
 * Calculate total hours worked based on start and end time
 * @param startTime Time in HH:mm format (e.g., "09:00")
 * @param endTime Time in HH:mm format (e.g., "18:00")
 * @returns Total hours worked (decimal)
 */
export declare const calculateHours: (startTime: string, endTime: string) => number;
/**
 * Calculate salary breakdown
 * @param totalHours Total hours worked
 * @param hourlyRate Hourly rate
 * @param advances Total advances taken
 * @returns Salary breakdown object
 */
export declare const calculateSalary: (totalHours: number, hourlyRate: number, advances?: number) => {
    totalHours: number;
    hourlyRate: number;
    grossSalary: number;
    advances: number;
    netSalary: number;
};
/**
 * Get date range for salary cycle
 * @param cycleType 'weekly' or 'monthly'
 * @param endDate End date of the cycle
 * @returns Start and end dates
 */
export declare const getSalaryCycleDates: (cycleType: "weekly" | "monthly", endDate: Date) => {
    startDate: Date;
    endDate: Date;
};
//# sourceMappingURL=salaryCalculation.d.ts.map