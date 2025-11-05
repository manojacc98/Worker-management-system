/**
 * Calculate total hours worked based on start and end time
 * @param startTime Time in HH:mm format (e.g., "09:00")
 * @param endTime Time in HH:mm format (e.g., "18:00")
 * @returns Total hours worked (decimal)
 */
export const calculateHours = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  // Handle case where end time is next day
  let diffMinutes = endTotalMinutes - startTotalMinutes;
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60; // Add 24 hours
  }

  return diffMinutes / 60;
};

/**
 * Calculate salary breakdown
 * @param totalHours Total hours worked
 * @param hourlyRate Hourly rate
 * @param advances Total advances taken
 * @returns Salary breakdown object
 */
export const calculateSalary = (
  totalHours: number,
  hourlyRate: number,
  advances: number = 0
) => {
  const grossSalary = totalHours * hourlyRate;
  const netSalary = Math.max(0, grossSalary - advances);

  return {
    totalHours: parseFloat(totalHours.toFixed(2)),
    hourlyRate,
    grossSalary: parseFloat(grossSalary.toFixed(2)),
    advances: parseFloat(advances.toFixed(2)),
    netSalary: parseFloat(netSalary.toFixed(2)),
  };
};

/**
 * Get date range for salary cycle
 * @param cycleType 'weekly' or 'monthly'
 * @param endDate End date of the cycle
 * @returns Start and end dates
 */
export const getSalaryCycleDates = (cycleType: 'weekly' | 'monthly', endDate: Date) => {
  const end = new Date(endDate);
  const start = new Date(end);

  if (cycleType === 'weekly') {
    start.setDate(end.getDate() - 6); // 7 days including today
  } else {
    // Monthly
    start.setMonth(end.getMonth() - 1);
    start.setDate(end.getDate() + 1); // Start from next day of previous month
  }

  return { startDate: start, endDate: end };
};

