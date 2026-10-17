import React, { useState } from 'react';
import { getColor, RED_NUMBERS } from '../engine/colorMapper';
import { getCategory } from '../engine/categories';
import { Sparkles } from 'lucide-react';

interface RouletteTableProps {
  onSelectNumber: (num: number) => void;
  safeDozens?: number[];
  dangerDozen?: number | null;
  hotColumn?: number | null;
  lastSpin?: number | null;
}

export const RouletteTable: React.FC<RouletteTableProps> = ({
  onSelectNumber,
  lastSpin = null,
}) => {
  const [activeNumber, setActiveNumber] = useState<number | null>(null);

  const handleClick = (num: number) => {
    setActiveNumber(num);
    setTimeout(() => {
      setActiveNumber(null);
    }, 200);
    onSelectNumber(num);
  };

  // Numbers 1 to 36 organized in rows of 6
  // Row 1: 1, 2, 3, 4, 5, 6
  // Row 2: 7, 8, 9, 10, 11, 12
  // Row 3: 13, 14, 15, 16, 17, 18
  // Row 4: 19, 20, 21, 22, 23, 24
  // Row 5: 25, 26, 27, 28, 29, 30
  // Row 6: 31, 32, 33, 34, 35, 36
  const gridNumbers = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-800 p-3 sm:p-4 shadow-2xl">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <span className="text-base select-none">🎰</span>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400">
            Roulette Table (0-36)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {lastSpin !== null && (
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>Last:</span>
              <strong className="text-white font-black">#{lastSpin}</strong>
            </span>
          )}
          <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">
            Tap number to input
          </span>
        </div>
      </div>

      {/* TOP: Wide Green Button for "0" */}
      <div className="mb-2">
        <button
          type="button"
          onClick={() => handleClick(0)}
          className={`w-full py-2 sm:py-2.5 px-4 rounded-xl font-black text-white flex items-center justify-between bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:to-green-500 active:scale-[0.98] border border-emerald-400/50 shadow-md shadow-emerald-950/50 transition-all cursor-pointer relative overflow-hidden group ${
            lastSpin === 0
              ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-gray-950 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
              : ''
          } ${activeNumber === 0 ? 'scale-95 brightness-125' : ''}`}
          title="Number 0 (Zero)"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
              ZERO
            </span>
            <span className="text-[10px] text-emerald-200/80 font-medium">c5</span>
          </div>
          <span className="text-lg sm:text-xl font-black tracking-widest drop-shadow-md">
            0
          </span>
          <div className="flex items-center gap-1 text-[10px] text-emerald-200/90 font-medium">
            {lastSpin === 0 && (
              <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 border border-amber-400/50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                LAST
              </span>
            )}
            <span className="opacity-80">Green</span>
          </div>
        </button>
      </div>

      {/* MAIN 6x6 GRID: Numbers 1 to 36 */}
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {gridNumbers.map((num) => {
          const isRed = RED_NUMBERS.includes(num);
          const isLast = lastSpin === num;
          const isActive = activeNumber === num;
          const cat = getCategory(num);

          return (
            <button
              key={num}
              type="button"
              onClick={() => handleClick(num)}
              className={`relative flex flex-col items-center justify-center rounded-xl p-1 sm:p-1.5 aspect-square transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                isRed
                  ? 'bg-red-600 hover:bg-red-500 border border-red-500/40 text-white shadow-md shadow-red-950/50'
                  : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white shadow-md shadow-black/60'
              } ${
                isLast
                  ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-gray-950 shadow-[0_0_14px_rgba(251,191,36,0.7)] z-10'
                  : ''
              } ${isActive ? 'scale-90 brightness-150' : ''}`}
              title={`Number ${num} (${isRed ? 'Red' : 'Black'}, Category ${cat})`}
            >
              {/* Last Spin Golden Badge Indicator */}
              {isLast && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-black" />
                </span>
              )}

              {/* Number Value */}
              <span className="text-sm sm:text-base md:text-lg font-black leading-none drop-shadow">
                {num}
              </span>

              {/* Category sub-label */}
              <span className="text-[9px] font-semibold text-white/60 leading-tight mt-0.5">
                {cat}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
