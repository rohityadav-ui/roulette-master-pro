import React from 'react';
import { SpinItem } from '../types';
import { getColorHex } from '../engine/colorMapper';

interface HistoryStripProps {
  spins: SpinItem[];
  onRemoveSpin: (id: string) => void;
}

export const HistoryStrip: React.FC<HistoryStripProps> = ({ spins, onRemoveSpin }) => {
  // RTL: newest LEFT, oldest RIGHT
  const reversedSpins = [...spins].reverse();

  return (
    <div className="sticky top-[109px] z-10 bg-gray-950/85 backdrop-blur-xl border-b border-gray-800/80 shadow-xl py-2 px-3">
      <div className="max-w-xl mx-auto flex items-center gap-2.5">
        <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 shrink-0 border-r border-gray-800 pr-2 flex flex-col items-center">
          <span>SPINS</span>
          <span className="text-[9px] text-gray-500 font-bold">{spins.length}</span>
        </div>

        {spins.length === 0 ? (
          <div className="text-xs text-gray-500 italic py-1 truncate">
            Tap a number on the table or use voice to start tracking...
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center gap-2 min-w-max">
              {reversedSpins.map((spin, index) => {
                const isNewest = index === 0;
                const bgHex = getColorHex(spin.color);

                return (
                  <button
                    key={spin.id}
                    onClick={() => onRemoveSpin(spin.id)}
                    title={`#${spin.value} (Cat ${spin.category}) - Tap to remove`}
                    className={`group relative flex flex-col items-center justify-center transition-all cursor-pointer select-none focus:outline-none ${
                      isNewest ? 'animate-bounce-short scale-105' : 'hover:scale-105 active:scale-95'
                    }`}
                  >
                    {/* 3D Number Bubble */}
                    <div
                      style={{ backgroundColor: bgHex }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center font-black text-sm sm:text-base text-white shadow-lg border transition-transform ${
                        isNewest
                          ? 'border-amber-400 ring-2 ring-amber-400/80 shadow-amber-500/30'
                          : 'border-white/15'
                      }`}
                    >
                      <span className="leading-none drop-shadow">{spin.value}</span>
                      <span className="text-[8px] font-bold text-white/70 leading-none mt-0.5">
                        c{spin.category}
                      </span>
                    </div>

                    {/* Pulse ring on latest */}
                    {isNewest && (
                      <span className="absolute -inset-1 rounded-full border border-amber-400/60 animate-ping pointer-events-none" />
                    )}

                    {/* Delete tooltip overlay on hover */}
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-black items-center justify-center hidden group-hover:flex shadow">
                      ×
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
