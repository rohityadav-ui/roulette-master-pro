import React from 'react';
import { SpinRecord } from '../types/roulette';

interface FrozenHistoryBarProps {
  spins: SpinRecord[];
}

export const FrozenHistoryBar: React.FC<FrozenHistoryBarProps> = ({ spins }) => {
  // Newest enters from LEFT, so reverse the spins array: newest at index 0
  const reversedSpins = [...spins].reverse();

  return (
    <div className="sticky top-[73px] z-20 bg-[#0a0a0e]/95 backdrop-blur-md border-b border-amber-950/60 shadow-lg py-2.5 px-3">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 shrink-0 border-r border-amber-900/40 pr-2">
          History
        </div>

        {spins.length === 0 ? (
          <div className="text-xs text-slate-500 italic py-1">
            Tap any number on the grid to add to history...
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center gap-2 min-w-max">
              {reversedSpins.map((spin, index) => {
                const isNewest = index === 0;
                let bgHex = '#212121';
                if (spin.color === 'red') bgHex = '#E53935';
                else if (spin.color === 'green') bgHex = '#4CAF50';

                return (
                  <div
                    key={spin.id}
                    className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
                      isNewest ? 'animate-slide-in scale-105' : ''
                    }`}
                  >
                    <div
                      style={{ backgroundColor: bgHex }}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-xs sm:text-sm text-white shadow-md border ${
                        isNewest
                          ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/20'
                          : 'border-white/20'
                      }`}
                    >
                      {spin.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
