import React, { useMemo } from 'react';
import { SpinItem } from '../types';
import { getWheelNeighbors } from '../engine/wheelNeighbors';
import { getColor, getColorHex } from '../engine/colorMapper';
import { getCategory } from '../engine/categories';
import { BarChart2, Compass, Layers } from 'lucide-react';

interface TrendsTabProps {
  spins: SpinItem[];
  onSelectNumber: (num: number) => void;
}

export const TrendsTab: React.FC<TrendsTabProps> = ({ spins, onSelectNumber }) => {
  const totalSpins = spins.length;
  const lastSpin = spins.length > 0 ? spins[spins.length - 1] : null;

  // 1. Color trends
  const colorCounts = useMemo(() => {
    let red = 0;
    let black = 0;
    let green = 0;
    spins.forEach((s) => {
      if (s.color === 'R') red++;
      else if (s.color === 'B') black++;
      else green++;
    });
    return {
      red,
      black,
      green,
      redPct: totalSpins > 0 ? (red / totalSpins) * 100 : 0,
      blackPct: totalSpins > 0 ? (black / totalSpins) * 100 : 0,
      greenPct: totalSpins > 0 ? (green / totalSpins) * 100 : 0,
    };
  }, [spins, totalSpins]);

  // 2. Dozen trends
  const dozenCounts = useMemo(() => {
    const dCounts = { 1: 0, 2: 0, 3: 0, 0: 0 };
    spins.forEach((s) => {
      dCounts[s.dozen]++;
    });
    return [
      { id: 1, name: '1st Dozen (1-12)', count: dCounts[1], pct: totalSpins > 0 ? (dCounts[1] / totalSpins) * 100 : 0 },
      { id: 2, name: '2nd Dozen (13-24)', count: dCounts[2], pct: totalSpins > 0 ? (dCounts[2] / totalSpins) * 100 : 0 },
      { id: 3, name: '3rd Dozen (25-36)', count: dCounts[3], pct: totalSpins > 0 ? (dCounts[3] / totalSpins) * 100 : 0 },
    ];
  }, [spins, totalSpins]);

  // 3. Column trends
  const columnCounts = useMemo(() => {
    const cCounts = { 1: 0, 2: 0, 3: 0, 0: 0 };
    spins.forEach((s) => {
      cCounts[s.column]++;
    });
    return [
      { id: 1, name: '1st Column (1,4,7...)', count: cCounts[1], pct: totalSpins > 0 ? (cCounts[1] / totalSpins) * 100 : 0 },
      { id: 2, name: '2nd Column (2,5,8...)', count: cCounts[2], pct: totalSpins > 0 ? (cCounts[2] / totalSpins) * 100 : 0 },
      { id: 3, name: '3rd Column (3,6,9...)', count: cCounts[3], pct: totalSpins > 0 ? (cCounts[3] / totalSpins) * 100 : 0 },
    ];
  }, [spins, totalSpins]);

  // 4. Neighbors of last spin (last ± 2 in European wheel)
  const neighbors = useMemo(() => {
    if (!lastSpin) return null;
    return getWheelNeighbors(lastSpin.value);
  }, [lastSpin]);

  return (
    <div className="space-y-4">
      {/* 4. Neighbors Section (Last Number ± 2) */}
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-amber-500/40 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400">
              Wheel Neighbors (Last Spin ± 2)
            </h3>
          </div>
          {lastSpin ? (
            <span className="text-xs font-bold text-slate-300">
              Center: <strong className="text-amber-400 font-black">#{lastSpin.value}</strong>
            </span>
          ) : (
            <span className="text-xs text-gray-500 italic">No spin yet</span>
          )}
        </div>

        {neighbors ? (
          <div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3 my-2">
              {[
                { label: 'L2 (-2)', val: neighbors.l2 },
                { label: 'L1 (-1)', val: neighbors.l1 },
                { label: 'CENTER', val: neighbors.center, isCenter: true },
                { label: 'R1 (+1)', val: neighbors.r1 },
                { label: 'R2 (+2)', val: neighbors.r2 },
              ].map((slot, idx) => {
                const color = getColor(slot.val);
                const bg = getColorHex(color);
                const cat = getCategory(slot.val);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectNumber(slot.val)}
                    className="flex flex-col items-center justify-center group focus:outline-none"
                  >
                    <div
                      style={{ backgroundColor: bg }}
                      className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center text-white font-black shadow-lg border transition-transform duration-200 cursor-pointer ${
                        slot.isCenter
                          ? 'border-amber-400 ring-2 ring-amber-400/80 shadow-amber-500/30 scale-105'
                          : 'border-white/20 group-hover:scale-105 active:scale-95'
                      }`}
                    >
                      <span className="text-sm sm:text-base leading-none drop-shadow">
                        {slot.val}
                      </span>
                      <span className="text-[8px] font-bold text-white/70 leading-none mt-0.5">
                        c{cat}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] sm:text-[10px] font-bold mt-1.5 ${
                        slot.isCenter ? 'text-amber-400 font-black' : 'text-gray-400'
                      }`}
                    >
                      {slot.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              Tap any neighbor number to record into spin history
            </p>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-gray-500 italic">
            Log a number on the table to see its physical wheel sector neighbors.
          </div>
        )}
      </div>

      {/* 1. Color Trends */}
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
            1. Color Trends
          </h3>
        </div>

        <div className="space-y-2.5">
          {/* Red */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-red-400">Red ({colorCounts.red})</span>
              <span className="text-white">{colorCounts.redPct.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden p-0.5 border border-gray-800">
              <div
                style={{ width: `${colorCounts.redPct}%` }}
                className="h-full bg-red-600 rounded-full transition-all duration-300"
              />
            </div>
          </div>

          {/* Black */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-gray-300">Black ({colorCounts.black})</span>
              <span className="text-white">{colorCounts.blackPct.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden p-0.5 border border-gray-800">
              <div
                style={{ width: `${colorCounts.blackPct}%` }}
                className="h-full bg-zinc-600 rounded-full transition-all duration-300"
              />
            </div>
          </div>

          {/* Green */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-emerald-400">Green Zero ({colorCounts.green})</span>
              <span className="text-white">{colorCounts.greenPct.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden p-0.5 border border-gray-800">
              <div
                style={{ width: `${colorCounts.greenPct}%` }}
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dozen Trends */}
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
            2. Dozen Trends
          </h3>
        </div>

        <div className="space-y-2.5">
          {dozenCounts.map((d) => (
            <div key={d.id}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">{d.name} ({d.count})</span>
                <span className="text-amber-400">{d.pct.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden p-0.5 border border-gray-800">
                <div
                  style={{ width: `${d.pct}%` }}
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Column Trends */}
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300">
            3. Column Trends
          </h3>
        </div>

        <div className="space-y-2.5">
          {columnCounts.map((c) => (
            <div key={c.id}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">{c.name} ({c.count})</span>
                <span className="text-cyan-400">{c.pct.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden p-0.5 border border-gray-800">
                <div
                  style={{ width: `${c.pct}%` }}
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
