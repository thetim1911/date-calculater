import React, { useState } from 'react';
import { Bookmark, ArrowRightLeft, Copy, Check, Calendar, Info } from 'lucide-react';
import { DateDiffResult, YearFormat } from '../types';
import { formatThaiDate, formatSlashDate, toInputDateString } from '../utils/dateCalc';

interface DateDiffCalculatorProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  includeEndDate: boolean;
  setIncludeEndDate: (include: boolean) => void;
  result: DateDiffResult | null;
  yearFormat: YearFormat;
  onPin: (title: string) => void;
  isCurrentPairPinned: boolean;
}

export const DateDiffCalculator: React.FC<DateDiffCalculatorProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  includeEndDate,
  setIncludeEndDate,
  result,
  yearFormat,
  onPin,
  isCurrentPairPinned,
}) => {
  const [pinTitle, setPinTitle] = useState('');
  const [copied, setCopied] = useState(false);

  // Quick Preset Actions (minimal clicks)
  const handleSetTodayStart = () => {
    setStartDate(toInputDateString(new Date()));
  };

  const handleSetEndPlusDays = (days: number) => {
    const base = startDate ? new Date(startDate) : new Date();
    const target = new Date(base);
    target.setDate(target.getDate() + days);
    setEndDate(toInputDateString(target));
  };

  const handleSwapDates = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
  };

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalTitle =
      pinTitle.trim() ||
      `${formatSlashDate(startDate, yearFormat)} ถึง ${formatSlashDate(endDate, yearFormat)}`;
    onPin(finalTitle);
    setPinTitle('');
  };

  const handleCopyResult = () => {
    if (!result) return;
    const startStr = formatSlashDate(startDate, yearFormat);
    const endStr = formatSlashDate(endDate, yearFormat);
    const text = `📅 ระยะห่าง: ${startStr} ถึง ${endStr}\n• จำนวนวันรวม: ${result.totalDays} วัน\n• จำนวนสัปดาห์ (ปัดเศษขึ้น): ${result.roundedWeeks} สัปดาห์ (${result.fullWeeks} สัปดาห์ ${result.remainingDays} วัน)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Date Pickers (Stacked with central swap button for perfect 50% split width) */}
      <div className="space-y-2.5">
        {/* Start Date */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              วันเริ่มต้น
            </span>
            <span className="text-slate-500 text-[11px]">
              {formatThaiDate(startDate, yearFormat, true)}
            </span>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2.5 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 transition-colors"
          />
        </div>

        {/* Swap button */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={handleSwapDates}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
            title="สลับวันเริ่มต้น-สิ้นสุด"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 rotate-90" />
          </button>
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              วันสิ้นสุด
            </span>
            <span className="text-slate-500 text-[11px]">
              {formatThaiDate(endDate, yearFormat, true)}
            </span>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2.5 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 transition-colors"
          />
        </div>
      </div>

      {/* Quick shortcuts & Include End Date toggle in single line */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Quick presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">ปุ่มลัด:</span>
          <button
            type="button"
            onClick={handleSetTodayStart}
            className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px]"
          >
            เริ่มวันนี้
          </button>
          <button
            type="button"
            onClick={() => handleSetEndPlusDays(7)}
            className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px]"
          >
            +7 วัน
          </button>
          <button
            type="button"
            onClick={() => handleSetEndPlusDays(14)}
            className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px]"
          >
            +14 วัน
          </button>
          <button
            type="button"
            onClick={() => handleSetEndPlusDays(30)}
            className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px]"
          >
            +30 วัน
          </button>
        </div>

        {/* Include End Date Checkbox */}
        <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-600">
          <input
            type="checkbox"
            checked={includeEndDate}
            onChange={(e) => setIncludeEndDate(e.target.checked)}
            className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-500"
          />
          <span className="font-medium text-slate-700 text-xs">นับรวมวันสิ้นสุด (+1 วัน)</span>
        </label>
      </div>

      {/* PRIMARY RESULT CARDS: ORANGE COLOR ON "จำนวนวันรวม" */}
      {result && (
        <div className="space-y-3.5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Total Days (ORANGE THEME AS REQUESTED: "ขอสีส้มมาอยู่ตรงจำนวนวัน") */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-300/90 relative overflow-hidden">
              <div className="text-xs font-semibold text-amber-900 mb-1">
                จำนวนวันรวม
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-amber-700 font-mono-num tracking-tight">
                  {result.totalDays}
                </span>
                <span className="text-lg font-bold text-amber-800">วัน</span>
              </div>
              <div className="text-[11px] text-amber-900/80 mt-1">
                ({result.fullWeeks} สัปดาห์ กับอีก {result.remainingDays} วัน)
              </div>
            </div>

            {/* 2. Weeks Rounded Up (Neutral Card) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 relative overflow-hidden">
              <div className="text-xs font-semibold text-slate-600 mb-1">
                จำนวนสัปดาห์ (ปัดเศษขึ้น)
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono-num tracking-tight">
                  {result.roundedWeeks}
                </span>
                <span className="text-lg font-bold text-slate-700">สัปดาห์</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 inline" />
                <span>คำนวณจริง {result.exactWeeks} สัปดาห์ → ปัดขึ้นเต็ม</span>
              </div>
            </div>
          </div>

          {/* Frictionless Inline Pin Input */}
          <form
            onSubmit={handlePinSubmit}
            className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={pinTitle}
                onChange={(e) => setPinTitle(e.target.value)}
                placeholder="ใส่ชื่อบันทึก เช่น สัญญาเช่า, ส่งโปรเจกต์ (หรือกดปักหมุดได้เลย)"
                className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="submit"
                className={`flex-1 sm:flex-initial px-3.5 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap ${
                  isCurrentPairPinned
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
                title="ปักหมุดบันทึกไว้ในรายการ"
              >
                <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{isCurrentPairPinned ? 'ปักหมุดซ้ำ' : 'ปักหมุด'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyResult}
                className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shrink-0"
                title="คัดลอกสรุป"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
