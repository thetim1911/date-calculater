import React, { useState } from 'react';
import { Plus, Pill, Syringe, Trash2, Copy, Check, Bookmark, ChevronDown } from 'lucide-react';
import { ThemeMode } from '../types';

export interface WarfarinModule {
  id: string;
  type: 'warfarin';
  title: string;
  tablets: number;
  selectedDays: number[];
  extraDays: number;
}

export interface InsulinModule {
  id: string;
  type: 'insulin';
  title: string;
  morning: number;
  noon: number;
  evening: number;
  bedtime: number;
  packSize: number;
  extraDays: number;
}

export type MedModuleItem = WarfarinModule | InsulinModule;

interface MedModulesProps {
  startDateStr: string;
  totalDays: number;
  roundedWeeks: number;
  theme: ThemeMode;
  onPin: (title: string) => void;
}

const DAYS_OF_WEEK = [
  { id: 1, label: 'จันทร์', short: 'จ' },
  { id: 2, label: 'อังคาร', short: 'อ' },
  { id: 3, label: 'พุธ', short: 'พ' },
  { id: 4, label: 'พฤหัส', short: 'พฤ' },
  { id: 5, label: 'ศุกร์', short: 'ศ' },
  { id: 6, label: 'เสาร์', short: 'ส' },
  { id: 0, label: 'อาทิตย์', short: 'อา' },
];

