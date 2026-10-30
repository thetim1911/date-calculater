/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TopNav } from './components/TopNav';
import { DateDiffCalculator } from './components/DateDiffCalculator';
import { PinnedList } from './components/PinnedList';
import { MedColumn } from './components/MedModules';
import { PinnedItem, YearFormat, ThemeMode, ColumnSide, MedModuleItem, WarfarinModule, InsulinModule } from './types';
import { toInputDateString, calculateDateDiff } from './utils/dateCalc';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'datespan_pinned_items_v2';
const THEME_KEY = 'datespan_theme_mode_v1';
const MED_MODULES_KEY = 'datespan_med_modules_v3';

const DEFAULT_MODULES: MedModuleItem[] = [
  {
    id: 'warfarin-1',
    type: 'warfarin',
    title: 'ยา Warfarin',
    tablets: 1,
    selectedDays: [1, 2, 3, 4, 5, 6, 0],
    extraDays: 0,
    column: 'left',
  },
  {
    id: 'insulin-1',
    type: 'insulin',
    title: 'ยาฉีดเบาหวาน #1',
    morning: 10,
    noon: 0,
    evening: 10,
    bedtime: 0,
    packSize: 300,
    extraDays: 0,
    column: 'right', // Default to right column under pinned list to balance empty space
  },
];

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

  // Medical Modules (Warfarin & Insulin) with free cross-column placement
  const [modules, setModules] = useState<MedModuleItem[]>(() => {
    try {
      const saved = localStorage.getItem(MED_MODULES_KEY);
      if (saved) {
        const parsed: MedModuleItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure all have a column property
          return parsed.map((m) => ({
            ...m,
            column: m.column || 'left',
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load med modules', e);
    }
    return DEFAULT_MODULES;
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
      localStorage.setItem(MED_MODULES_KEY, JSON.stringify(modules));
    } catch (e) {
      console.error('Failed to save med modules', e);
    }
  }, [modules]);

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

  // Module Management Handlers
  const handleMoveColumn = (id: string, targetColumn: ColumnSide) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, column: targetColumn } : m))
    );
    showToast(targetColumn === 'right' ? '➡️ ย้ายการ์ดไปฝั่งขวาแล้ว' : '⬅️ ย้ายการ์ดมาฝั่งซ้ายแล้ว');
  };

  const handleMoveOrder = (id: string, direction: 'up' | 'down') => {
    setModules((prev) => {
      const targetMod = prev.find((m) => m.id === id);
      if (!targetMod) return prev;

      const col = targetMod.column;
      const colItems = prev.filter((m) => m.column === col);
      const otherItems = prev.filter((m) => m.column !== col);
      const colIndex = colItems.findIndex((m) => m.id === id);

      if (direction === 'up' && colIndex > 0) {
        const reorderedCol = [...colItems];
        const [moved] = reorderedCol.splice(colIndex, 1);
        reorderedCol.splice(colIndex - 1, 0, moved);
        return [...otherItems, ...reorderedCol];
      } else if (direction === 'down' && colIndex < colItems.length - 1) {
        const reorderedCol = [...colItems];
        const [moved] = reorderedCol.splice(colIndex, 1);
        reorderedCol.splice(colIndex + 1, 0, moved);
        return [...otherItems, ...reorderedCol];
      }
      return prev;
    });
  };

  const handleDropItem = (
    draggedId: string,
    targetId: string | null,
    targetColumn: ColumnSide
  ) => {
    setModules((prev) => {
      const draggedItem = prev.find((m) => m.id === draggedId);
      if (!draggedItem) return prev;

      const remaining = prev.filter((m) => m.id !== draggedId);
      const updatedItem: MedModuleItem = { ...draggedItem, column: targetColumn };

      if (!targetId || targetId === draggedId) {
        // Append to target column
        return [...remaining, updatedItem];
      }

      // Insert before targetId
      const targetIndex = remaining.findIndex((m) => m.id === targetId);
      if (targetIndex === -1) {
        return [...remaining, updatedItem];
      }

      const nextList = [...remaining];
      nextList.splice(targetIndex, 0, updatedItem);
      return nextList;
    });
    showToast(`ย้ายตำแหน่งการ์ดเรียบร้อย`);
  };

  const handleAddModule = (type: 'warfarin' | 'insulin', targetColumn: ColumnSide) => {
    const isW = type === 'warfarin';
    const count = modules.filter((m) => m.type === type).length + 1;
    const newId = `${type}_${Date.now()}`;

    let newMod: MedModuleItem;
    if (isW) {
      newMod = {
        id: newId,
        type: 'warfarin',
        title: `ยา Warfarin #${count}`,
        tablets: 1,
        selectedDays: [1, 2, 3, 4, 5],
        extraDays: 0,
        column: targetColumn,
      } as WarfarinModule;
    } else {
      newMod = {
        id: newId,
        type: 'insulin',
        title: `ยาฉีดเบาหวาน #${count}`,
        morning: 10,
        noon: 0,
        evening: 10,
        bedtime: 0,
        packSize: 300,
        extraDays: 0,
        column: targetColumn,
      } as InsulinModule;
    }

    setModules((prev) => [...prev, newMod]);
    showToast(`เพิ่ม ${newMod.title} ในฝั่ง${targetColumn === 'left' ? 'ซ้าย' : 'ขวา'}แล้ว`);
  };

  const handleDuplicateModule = (id: string) => {
    const mod = modules.find((m) => m.id === id);
    if (!mod) return;

    const newId = `${mod.type}_copy_${Date.now()}`;
    const clone: MedModuleItem = {
      ...mod,
      id: newId,
      title: `${mod.title} (สำเนา)`,
    };

    setModules((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      const nextList = [...prev];
      nextList.splice(idx + 1, 0, clone);
      return nextList;
    });
    showToast(`คัดลอกสร้างการ์ดเพิ่มแล้ว`);
  };

  const handleUpdateModule = (
    id: string,
    updates: Partial<WarfarinModule> | Partial<InsulinModule>
  ) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? ({ ...m, ...updates } as MedModuleItem) : m))
    );
  };

  const handleRemoveModule = (id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
    showToast('ลบ Option เสริมแล้ว');
  };

  const leftModules = useMemo(
    () => modules.filter((m) => m.column === 'left'),
    [modules]
  );
  const rightModules = useMemo(
    () => modules.filter((m) => m.column === 'right'),
    [modules]
  );

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

      {/* Main Single-Page Unified Grid: 50/50 Split (คนละครึ่ง) พร้อมต่อการ์ดได้อิสระทั้งสองฝั่ง */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-3 sm:px-6 py-5 sm:py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* Left Column (50%): Calculator & Medical Option Modules on Left */}
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

            {/* Med Cards in Left Column */}
            <MedColumn
              column="left"
              modules={leftModules}
              startDateStr={startDate}
              totalDays={result?.totalDays ?? 0}
              theme={theme}
              onPin={handlePin}
              onMoveColumn={handleMoveColumn}
              onMoveOrder={handleMoveOrder}
              onDropItem={handleDropItem}
              onAddModule={handleAddModule}
              onDuplicateModule={handleDuplicateModule}
              onUpdateModule={handleUpdateModule}
              onRemoveModule={handleRemoveModule}
            />
          </section>

          {/* Right Column (50%): Pinned Items List & Medical Option Modules on Right */}
          <section className="w-full space-y-4">
            <PinnedList
              pinnedItems={pinnedItems}
              onLoadItem={handleLoadPinned}
              onDeleteItem={handleDeletePinned}
              yearFormat={yearFormat}
              theme={theme}
              activeStartDate={startDate}
              activeEndDate={endDate}
            />

            {/* Med Cards in Right Column - Continues directly below Pinned List */}
            <MedColumn
              column="right"
              modules={rightModules}
              startDateStr={startDate}
              totalDays={result?.totalDays ?? 0}
              theme={theme}
              onPin={handlePin}
              onMoveColumn={handleMoveColumn}
              onMoveOrder={handleMoveOrder}
              onDropItem={handleDropItem}
              onAddModule={handleAddModule}
              onDuplicateModule={handleDuplicateModule}
              onUpdateModule={handleUpdateModule}
              onRemoveModule={handleRemoveModule}
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
            โหมดถนอมสายตาสำหรับผู้ใช้งานต่อเนื่องตลอดวัน · ลากหรือย้ายการ์ดต่อกันได้อย่างอิสระ
          </span>
        </div>
      </footer>
    </div>
  );
}
