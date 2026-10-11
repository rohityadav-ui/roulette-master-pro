import React, { useState } from 'react';
import { getNumberColor } from '../utils/constants';

interface RouletteGridProps {
  onSelectNumber: (num: number) => void;
}

export const RouletteGrid: React.FC<RouletteGridProps> = ({ onSelectNumber }) => {
  const [clickedNum, setClickedNum] = useState<number | null>(null);

  const handleClick = (num: number) => {
    // Trigger haptic vibration if supported on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }

    setClickedNum(num);
    setTimeout(() => {
      setClickedNum(null);
    }, 200);

    // Immediately adds to history, NO popup!
    onSelectNumber(num);
  };

  // 1-36 in 6 rows x 6 columns
  // Row 1: 1..6, Row 2: 7..12, Row 3: 13..18, Row 4: 19..24, Row 5: 25..30, Row 6: 31..36
  const numbers1to36 = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <div className="bg-[#10121a] rounded-2xl border border-amber-900/50 p-3 sm:p-4 shadow-xl">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
          Roulette Grid (0 - 36)
        </span>
        <span className="text-[11px] text-slate-400">
          Tap number to log
        </span>
      </div>

      {/* 0 at top, spanning full width */}
      <button
        type="button"
        onClick={() => handleClick(0)}
        style={{ backgroundColor: '#4CAF50' }}
        className={`w-full py-2.5 sm:py-3 mb-2 rounded-xl text-white font-black text-base sm:text-lg shadow-md border border-white/20 flex items-center justify-center transition-transform duration-200 select-none cursor-pointer ${
          clickedNum === 0 ? 'scale-125 z-10' : 'hover:scale-[1.02] active:scale-95'
        }`}
      >
        0
      </button>

      {/* 1-36 in 6 rows x 6 columns */}
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {numbers1to36.map((num) => {
          const color = getNumberColor(num);
          const bgHex = color === 'red' ? '#E53935' : '#212121';
          const isAnimating = clickedNum === num;

          return (
            <button
              key={num}
              type="button"
              onClick={() => handleClick(num)}
              style={{ backgroundColor: bgHex }}
              className={`h-11 sm:h-12 rounded-xl text-white font-black text-sm sm:text-base shadow-md border border-white/10 flex items-center justify-center transition-transform duration-200 select-none cursor-pointer ${
                isAnimating ? 'scale-125 z-10 shadow-lg ring-2 ring-amber-400' : 'hover:scale-[1.04] active:scale-90'
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
};
