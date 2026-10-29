/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TopNav } from './components/TopNav';
import { DateDiffCalculator } from './components/DateDiffCalculator';
import { PinnedList } from './components/PinnedList';
import { MedModules } from './components/MedModules';
import { PinnedItem, YearFormat, ThemeMode } from './types';
import { toInputDateString, calculateDateDiff } from './utils/dateCalc';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'datespan_pinned_items_v2';
const THEME_KEY = 'datespan_theme_mode_v1';

export default function App() {
  const [yearFormat, setYearFormat] = useState<YearFormat>('be');
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'comfort' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (e) {
      console.error('Failed to load theme', e);
    }
    return 'comfort'; // Default to eye-care comfort mode
  });

  // Default dates: Today and 30 days ahead
  const [startDate, setStartDate] = useState<string>(() => {
    return toInputDateString(new Date());
  });

  const [endDate, setEndDate] = useState<string>(() => {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    return toInputDateString(nextMonth);
  });

  // Calculate difference
  const result = useMemo(() => {
    return calculateDateDiff(startDate, endDate, includeEndDate);
  }, [startDate, endDate, includeEndDate]);

  // Pinned items stored in localStorage
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse pinned items', e);
    }

    // Default friendly sample
    const today = new Date();
    const future = new Date(today);
    future.setDate(future.getDate() + 20);

    const sStr = toInputDateString(today);
    const eStr = toInputDateString(future);
    const diff = calculateDateDiff(sStr, eStr, false);

    return [
      {
        id: 'sample-1',
        title: 'กำหนดส่งงานโปรเจกต์',
        startDate: sStr,
        endDate: eStr,
        includeEndDate: false,
        createdAt: Date.now(),
        totalDays: diff?.totalDays ?? 20,
        roundedWeeks: diff?.roundedWeeks ?? 3,
        exactWeeks: diff?.exactWeeks ?? 2.86,
      },
    ];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedItems));
    } catch (e) {
      console.error('Failed to save pinned items', e);
    }
  }, [pinnedItems]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }, [theme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const isCurrentPairPinned = pinnedItems.some(
    (item) => item.startDate === startDate && item.endDate === endDate
  );

  const handlePin = (title: string) => {
    if (!result) return;

    const newItem: PinnedItem = {
      id: `pin_${Date.now()}`,
      title,
      startDate,
      endDate,
      includeEndDate,
      createdAt: Date.now(),
      totalDays: result.totalDays,
      roundedWeeks: result.roundedWeeks,
      exactWeeks: result.exactWeeks,
    };

    setPinnedItems((prev) => [newItem, ...prev]);
    showToast(`📌 ปักหมุด "${title}" แล้ว`);
  };

  const handleDeletePinned = (id: string) => {
    setPinnedItems((prev) => prev.filter((item) => item.id !== id));
    showToast('ลบรายการปักหมุดแล้ว');
  };

  const handleLoadPinned = (item: PinnedItem) => {
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setIncludeEndDate(item.includeEndDate);
    showToast(`โหลด "${item.title}" เข้าเครื่องคำนวณแล้ว`);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-emerald-200 selection:text-emerald-950 ${
        isDark
          ? 'bg-[#101512] text-[#e3e8e5]'
          : 'bg-[#f4f6f4] text-[#1c2621]'
      }`}
    >
      {/* Top Bar with Eye-Care & Theme Toggle */}
      <TopNav
        pinnedCount={pinnedItems.length}
        yearFormat={yearFormat}
        setYearFormat={setYearFormat}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Single-Page Unified Grid: 50/50 Split (คนละครึ่ง) */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-3 sm:px-6 py-5 sm:py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* Left Column (50%): Calculator & Medical Option Modules */}
          <section className="w-full space-y-4">
            <DateDiffCalculator
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              includeEndDate={includeEndDate}
              setIncludeEndDate={setIncludeEndDate}
              result={result}
              yearFormat={yearFormat}
              theme={theme}
              onPin={handlePin}
              isCurrentPairPinned={isCurrentPairPinned}
            />

            {/* Option เสริมแยกออกมาต่างหาก พร้อมปุ่ม + เพิ่มได้หลายแบบ */}
            <MedModules
              startDateStr={startDate}
              totalDays={result?.totalDays ?? 0}
              roundedWeeks={result?.roundedWeeks ?? 0}
              theme={theme}
              onPin={handlePin}
            />
          </section>

          {/* Right Column (50%): Pinned Items List (คนละครึ่ง) */}
          <section className="w-full">
            <PinnedList
              pinnedItems={pinnedItems}
              onLoadItem={handleLoadPinned}
              onDeleteItem={handleDeletePinned}
              yearFormat={yearFormat}
              theme={theme}
              activeStartDate={startDate}
              activeEndDate={endDate}
            />
          </section>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-lg border flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
            isDark
              ? 'bg-[#1b241f] text-[#f0fdf4] border-[#314238]'
              : 'bg-[#1e2b24] text-white border-[#2f4237]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean quiet footer */}
      <footer
        className={`border-t py-4 text-center text-xs transition-colors ${
          isDark
            ? 'border-[#26312a] bg-[#151a17] text-[#718278]'
            : 'border-[#e0e6e2] bg-[#fafbfa] text-[#55665b]'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DateSpan · คำนวณวันและสัปดาห์ (ปัดเศษขึ้นเป็นจำนวนเต็ม)</span>
          <span className="opacity-70">
            โหมดถนอมสายตาสำหรับผู้ใช้งานต่อเนื่องตลอดวัน
          </span>
        </div>
      </footer>
    </div>
  );
}
