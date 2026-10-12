import React from 'react';
import { Sparkles } from 'lucide-react';
import { getColor, getColorHex } from '../engine/colorMapper';
import { getCategory } from '../engine/categories';

interface SuggestedNumbersProps {
  numbers: number[];
  onSelectNumber: (num: number) => void;
}

export const SuggestedNumbers: React.FC<SuggestedNumbersProps> = ({
  numbers,
  onSelectNumber,
}) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 p-3.5 shadow-xl">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
            Suggested Key Numbers (Hot Fused)
          </h3>
        </div>
        <span className="text-[10px] text-gray-400">High Statistical Overlap</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {numbers.map((num) => {
          const color = getColor(num);
          const bgHex = getColorHex(color);
          const cat = getCategory(num);

          return (
            <button
              key={num}
              type="button"
              onClick={() => onSelectNumber(num)}
              style={{ backgroundColor: bgHex }}
              className="py-2.5 px-2 rounded-2xl border border-amber-400/50 flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-black/50 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <span className="text-base sm:text-lg font-black text-white drop-shadow">
                {num}
              </span>
              <span className="text-[9px] font-bold text-amber-300/90 leading-none">
                Cat {cat}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
