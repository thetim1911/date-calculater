import { DateDiffResult, YearFormat } from '../types';

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export const THAI_DAYS_SHORT = [
  'อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'
];

/**
 * Format date for clean display (e.g. 29 ต.ค. 2569)
 */
export function formatThaiDate(
  dateInput: Date | string,
  yearFormat: YearFormat = 'be',
  includeDayOfWeek: boolean = true
): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '-';

  const dayOfWeek = THAI_DAYS_SHORT[d.getDay()];
  const dateNum = d.getDate();
  const monthName = THAI_MONTHS_SHORT[d.getMonth()];
  const rawYear = d.getFullYear();
  const displayYear = yearFormat === 'be' ? rawYear + 543 : rawYear;

  if (includeDayOfWeek) {
    return `${dayOfWeek} ${dateNum} ${monthName} ${displayYear}`;
  }
  return `${dateNum} ${monthName} ${displayYear}`;
}

/**
 * Format date in concise slash format e.g. 29/10/69 หรือ 6/11/69
 * Matches user's exact specification: "29 ต.ค. 2569 ถึง 6 พ.ย. 2569 ให้เป็น 29/10/69 ถึง 6/11/69"
 */
export function formatSlashDate(
  dateInput: Date | string,
  yearFormat: YearFormat = 'be'
): string {
  if (!dateInput) return '-';
  let d: Date;
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-');
    if (parts.length === 3) {
      d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else {
      d = new Date(dateInput);
    }
  } else {
    d = dateInput;
  }
  if (isNaN(d.getTime())) return '-';

  const day = d.getDate();
  const month = d.getMonth() + 1;
  const rawYear = d.getFullYear();
  const displayYear = yearFormat === 'be' ? rawYear + 543 : rawYear;
  const shortYear = String(displayYear).slice(-2);

  return `${day}/${month}/${shortYear}`;
}

/**
 * Convert Date to YYYY-MM-DD input string
 */
export function toInputDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate difference between start and end dates
 */
export function calculateDateDiff(
  startStr: string,
  endStr: string,
  includeEndDate: boolean = false
): DateDiffResult | null {
  if (!startStr || !endStr) return null;

  const [y1, m1, d1] = startStr.split('-').map(Number);
  const [y2, m2, d2] = endStr.split('-').map(Number);

  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return null;

  const startDate = new Date(y1, m1 - 1, d1);
  const endDate = new Date(y2, m2 - 1, d2);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

  const isReverse = startDate.getTime() > endDate.getTime();
  const start = isReverse ? endDate : startDate;
  const end = isReverse ? startDate : endDate;

  const dayMs = 24 * 60 * 60 * 1000;
  const diffMs = end.getTime() - start.getTime();
  let totalDays = Math.round(diffMs / dayMs);

  if (includeEndDate) {
    totalDays += 1;
  }

  // Weeks calculation:
  const exactWeeks = totalDays / 7;
  // User condition: ถ้าเป็นทศนิยมก็ให้ปัดเศษขึ้นเป็นจำนวนเต็ม ไม่ว่าทศนิยมจะน้อยแค่ไหน
  const roundedWeeks = totalDays <= 0 ? 0 : Math.ceil(totalDays / 7);

  const fullWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  return {
    isReverse,
    totalDays,
    exactWeeks: Number(exactWeeks.toFixed(2)),
    roundedWeeks,
    fullWeeks,
    remainingDays,
  };
}
