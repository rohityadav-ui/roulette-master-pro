import React from 'react';
import { HotNumbersAnalysis } from '../types';
import { Flame, Snowflake, SunMedium } from 'lucide-react';
import { getColor, getColorHex } from '../engine/colorMapper';

interface HotNumbersProps {
  hotNumbers: HotNumbersAnalysis;
  onSelectNumber: (num: number) => void;
}

export const HotNumbers: React.FC<HotNumbersProps> = ({
  hotNumbers,
  onSelectNumber,
}) => {
  const { superHot, warm, cold, totalEvaluated } = hotNumbers;

  return (
    <div className="bg-gradient-to-br from-amber-950/70 via-red-950/80 to-stone-950/90 backdrop-blur-xl rounded-2xl border border-red-900/60 p-4 shadow-2xl relative overflow-hidden">
      {/* Background ambient flame glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-red-900/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500/50 flex items-center justify-center">
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-200">
              Hot Numbers Frequency
            </h3>
            <span className="text-[10px] text-red-200/70">
              Evaluated over last {totalEvaluated} spins (3 Tier Spectrum)
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/80 border border-red-800 text-red-200">
          Last 60 Spins
        </span>
      </div>

      <div className="space-y-3.5">
        {/* Tier 1: Super Hot (Pulsing Red Glow) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              <span>Super Hot</span>
              <span className="text-[10px] text-red-300/80 font-normal">
                (≥ 4 hits / Peak Momentum)
              </span>
            </div>
            <span className="text-[10px] font-bold text-red-400">
              {superHot.length} Numbers
            </span>
          </div>

          {superHot.length === 0 ? (
            <div className="text-[11px] text-red-200/60 italic py-1 bg-black/20 rounded-xl px-3 border border-red-950">
              No super-hot numbers currently (need ≥ 4 hits in last 60 spins).
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {superHot.map((item) => {
                const color = getColor(item.number);
                const bgHex = getColorHex(color);

                return (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => onSelectNumber(item.number)}
                    className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-950/80 border border-red-500 ring-2 ring-red-500/80 shadow-lg shadow-red-600/40 animate-pulse hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <div
                      style={{ backgroundColor: bgHex }}
                      className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs text-white shadow"
                    >
                      {item.number}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-black text-white block leading-none">
                        {item.hits}x
                      </span>
                      <span className="text-[8px] text-red-300 font-bold leading-none">
                        {item.percentage}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tier 2: Warm (Orange Glow) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
              <SunMedium className="w-3.5 h-3.5 text-amber-400" />
              <span>Warm</span>
              <span className="text-[10px] text-amber-300/80 font-normal">
                (2–3 hits / Active Cluster)
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-400">
              {warm.length} Numbers
            </span>
          </div>

          {warm.length === 0 ? (
            <div className="text-[11px] text-amber-200/60 italic py-1 bg-black/20 rounded-xl px-3 border border-amber-950">
              No warm numbers currently in this range.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {warm.slice(0, 10).map((item) => {
                const color = getColor(item.number);
                const bgHex = getColorHex(color);

                return (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => onSelectNumber(item.number)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/60 ring-1 ring-amber-500/70 shadow-md shadow-amber-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <div
                      style={{ backgroundColor: bgHex }}
                      className="w-5 h-5 rounded-full flex items-center justify-center font-black text-[11px] text-white shadow"
                    >
                      {item.number}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-amber-200 block leading-none">
                        {item.hits}x
                      </span>
                      <span className="text-[8px] text-amber-400/80 font-semibold leading-none">
                        {item.percentage}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tier 3: Cold (Gray Border, Longest Dormant) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-gray-400">
              <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cold / Sleepers</span>
              <span className="text-[10px] text-gray-500 font-normal">
                (≤ 1 hit / Longest Dormant)
              </span>
            </div>
            <span className="text-[10px] font-bold text-gray-400">
              Top 8 Dormant
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {cold.slice(0, 8).map((item) => {
              const color = getColor(item.number);
              const bgHex = getColorHex(color);

              return (
                <button
                  key={item.number}
                  type="button"
                  onClick={() => onSelectNumber(item.number)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-gray-900/80 border border-gray-700/80 hover:border-gray-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <div
                    style={{ backgroundColor: bgHex }}
                    className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
                  >
                    {item.number}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400">
                    {item.spinsAgo}sp
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
