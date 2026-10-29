import React, { useState } from 'react';
import { Bookmark, ArrowRightLeft, Copy, Check, Info } from 'lucide-react';
import { DateDiffResult, YearFormat, ThemeMode } from '../types';
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
  theme: ThemeMode;
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
  theme,
  onPin,
  isCurrentPairPinned,
}) => {
  const [pinTitle, setPinTitle] = useState('');
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  // Quick Preset Actions
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
    <div
      className={`rounded-2xl border p-5 sm:p-6 shadow-2xs space-y-4 transition-colors ${
        isDark
          ? 'bg-[#181f1b] border-[#29352e] text-[#e3e8e5]'
          : 'bg-[#ffffff] border-[#dde3df] text-[#1c2621]'
      }`}
    >
      {/* Date Pickers */}
      <div className="space-y-2.5">
        {/* Start Date */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span
              className={`font-semibold flex items-center gap-1.5 ${
                isDark ? 'text-[#c2cfc7]' : 'text-[#38493f]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
              วันเริ่มต้น
            </span>
            <span
              className={`text-[11px] font-mono-num ${
                isDark ? 'text-[#819388]' : 'text-[#627368]'
              }`}
            >
              {formatThaiDate(startDate, yearFormat, true)}
            </span>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full px-3 py-2 text-sm font-medium rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors ${
              isDark
                ? 'bg-[#131714] border-[#2c3830] text-[#e6ece8]'
                : 'bg-[#f6f8f6] border-[#d8e0db] text-[#1c2621] hover:bg-white focus:bg-white'
            }`}
          />
        </div>

        {/* Swap button */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={handleSwapDates}
            className={`p-1.5 rounded-lg border transition-colors shadow-2xs ${
              isDark
                ? 'bg-[#202924] border-[#313f36] text-[#a4b5aa] hover:text-white'
                : 'bg-white border-[#d8e0db] text-[#55665b] hover:text-[#1c2621] hover:bg-[#f0f4f1]'
            }`}
            title="สลับวันเริ่มต้น-สิ้นสุด"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 rotate-90" />
          </button>
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span
              className={`font-semibold flex items-center gap-1.5 ${
                isDark ? 'text-[#c2cfc7]' : 'text-[#38493f]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              วันสิ้นสุด
            </span>
            <span
              className={`text-[11px] font-mono-num ${
                isDark ? 'text-[#819388]' : 'text-[#627368]'
              }`}
            >
              {formatThaiDate(endDate, yearFormat, true)}
            </span>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`w-full px-3 py-2 text-sm font-medium rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors ${
              isDark
                ? 'bg-[#131714] border-[#2c3830] text-[#e6ece8]'
                : 'bg-[#f6f8f6] border-[#d8e0db] text-[#1c2621] hover:bg-white focus:bg-white'
            }`}
          />
        </div>
      </div>

      {/* Quick shortcuts & Include End Date toggle */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs ${
          isDark ? 'border-[#26312a]' : 'border-[#e8ede9]'
        }`}
      >
        {/* Quick presets */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] ${isDark ? 'text-[#708076]' : 'text-[#6d7e73]'}`}>
            ลัด:
          </span>
          {[
            { label: 'เริ่มวันนี้', action: handleSetTodayStart },
            { label: '+7 วัน', action: () => handleSetEndPlusDays(7) },
            { label: '+14 วัน', action: () => handleSetEndPlusDays(14) },
            { label: '+30 วัน', action: () => handleSetEndPlusDays(30) },
          ].map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={btn.action}
              className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors ${
                isDark
                  ? 'bg-[#202924] hover:bg-[#2b3730] text-[#b4c3b9]'
                  : 'bg-[#edf2ee] hover:bg-[#e0e7e2] text-[#3c4c42]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Include End Date Checkbox */}
        <label
          className={`inline-flex items-center gap-1.5 cursor-pointer select-none text-xs ${
            isDark ? 'text-[#a2b3a8]' : 'text-[#47574d]'
          }`}
        >
          <input
            type="checkbox"
            checked={includeEndDate}
            onChange={(e) => setIncludeEndDate(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
          />
          <span className="font-medium text-[11px]">นับรวมวันสิ้นสุด (+1 วัน)</span>
        </label>
      </div>

      {/* PRIMARY RESULT CARDS: EYE-FRIENDLY MUTED ACCENTS */}
      {result && (
        <div className="space-y-3.5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Total Days (WARM OCHRE/AMBER - ANTI-GLARE) */}
            <div
              className={`p-4 rounded-xl border relative overflow-hidden transition-colors ${
                isDark
                  ? 'bg-[#261f17] border-[#4a3620] text-[#fcd34d]'
                  : 'bg-[#fef8f0] border-[#fcd7b6] text-[#8e450b]'
              }`}
            >
              <div
                className={`text-xs font-semibold mb-1 ${
                  isDark ? 'text-[#fbbf24]' : 'text-[#8e450b]'
                }`}
              >
                จำนวนวันรวม
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-3xl sm:text-4xl font-black font-mono-num tracking-tight ${
                    isDark ? 'text-[#fef3c7]' : 'text-[#8c4309]'
                  }`}
                >
                  {result.totalDays}
                </span>
                <span
                  className={`text-lg font-bold ${
                    isDark ? 'text-[#fde68a]' : 'text-[#9e5012]'
                  }`}
                >
                  วัน
                </span>
              </div>
              <div
                className={`text-[11px] mt-1 ${
                  isDark ? 'text-[#d97706]' : 'text-[#a55616]'
                }`}
              >
                ({result.fullWeeks} สัปดาห์ กับอีก {result.remainingDays} วัน)
              </div>
            </div>

            {/* 2. Weeks Rounded Up (SOOTHING SAGE / SLATE) */}
            <div
              className={`p-4 rounded-xl border relative overflow-hidden transition-colors ${
                isDark
                  ? 'bg-[#1b231f] border-[#2e3d34] text-[#a7cfb7]'
                  : 'bg-[#f2f6f3] border-[#d5ded8] text-[#283d31]'
              }`}
            >
              <div
                className={`text-xs font-semibold mb-1 ${
                  isDark ? 'text-[#9fc7af]' : 'text-[#374e40]'
                }`}
              >
                จำนวนสัปดาห์ (ปัดเศษขึ้น)
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-3xl sm:text-4xl font-black font-mono-num tracking-tight ${
                    isDark ? 'text-[#e6f2eb]' : 'text-[#1c2c22]'
                  }`}
                >
                  {result.roundedWeeks}
                </span>
                <span
                  className={`text-lg font-bold ${
                    isDark ? 'text-[#9fc7af]' : 'text-[#374e40]'
                  }`}
                >
                  สัปดาห์
                </span>
              </div>
              <div
                className={`text-[11px] mt-1 flex items-center gap-1 ${
                  isDark ? 'text-[#7e9988]' : 'text-[#586e61]'
                }`}
              >
                <Info className="w-3.5 h-3.5 opacity-80 shrink-0 inline" />
                <span>คำนวณจริง {result.exactWeeks} สัปดาห์ → ปัดขึ้นเต็ม</span>
              </div>
            </div>
          </div>

          {/* Frictionless Inline Pin Input */}
          <form
            onSubmit={handlePinSubmit}
            className={`p-2.5 rounded-xl border flex flex-col sm:flex-row items-center gap-2 transition-colors ${
              isDark
                ? 'bg-[#141a16] border-[#29352e]'
                : 'bg-[#f5f8f6] border-[#dbe3de]'
            }`}
          >
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={pinTitle}
                onChange={(e) => setPinTitle(e.target.value)}
                placeholder="ใส่ชื่อบันทึก เช่น สัญญาเช่า, ส่งโปรเจกต์ (หรือกดปักหมุดได้เลย)"
                className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-colors ${
                  isDark
                    ? 'bg-[#1a211d] border-[#2c3830] text-[#e6ece8]'
                    : 'bg-white border-[#d5ded8] text-[#1c2621]'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="submit"
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap ${
                  isCurrentPairPinned
                    ? isDark
                      ? 'bg-[#3b301c] text-[#fde047]'
                      : 'bg-[#fef3c7] text-[#92400e]'
                    : isDark
                    ? 'bg-[#27362e] text-[#bbf7d0] hover:bg-[#31443a]'
                    : 'bg-[#293c31] text-[#e6f4ec] hover:bg-[#203027]'
                }`}
                title="ปักหมุดบันทึกไว้ในรายการ"
              >
                <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{isCurrentPairPinned ? 'ปักหมุดซ้ำ' : 'ปักหมุด'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyResult}
                className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                  isDark
                    ? 'bg-[#1e2722] border-[#2f3d35] text-[#b4c3b9] hover:text-white'
                    : 'bg-white border-[#d5ded8] text-[#55665b] hover:text-[#1c2621]'
                }`}
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
