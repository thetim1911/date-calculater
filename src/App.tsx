/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TopNav } from './components/TopNav';
import { DateDiffCalculator } from './components/DateDiffCalculator';
import { PinnedList } from './components/PinnedList';
import { PinnedItem, YearFormat } from './types';
import { toInputDateString, calculateDateDiff } from './utils/dateCalc';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'datespan_pinned_items_v2';

export default function App() {
  const [yearFormat, setYearFormat] = useState<YearFormat>('be');
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Bar */}
      <TopNav
        pinnedCount={pinnedItems.length}
        yearFormat={yearFormat}
        setYearFormat={setYearFormat}
      />

      {/* Main Single-Page Unified Grid: 50/50 Split (คนละครึ่ง) */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-3 sm:px-6 py-5 sm:py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* Left Column (50%): Calculator */}
          <section className="w-full">
            <DateDiffCalculator
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              includeEndDate={includeEndDate}
              setIncludeEndDate={setIncludeEndDate}
              result={result}
              yearFormat={yearFormat}
              onPin={handlePin}
              isCurrentPairPinned={isCurrentPairPinned}
            />
          </section>

          {/* Right Column (50%): Pinned Items List (คนละครึ่ง) */}
          <section className="w-full">
            <PinnedList
              pinnedItems={pinnedItems}
              onLoadItem={handleLoadPinned}
              onDeleteItem={handleDeletePinned}
              yearFormat={yearFormat}
              activeStartDate={startDate}
              activeEndDate={endDate}
            />
          </section>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-medium shadow-lg border border-slate-700/60 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean quiet footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DateSpan · คำนวณวันและสัปดาห์ (ปัดเศษขึ้นเป็นจำนวนเต็ม)</span>
          <span className="text-slate-400">แสดงผลแบบแบ่งครึ่งหน้าจอ (50/50)</span>
        </div>
      </footer>
    </div>
  );
}
