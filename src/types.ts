export type YearFormat = 'be' | 'ce'; // พ.ศ. or ค.ศ.

export interface PinnedItem {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  includeEndDate: boolean;
  createdAt: number;
  totalDays: number;
  roundedWeeks: number; // ปัดเศษขึ้นเสมอ
  exactWeeks: number;
}

export interface DateDiffResult {
  isReverse: boolean;
  totalDays: number;
  exactWeeks: number;
  roundedWeeks: number; // Math.ceil(totalDays / 7)
  fullWeeks: number;
  remainingDays: number;
}
