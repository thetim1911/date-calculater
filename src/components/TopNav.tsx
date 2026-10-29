import React from 'react';
import { Calendar, Bookmark, Sun, Moon } from 'lucide-react';
import { YearFormat, ThemeMode } from '../types';

interface TopNavProps {
  pinnedCount: number;
  yearFormat: YearFormat;
  setYearFormat: (format: YearFormat) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  pinnedCount,
  yearFormat,
  setYearFormat,
  theme,
  setTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
        isDark
          ? 'bg-[#151a17]/95 border-[#28332c] text-[#e3e8e5]'
          : 'bg-[#fafbfa]/95 border-[#e0e6e2] text-[#1c2621]'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-2xs ${
              isDark
                ? 'bg-[#26352d] text-[#86efac]'
                : 'bg-[#2d4036] text-[#bbf7d0]'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-base font-bold tracking-tight whitespace-nowrap ${
                isDark ? 'text-[#f0f4f1]' : 'text-[#1c2621]'
              }`}
            >
              DateSpan
            </span>
            <span
              className={`hidden sm:inline text-xs ${
                isDark ? 'text-[#8e9e94]' : 'text-[#5d6c62]'
              }`}
            >
              คำนวณวัน & สัปดาห์ · คลินิกและยา
            </span>
          </div>
        </div>

        {/* Zone 2: Pinned quick indicator */}
        <div className="flex items-center gap-2 text-xs">
          <a
            href="#pinned-section"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              isDark
                ? 'hover:bg-[#202924] text-[#a4b5aa]'
                : 'hover:bg-[#ecf0ed] text-[#4d5c52]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-amber-500/80 text-amber-500" />
            <span>ปักหมุด</span>
            <span
              className={`font-mono-num font-semibold px-1.5 py-0.2 rounded text-[11px] ${
                isDark
                  ? 'bg-[#332b1e] text-[#fcd34d]'
                  : 'bg-[#fef3c7] text-[#92400e]'
              }`}
            >
              {pinnedCount}
            </span>
          </a>
        </div>

        {/* Zone 3: Settings (Theme & Year Mode) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle (Eye-care comfort vs Dark) */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'comfort' : 'dark')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isDark
                ? 'bg-[#1e2722] border-[#2f3d35] text-[#d1dcd4] hover:bg-[#25302a]'
                : 'bg-white border-[#d8e0db] text-[#3e4f45] hover:bg-[#f2f5f3]'
            }`}
            title={isDark ? 'เปลี่ยนเป็นโหมดสบายตา (นวลแสง)' : 'เปลี่ยนเป็นโหมดมืด (กะดึก/ถนอมสายตา)'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline text-[11px]">โหมดนวลแสง</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline text-[11px]">โหมดมืด</span>
              </>
            )}
          </button>

          {/* Year format toggle */}
          <div
            className={`flex items-center rounded-lg border p-0.5 text-xs ${
              isDark
                ? 'border-[#2d3a32] bg-[#1a211d]'
                : 'border-[#d8e0db] bg-[#f0f3f1]'
            }`}
          >
            <button
              type="button"
              onClick={() => setYearFormat('be')}
              className={`px-2 py-0.5 rounded transition-all font-medium ${
                yearFormat === 'be'
                  ? isDark
                    ? 'bg-[#29352e] text-white shadow-2xs font-semibold'
                    : 'bg-white text-[#1c2621] shadow-2xs font-semibold'
                  : isDark
                  ? 'text-[#7e8f85] hover:text-[#d1dcd4]'
                  : 'text-[#64746a] hover:text-[#1c2621]'
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
                  ? isDark
                    ? 'bg-[#29352e] text-white shadow-2xs font-semibold'
                    : 'bg-white text-[#1c2621] shadow-2xs font-semibold'
                  : isDark
                  ? 'text-[#7e8f85] hover:text-[#d1dcd4]'
                  : 'text-[#64746a] hover:text-[#1c2621]'
              }`}
              title="แสดงปี ค.ศ."
            >
              ค.ศ.
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