export const MedModules: React.FC<MedModulesProps> = ({
  startDateStr,
  totalDays,
  theme,
  onPin,
}) => {
  const isDark = theme === 'dark';

  const [modules, setModules] = useState<MedModuleItem[]>([
    {
      id: 'warfarin-1',
      type: 'warfarin',
      title: 'ยา Warfarin',
      tablets: 1,
      selectedDays: [1, 2, 3, 4, 5, 6, 0],
      extraDays: 0,
    },
  ]);

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddWarfarin = () => {
    const count = modules.filter((m) => m.type === 'warfarin').length + 1;
    const newMod: WarfarinModule = {
      id: `warfarin_${Date.now()}`,
      type: 'warfarin',
      title: `ยา Warfarin #${count}`,
      tablets: 1,
      selectedDays: [1, 2, 3, 4, 5],
      extraDays: 0,
    };
    setModules((prev) => [...prev, newMod]);
    setIsAddMenuOpen(false);
  };

  const handleAddInsulin = () => {
    const count = modules.filter((m) => m.type === 'insulin').length + 1;
    const newMod: InsulinModule = {
      id: `insulin_${Date.now()}`,
      type: 'insulin',
      title: `ยาฉีดเบาหวาน #${count}`,
      morning: 10,
      noon: 0,
      evening: 10,
      bedtime: 0,
      packSize: 300,
      extraDays: 0,
    };
    setModules((prev) => [...prev, newMod]);
    setIsAddMenuOpen(false);
  };

  const handleRemoveModule = (id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateWarfarin = (id: string, updates: Partial<WarfarinModule>) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id && m.type === 'warfarin' ? { ...m, ...updates } : m))
    );
  };

  const handleUpdateInsulin = (id: string, updates: Partial<InsulinModule>) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id && m.type === 'insulin' ? { ...m, ...updates } : m))
    );
  };

  const calculateWarfarin = (mod: WarfarinModule) => {
    const daysToCount = totalDays + mod.extraDays;
    if (daysToCount <= 0 || mod.selectedDays.length === 0 || mod.tablets <= 0) {
      return { totalTablets: 0, roundedTablets: 0, doseDaysCount: 0, detail: '' };
    }

    const [y, m, d] = startDateStr.split('-').map(Number);
    const startObj = y && m && d ? new Date(y, m - 1, d) : new Date();
    let currentDayOfWeek = startObj.getDay();

    let doseDaysCount = 0;
    const fullWeeks = Math.floor(daysToCount / 7);
    doseDaysCount += fullWeeks * mod.selectedDays.length;

    const remDays = daysToCount % 7;
    for (let i = 0; i < remDays; i++) {
      const checkDay = (currentDayOfWeek + i) % 7;
      if (mod.selectedDays.includes(checkDay)) {
        doseDaysCount++;
      }
    }

    const exactTotal = doseDaysCount * mod.tablets;
    const roundedTablets = Math.ceil(exactTotal);

    const dayLabels = mod.selectedDays
      .map((d) => DAYS_OF_WEEK.find((item) => item.id === d)?.short)
      .join(',');

    return {
      totalTablets: Number(exactTotal.toFixed(1)),
      roundedTablets,
      doseDaysCount,
      detail: `${doseDaysCount} วันที่กิน (${dayLabels}) × ${mod.tablets} เม็ด = ${exactTotal} เม็ด`,
    };
  };

  const calculateInsulin = (mod: InsulinModule) => {
    const daysToCount = totalDays + mod.extraDays;
    const dailyTotal = (mod.morning || 0) + (mod.noon || 0) + (mod.evening || 0) + (mod.bedtime || 0);
    const totalUnits = daysToCount * dailyTotal;
    const pens = Math.ceil(totalUnits / mod.packSize);

    return {
      dailyTotal,
      totalUnits,
      pens,
      detail: `${daysToCount} วัน × ${dailyTotal} ยูนิต/วัน = ${totalUnits} ยูนิต`,
    };
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-3.5 pt-1">
      {/* Header & Add Button */}
      <div
        className={`flex items-center justify-between gap-3 pb-2 border-b ${
          isDark ? 'border-[#26312a]' : 'border-[#e4eae6]'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
              isDark ? 'bg-[#29352e] text-[#86efac]' : 'bg-[#e2ebe5] text-[#2c4035]'
            }`}
          >
            💊
          </div>
          <h3
            className={`text-sm font-bold tracking-tight ${
              isDark ? 'text-[#e3e8e5]' : 'text-[#202e26]'
            }`}
          >
            Option เสริม: คำนวณยา (อิงตาม {totalDays} วัน)
          </h3>
        </div>

        {/* Dropdown to add options */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors ${
              isDark
                ? 'bg-[#27362e] text-[#bbf7d0] hover:bg-[#31443a]'
                : 'bg-[#293c31] text-[#e6f4ec] hover:bg-[#203027]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่ม Option เสริม</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {isAddMenuOpen && (
            <div
              className={`absolute right-0 mt-1.5 w-64 rounded-xl shadow-lg border py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 ${
                isDark
                  ? 'bg-[#181f1b] border-[#29352e] text-[#e3e8e5]'
                  : 'bg-white border-[#d8e0db] text-[#1c2621]'
              }`}
            >
              <button
                type="button"
                onClick={handleAddWarfarin}
                className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 transition-colors ${
                  isDark
                    ? 'hover:bg-[#261f17] text-[#e2ded9]'
                    : 'hover:bg-[#fef8f0] text-[#1c2621]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-[#3b2e1e] text-[#fbbf24]' : 'bg-[#fef3c7] text-[#92400e]'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold">+ ยา Warfarin</div>
                  <div className="text-[11px] opacity-70">กรอกจำนวนเม็ด & เลือกวัน (จ-อา)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleAddInsulin}
                className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 transition-colors border-t ${
                  isDark
                    ? 'border-[#26312a] hover:bg-[#162322] text-[#e2ded9]'
                    : 'border-[#edf2ee] hover:bg-[#f0f7f9] text-[#1c2621]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-[#183133] text-[#67e8f9]' : 'bg-[#e0f2fe] text-[#0369a1]'
                  }`}
                >
                  <Syringe className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold">+ ยาฉีดเบาหวาน</div>
                  <div className="text-[11px] opacity-70">แยกตามมื้อ เช้า/เที่ยง/เย็น/ก่อนนอน</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modules List */}
      {modules.length === 0 ? (
        <div
          className={`p-6 text-center rounded-2xl border border-dashed text-xs space-y-1.5 ${
            isDark
              ? 'bg-[#141a16] border-[#29352e] text-[#819388]'
              : 'bg-white border-[#d5ded8] text-[#55665b]'
          }`}
        >
          <p className="font-medium">ยังไม่มี Option เสริมที่เลือกไว้</p>
          <p className="text-[11px] opacity-70">
            กดปุ่ม "+ เพิ่ม Option เสริม" เพื่อคำนวณยา Warfarin หรือยาฉีดเบาหวาน
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((mod) => {
            if (mod.type === 'warfarin') {
              const res = calculateWarfarin(mod);
              const isCopied = copiedId === mod.id;

              const toggleDay = (dayId: number) => {
                const current = mod.selectedDays;
                if (current.includes(dayId)) {
                  handleUpdateWarfarin(mod.id, {
                    selectedDays: current.filter((d) => d !== dayId),
                  });
                } else {
                  handleUpdateWarfarin(mod.id, {
                    selectedDays: [...current, dayId],
                  });
                }
              };

              const selectPreset = (days: number[]) => {
                handleUpdateWarfarin(mod.id, { selectedDays: days });
              };

              const copyText = `💊 ${mod.title} (${totalDays} วัน${mod.extraDays > 0 ? ` + เผื่อ ${mod.extraDays} วัน` : ''})\n• กินวัน: ${mod.selectedDays.map((d) => DAYS_OF_WEEK.find((i) => i.id === d)?.short).join(',')}\n• ครั้งละ: ${mod.tablets} เม็ด\n• จำนวนที่ต้องจ่าย: ${res.roundedTablets} เม็ด (${res.detail})`;

              return (
                <div
                  key={mod.id}
                  className={`p-4 rounded-2xl border shadow-2xs space-y-3 transition-colors ${
                    isDark
                      ? 'bg-[#181f1b] border-[#382b1c] text-[#e3e8e5]'
                      : 'bg-white border-[#fcd7b6]/80 text-[#1c2621]'
                  }`}
                >
                  {/* Card Header */}
                  <div
                    className={`flex items-center justify-between gap-2 pb-2 border-b ${
                      isDark ? 'border-[#2d2419]' : 'border-[#faede1]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center ${
                          isDark ? 'bg-[#3b2e1e] text-[#fbbf24]' : 'bg-[#fef3c7] text-[#92400e]'
                        }`}
                      >
                        <Pill className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => handleUpdateWarfarin(mod.id, { title: e.target.value })}
                        className={`text-xs font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none px-1 py-0.5 ${
                          isDark ? 'text-[#f0f4f1] focus:border-[#fbbf24]' : 'text-[#1c2621] focus:border-amber-600'
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(mod.id, copyText)}
                        className={`p-1 rounded transition-colors ${
                          isDark ? 'hover:bg-[#202924] text-[#8fa095]' : 'hover:bg-[#eef3f0] text-[#55665b]'
                        }`}
                        title="คัดลอกสรุป"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveModule(mod.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        title="ลบช่องนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 1. Enter Tablet Dose */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="font-semibold opacity-90">1. ขนาดยา (จำนวนเม็ด):</span>
                    <div className="flex items-center gap-1.5">
                      {[0.5, 1, 1.5, 2, 2.5].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleUpdateWarfarin(mod.id, { tablets: t })}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono-num transition-colors ${
                            mod.tablets === t
                              ? isDark
                                ? 'bg-[#5e4120] text-[#fef3c7] font-bold'
                                : 'bg-[#92400e] text-white font-bold'
                              : isDark
                              ? 'bg-[#202924] text-[#b4c3b9] hover:bg-[#2b3730]'
                              : 'bg-[#edf2ee] text-[#3c4c42] hover:bg-[#e0e7e2]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                      <div className="flex items-center gap-1 ml-1">
                        <input
                          type="number"
                          step="0.25"
                          min="0.25"
                          max="20"
                          value={mod.tablets}
                          onChange={(e) =>
                            handleUpdateWarfarin(mod.id, {
                              tablets: Math.max(0, parseFloat(e.target.value) || 0),
                            })
                          }
                          className={`w-14 px-1.5 py-0.5 text-xs text-center border rounded font-mono-num ${
                            isDark
                              ? 'bg-[#141a16] border-[#2c3830] text-[#e6ece8]'
                              : 'bg-white border-[#d8e0db] text-[#1c2621]'
                          }`}
                        />
                        <span className="text-[11px] opacity-70">เม็ด</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Select Days of the Week */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold opacity-90">2. เลือกวันที่กิน (จ. - อา.):</span>
                      <div className="flex flex-wrap items-center gap-1 text-[11px]">
                        {[
                          { label: 'ทุกวัน', days: [1, 2, 3, 4, 5, 6, 0] },
                          { label: 'จ-ศ', days: [1, 2, 3, 4, 5] },
                          { label: 'ส-อา', days: [6, 0] },
                          { label: 'จพศ', days: [1, 3, 5] },
                          { label: 'จ-พฤ', days: [1, 2, 3, 4] },
                          { label: 'ศ-อา', days: [5, 6, 0] },
                        ].map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => selectPreset(preset.days)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${
                              isDark
                                ? 'bg-[#202924] text-[#a4b5aa] hover:bg-[#2b3730] hover:text-white'
                                : 'bg-[#edf2ee] text-[#4d5d52] hover:bg-[#e0e7e2] hover:text-[#1c2621]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                      {DAYS_OF_WEEK.map((d) => {
                        const isSelected = mod.selectedDays.includes(d.id);
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => toggleDay(d.id)}
                            className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              isSelected
                                ? isDark
                                  ? 'bg-[#854d0e] text-[#fef9c3] shadow-2xs font-bold'
                                  : 'bg-[#b45309] text-white shadow-2xs font-bold'
                                : isDark
                                ? 'bg-[#202924] text-[#819388] hover:bg-[#2b3730]'
                                : 'bg-[#edf2ee] text-[#55665b] hover:bg-[#e0e7e2]'
                            }`}
                          >
                            {d.short}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Buffer Days */}
                  <div
                    className={`flex items-center justify-between text-xs pt-1 border-t ${
                      isDark ? 'border-[#2d2419]' : 'border-[#faede1]'
                    }`}
                  >
                    <span className="text-[11px] opacity-70">เผื่อวันนัดคลาดเคลื่อน:</span>
                    <div className="flex items-center gap-1">
                      {[0, 3, 5, 7].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => handleUpdateWarfarin(mod.id, { extraDays: b })}
                          className={`px-1.5 py-0.5 rounded text-[10px] border transition-colors ${
                            mod.extraDays === b
                              ? isDark
                                ? 'bg-[#3b2e1e] border-[#5e4120] text-[#fcd34d] font-bold'
                                : 'bg-[#fef3c7] border-[#fde68a] text-[#92400e] font-bold'
                              : isDark
                              ? 'bg-[#141a16] border-[#29352e] text-[#819388]'
                              : 'bg-white border-[#d8e0db] text-[#55665b]'
                          }`}
                        >
                          {b === 0 ? 'ไม่เผื่อ' : `+${b} วัน`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Result Box */}
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isDark
                        ? 'bg-[#261f17] border-[#4a3620] text-[#fcd34d]'
                        : 'bg-[#fef8f0] border-[#fcd7b6] text-[#8e450b]'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-semibold opacity-90">
                        จำนวนเม็ดที่ต้องจ่าย:
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span
                          className={`text-2xl sm:text-3xl font-black font-mono-num ${
                            isDark ? 'text-[#fef3c7]' : 'text-[#8c4309]'
                          }`}
                        >
                          {res.roundedTablets}
                        </span>
                        <span className="text-sm font-bold opacity-90">เม็ด</span>
                        {res.totalTablets !== res.roundedTablets && (
                          <span className="text-[11px] opacity-80">
                            (คำนวณจริง {res.totalTablets} เม็ด → ปัดขึ้น)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] mt-0.5 font-mono-num opacity-80">
                        {res.detail}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onPin(`${mod.title}: ${res.roundedTablets} เม็ด (${mod.tablets}m/d)`)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shadow-2xs flex items-center gap-1 shrink-0 ${
                        isDark
                          ? 'bg-[#3d2f1f] text-[#fef08a] hover:bg-[#4a3927]'
                          : 'bg-[#78350f] text-white hover:bg-[#5f290b]'
                      }`}
                    >
                      <Bookmark className="w-3 h-3 text-amber-300 fill-amber-300" />
                      <span>ปักหมุด</span>
                    </button>
                  </div>
                </div>
              );
            }

            /* INSULIN MODULE */
            if (mod.type === 'insulin') {
              const res = calculateInsulin(mod);
              const isCopied = copiedId === mod.id;

              const copyText = `💉 ${mod.title} (${totalDays} วัน${mod.extraDays > 0 ? ` + เผื่อ ${mod.extraDays} วัน` : ''})\n• มื้อ: เช้า ${mod.morning}U, เที่ยง ${mod.noon}U, เย็น ${mod.evening}U, ก่อนนอน ${mod.bedtime}U (รวม ${res.dailyTotal}U/วัน)\n• ยูนิตรวม: ${res.totalUnits} ยูนิต\n• จำนวนด้าม/ขวด: ${res.pens} ${mod.packSize === 300 ? 'ด้าม (300 U)' : 'ขวด (1000 U)'}`;

              return (
                <div
                  key={mod.id}
                  className={`p-4 rounded-2xl border shadow-2xs space-y-3 transition-colors ${
                    isDark
                      ? 'bg-[#181f1b] border-[#1f373d] text-[#e3e8e5]'
                      : 'bg-white border-[#bfe0e8]/80 text-[#1c2621]'
                  }`}
                >
                  {/* Card Header */}
                  <div
                    className={`flex items-center justify-between gap-2 pb-2 border-b ${
                      isDark ? 'border-[#1b2f33]' : 'border-[#e4f2f5]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center ${
                          isDark ? 'bg-[#183133] text-[#67e8f9]' : 'bg-[#e0f2fe] text-[#0369a1]'
                        }`}
                      >
                        <Syringe className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => handleUpdateInsulin(mod.id, { title: e.target.value })}
                        className={`text-xs font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none px-1 py-0.5 ${
                          isDark ? 'text-[#f0f4f1] focus:border-cyan-400' : 'text-[#1c2621] focus:border-teal-600'
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(mod.id, copyText)}
                        className={`p-1 rounded transition-colors ${
                          isDark ? 'hover:bg-[#202924] text-[#8fa095]' : 'hover:bg-[#eef3f0] text-[#55665b]'
                        }`}
                        title="คัดลอกสรุป"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveModule(mod.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        title="ลบช่องนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Split by meals */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold opacity-90">
                        ขนาดยาฉีดแยกตามมื้อ (ยูนิต):
                      </span>
                      <span
                        className={`font-bold font-mono-num ${
                          isDark ? 'text-[#67e8f9]' : 'text-[#0f5b66]'
                        }`}
                      >
                        รวม {res.dailyTotal} ยูนิต/วัน
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'เช้า (U)', field: 'morning' as const },
                        { label: 'กลางวัน (U)', field: 'noon' as const },
                        { label: 'เย็น (U)', field: 'evening' as const },
                        { label: 'ก่อนนอน (U)', field: 'bedtime' as const },
                      ].map((meal, mIdx) => (
                        <div key={mIdx}>
                          <span className="text-[10px] opacity-70 block mb-0.5">{meal.label}</span>
                          <input
                            type="number"
                            min="0"
                            value={mod[meal.field]}
                            onChange={(e) =>
                              handleUpdateInsulin(mod.id, {
                                [meal.field]: Math.max(0, parseInt(e.target.value) || 0),
                              })
                            }
                            className={`w-full p-1.5 text-xs text-center font-mono-num font-semibold border rounded-lg ${
                              isDark
                                ? 'bg-[#141a16] border-[#2c3830] text-[#e6ece8]'
                                : 'bg-white border-[#d8e0db] text-[#1c2621]'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Packaging Size */}
                  <div
                    className={`flex items-center justify-between text-xs pt-1 border-t ${
                      isDark ? 'border-[#1b2f33]' : 'border-[#e4f2f5]'
                    }`}
                  >
                    <span className="opacity-80">ขนาดบรรจุ:</span>
                    <div className="flex items-center gap-1">
                      {[
                        { label: 'ด้ามปากกา (300 U)', size: 300 },
                        { label: 'ขวด Vial (1,000 U)', size: 1000 },
                      ].map((pkg, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleUpdateInsulin(mod.id, { packSize: pkg.size })}
                          className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
                            mod.packSize === pkg.size
                              ? isDark
                                ? 'bg-[#163339] border-[#295660] text-[#67e8f9] font-bold'
                                : 'bg-[#e0f2fe] border-[#bae6fd] text-[#0369a1] font-bold'
                              : isDark
                              ? 'bg-[#141a16] border-[#29352e] text-[#819388]'
                              : 'bg-white border-[#d8e0db] text-[#55665b]'
                          }`}
                        >
                          {pkg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buffer Days */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] opacity-70">เผื่อวันนัดคลาดเคลื่อน:</span>
                    <div className="flex items-center gap-1">
                      {[0, 3, 5, 7].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => handleUpdateInsulin(mod.id, { extraDays: b })}
                          className={`px-1.5 py-0.5 rounded text-[10px] border transition-colors ${
                            mod.extraDays === b
                              ? isDark
                                ? 'bg-[#163339] border-[#295660] text-[#67e8f9] font-bold'
                                : 'bg-[#e0f2fe] border-[#bae6fd] text-[#0369a1] font-bold'
                              : isDark
                              ? 'bg-[#141a16] border-[#29352e] text-[#819388]'
                              : 'bg-white border-[#d8e0db] text-[#55665b]'
                          }`}
                        >
                          {b === 0 ? 'ไม่เผื่อ' : `+${b} วัน`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Result Box */}
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isDark
                        ? 'bg-[#122326] border-[#1d444b] text-[#67e8f9]'
                        : 'bg-[#f0f8fa] border-[#bfe0e8] text-[#0f5b66]'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-semibold opacity-90">
                        จำนวนยูนิต & ด้ามยาฉีดที่ต้องจ่าย:
                      </div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span
                          className={`text-2xl sm:text-3xl font-black font-mono-num ${
                            isDark ? 'text-[#cffafe]' : 'text-[#0e4852]'
                          }`}
                        >
                          {res.totalUnits}
                        </span>
                        <span className="text-xs font-bold opacity-90">ยูนิต</span>
                        <span className="opacity-40">·</span>
                        <span
                          className={`text-xl sm:text-2xl font-black font-mono-num ${
                            isDark ? 'text-[#67e8f9]' : 'text-[#0f5b66]'
                          }`}
                        >
                          {res.pens}
                        </span>
                        <span className="text-xs font-bold opacity-90">
                          {mod.packSize === 300 ? 'ด้าม' : 'ขวด'}
                        </span>
                      </div>
                      <div className="text-[10px] mt-0.5 font-mono-num opacity-80">
                        {res.detail} (ปัดเศษขึ้น)
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onPin(`${mod.title}: ${res.totalUnits}U (${res.pens} ${mod.packSize === 300 ? 'ด้าม' : 'ขวด'})`)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shadow-2xs flex items-center gap-1 shrink-0 ${
                        isDark
                          ? 'bg-[#173a40] text-[#cffafe] hover:bg-[#1f4c54]'
                          : 'bg-[#0f5b66] text-white hover:bg-[#0c4750]'
                      }`}
                    >
                      <Bookmark className="w-3 h-3 text-amber-300 fill-amber-300" />
                      <span>ปักหมุด</span>
                    </button>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
};
