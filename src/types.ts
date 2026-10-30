export type YearFormat = 'be' | 'ce'; // พ.ศ. or ค.ศ.
export type ThemeMode = 'comfort' | 'dark'; // 'comfort' (สบายตานวลแสง) | 'dark' (มืดถนอมสายตา)
export type ColumnSide = 'left' | 'right';

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

export interface BaseMedModule {
  id: string;
  title: string;
  extraDays: number;
  column: ColumnSide;
}

export interface WarfarinModule extends BaseMedModule {
  type: 'warfarin';
  tablets: number;
  selectedDays: number[];
}

export interface InsulinModule extends BaseMedModule {
  type: 'insulin';
  morning: number;
  noon: number;
  evening: number;
  bedtime: number;
  packSize: number;
}

export type MedModuleItem = WarfarinModule | InsulinModule;
