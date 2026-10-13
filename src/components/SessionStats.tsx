import React from 'react';
import { SessionAccuracyStats } from '../types';
import { Award, BarChart3, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface SessionStatsProps {
  stats: SessionAccuracyStats;
}

export const SessionStats: React.FC<SessionStatsProps> = ({ stats }) => {
  const {
    totalTrackedSpins,
    directHits,
    nearbyHits,
    misses,
    directAccuracy,
    combinedAccuracy,
    bestWindow,
  } = stats;

  // SVG Circular progress values
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (combinedAccuracy / 100) * circumference;

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/90 p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-300">
              Session Accuracy & Metrics
            </h3>
            <span className="text-[10px] text-gray-400">
              Direct & Nearby (±1, ±2) verification across all windows
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-gray-300">
          {totalTrackedSpins} Spins Total
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left: Accuracy Circle Chart (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-gray-950/60 rounded-xl p-3 border border-gray-800">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-gray-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Foreground progress ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-emerald-500 transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-white leading-none">
                {combinedAccuracy}%
              </span>
              <span className="text-[9px] uppercase font-bold text-emerald-400 mt-0.5">
                Combined
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-2 text-[11px] font-semibold">
            <span className="text-emerald-400 font-bold">
              Direct: {directAccuracy}%
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-amber-400 font-bold">
              Near (±2): {totalTrackedSpins > 0 ? Math.round((nearbyHits / totalTrackedSpins) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Right: 3-Column Layout for Numbers (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {/* Col 1: Direct Hits */}
            <div className="p-2.5 bg-emerald-950/30 rounded-xl border border-emerald-900/50 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-black text-emerald-400 mb-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Direct</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-white block">
                {directHits}
              </span>
              <span className="text-[10px] text-emerald-300/80 font-bold">
                {directAccuracy}%
              </span>
            </div>

            {/* Col 2: Nearby Hits */}
            <div className="p-2.5 bg-amber-950/30 rounded-xl border border-amber-900/50 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-black text-amber-400 mb-0.5">
                <AlertCircle className="w-3 h-3" />
                <span>Nearby</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-white block">
                {nearbyHits}
              </span>
              <span className="text-[10px] text-amber-300/80 font-bold">
                ±1, ±2 Pockets
              </span>
            </div>

            {/* Col 3: Misses */}
            <div className="p-2.5 bg-rose-950/30 rounded-xl border border-rose-900/50 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-black text-rose-400 mb-0.5">
                <XCircle className="w-3 h-3" />
                <span>Misses</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-white block">
                {misses}
              </span>
              <span className="text-[10px] text-rose-300/80 font-bold">
                {totalTrackedSpins > 0 ? Math.round((misses / totalTrackedSpins) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Best Prediction Highlight */}
          {bestWindow ? (
            <div className="p-2.5 bg-gray-950/80 rounded-xl border border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-black text-amber-300 block">
                    Best Window: #{bestWindow.windowId}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Highest verified accuracy in a 7-spin segment
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-white px-2 py-1 rounded bg-amber-950/70 border border-amber-800">
                {bestWindow.directCount} Direct + {bestWindow.nearbyCount} Near / {bestWindow.total}
              </span>
            </div>
          ) : (
            <div className="p-2 bg-gray-950/40 rounded-xl border border-gray-800 text-[10px] text-gray-500 text-center italic">
              Best window highlight unlocks after spin evaluation begins.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
