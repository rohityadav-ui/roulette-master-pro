import React from 'react';
import { CategoryPredictionItem } from '../types';
import { Target } from 'lucide-react';
import { getColorHex } from '../engine/colorMapper';
import { getColor } from '../engine/colorMapper';

interface CategoryPredictionProps {
  topCategories: CategoryPredictionItem[];
  onSelectNumber: (num: number) => void;
}

export const CategoryPrediction: React.FC<CategoryPredictionProps> = ({
  topCategories,
  onSelectNumber,
}) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 p-3.5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Target className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
            Category Prediction (Top 3)
          </h3>
        </div>
        <span className="text-[10px] text-gray-400">Markov & Pattern Fused</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {topCategories.map((item, idx) => {
          const colors = [
            'from-amber-500 to-amber-600 border-amber-500/40 text-amber-300',
            'from-cyan-500 to-cyan-600 border-cyan-500/40 text-cyan-300',
            'from-emerald-500 to-emerald-600 border-emerald-500/40 text-emerald-300',
          ];
          const badgeClass = colors[idx] || colors[0];

          return (
            <div
              key={item.category}
              className="bg-gray-950/70 p-3 rounded-xl border border-gray-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-white">
                    Category {item.category}
                  </span>
                  <span className={`text-xs font-black px-1.5 py-0.5 rounded-md bg-gray-900 border ${badgeClass}`}>
                    {item.percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-2.5">
                  <div
                    style={{ width: `${Math.min(100, item.percentage * 1.5)}%` }}
                    className={`h-full rounded-full bg-gradient-to-r ${badgeClass}`}
                  />
                </div>
              </div>

              {/* Quick chips in this category */}
              <div>
                <span className="text-[10px] text-gray-500 block mb-1 font-semibold uppercase">
                  Numbers ({item.numbers.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.numbers.map((n) => {
                    const c = getColor(n);
                    const bg = getColorHex(c);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => onSelectNumber(n)}
                        style={{ backgroundColor: bg }}
                        className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white border border-white/20 hover:scale-110 active:scale-95 transition-transform"
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
