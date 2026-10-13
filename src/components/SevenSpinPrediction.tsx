import React from 'react';
import { SevenSpinPredictionData } from '../types';
import { Target, Sparkles } from 'lucide-react';
import { getColor, getColorHex } from '../engine/colorMapper';
import { getCategory } from '../engine/categories';

interface SevenSpinPredictionProps {
  prediction: SevenSpinPredictionData;
  onSelectNumber: (num: number) => void;
}

export const SevenSpinPrediction: React.FC<SevenSpinPredictionProps> = ({
  prediction,
  onSelectNumber,
}) => {
  const {
    windowId,
    spinInWindow,
    totalWindowSpins,
    tier1High,
    tier2Medium,
    tier3Value,
    allSuggested,
  } = prediction;

  const renderChips = (numbers: number[], glowClass: string) => {
    return (
      <div className="flex flex-wrap gap-2">
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
              className={`min-w-[42px] h-10 px-2.5 rounded-xl border flex items-center justify-center gap-1 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${glowClass}`}
            >
              <span className="text-sm font-black text-white drop-shadow">
                {num}
              </span>
              <span className="text-[9px] font-bold text-white/70 leading-none">
                c{cat}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-amber-500/50 p-4 shadow-2xl relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header with Window Indicator */}
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
              7-Spin Window Target ({allSuggested.length} Numbers)
            </h3>
            <span className="text-[10px] text-gray-400">
              Multi-Window Markov (15/30/60) + Momentum Engine
            </span>
          </div>
        </div>

        {/* Window Indicator */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-amber-400 block">
            Next 7 Spins
          </span>
          <span className="text-xs font-black text-white px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/80">
            Window #{windowId} · Spin {spinInWindow}/{totalWindowSpins}
          </span>
        </div>
      </div>

      <div className="space-y-3.5">
        {/* Tier 1: 🔴 High Confidence (3-4 numbers) */}
        <div className="p-3 bg-red-950/30 rounded-xl border border-red-900/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🔴</span>
              <span className="text-xs font-black uppercase tracking-wider text-red-400">
                Tier 1: High Confidence
              </span>
            </div>
            <span className="text-[10px] text-red-300/80 font-bold">
              {tier1High.length} Chips · Peak Markov & Heat
            </span>
          </div>
          {renderChips(tier1High, 'border-red-500 ring-1 ring-red-500/60 shadow-red-950/50')}
        </div>

        {/* Tier 2: 🟡 Medium Confidence (3-4 numbers) */}
        <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-900/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🟡</span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                Tier 2: Medium Confidence
              </span>
            </div>
            <span className="text-[10px] text-amber-300/80 font-bold">
              {tier2Medium.length} Chips · Cyclic Secondary
            </span>
          </div>
          {renderChips(tier2Medium, 'border-amber-500 ring-1 ring-amber-500/50 shadow-amber-950/50')}
        </div>

        {/* Tier 3: 🟢 Value / Sleeper Confidence (2-3 numbers) */}
        <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🟢</span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Tier 3: Value / Sleeper
              </span>
            </div>
            <span className="text-[10px] text-emerald-300/80 font-bold">
              {tier3Value.length} Chips · Statistical Return
            </span>
          </div>
          {renderChips(tier3Value, 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-emerald-950/50')}
        </div>
      </div>
    </div>
  );
};
