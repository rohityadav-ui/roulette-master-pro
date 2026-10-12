import React, { useState } from 'react';
import { getColor, getColorHex } from '../engine/colorMapper';
import { getCategory } from '../engine/categories';

interface RouletteTableProps {
  onSelectNumber: (num: number) => void;
}

export const RouletteTable: React.FC<RouletteTableProps> = ({ onSelectNumber }) => {
  const [activeNumber, setActiveNumber] = useState<number | null>(null);

  const handleClick = (num: number) => {
    setActiveNumber(num);
    setTimeout(() => {
      setActiveNumber(null);
    }, 200);

    onSelectNumber(num);
  };

  const rows = [
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30],
    [31, 32, 33, 34, 35, 36],
  ];

  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 p-3.5 sm:p-4 shadow-xl">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-black uppercase tracking-wider text-amber-400">
          Roulette Table (0 - 36)
        </span>
        <span className="text-[10px] text-gray-400">
          Tap number to log spin
        </span>
      </div>

      {/* 0 (Green, Alone on top) */}
      <button
        type="button"
        onClick={() => handleClick(0)}
        style={{ backgroundColor: getColorHex('G') }}
        className={`w-full py-2.5 sm:py-3 mb-2 rounded-2xl text-white font-black text-base sm:text-lg shadow-lg border border-white/20 flex items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
          activeNumber === 0 ? 'scale-110 ring-4 ring-amber-400 z-10' : 'hover:scale-[1.01]'
        }`}
      >
        <span>0 (Zero)</span>
      </button>

      {/* 6 Columns Rows (1-36) */}
      <div className="space-y-1.5 sm:space-y-2">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-6 gap-1.5 sm:gap-2">
            {row.map((num) => {
              const color = getColor(num);
              const bg = getColorHex(color);
              const cat = getCategory(num);
              const isSelected = activeNumber === num;

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleClick(num)}
                  style={{ backgroundColor: bg }}
                  className={`h-11 sm:h-12 rounded-xl text-white font-black text-sm sm:text-base shadow-md border border-white/10 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'scale-125 ring-2 ring-amber-400 z-10 shadow-amber-500/40 shadow-xl'
                      : 'hover:scale-[1.04] active:scale-90'
                  }`}
                >
                  <span className="leading-none drop-shadow">{num}</span>
                  <span className="text-[8px] font-bold text-white/60 leading-none mt-0.5">
                    c{cat}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
