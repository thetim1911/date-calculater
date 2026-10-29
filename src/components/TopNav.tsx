import React from 'react';
import { Calendar, Bookmark } from 'lucide-react';
import { YearFormat } from '../types';

interface TopNavProps {
  pinnedCount: number;
  yearFormat: YearFormat;
  setYearFormat: (format: YearFormat) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  pinnedCount,
  yearFormat,
  setYearFormat,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              DateSpan
            </span>
            <span className="hidden sm:inline text-xs text-slate-500">
              คำนวณวัน & สัปดาห์ (ปัดขึ้น)
            </span>
          </div>
        </div>

        {/* Zone 2: Pinned quick indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <a
            href="#pinned-section"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
            <span>ปักหมุดแล้ว</span>
            <span className="font-mono-num font-semibold text-slate-900 bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded text-[11px]">
              {pinnedCount}
            </span>
          </a>
        </div>

        {/* Zone 3: 1 primary action (Year format toggle) */}
        <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
          <button
            type="button"
            onClick={() => setYearFormat('be')}
            className={`px-2 py-0.5 rounded transition-all font-medium ${
              yearFormat === 'be'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="แสดงปี พ.ศ."
          >
            พ.ศ.
          </button>
          <button
            type="button"
            onClick={() => setYearFormat('ce')}
            className={`px-2 py-0.5 rounded transition-all font-medium ${
              yearFormat === 'ce'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="แสดงปี ค.ศ."
          >
            ค.ศ.
          </button>
        </div>
      </div>
    </header>
  );
};
