import React from 'react';
import { SevenSpinPredictionData } from '../types';
import { Activity, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { getColor, getColorHex } from '../engine/colorMapper';

interface ActiveTrackingProps {
  prediction: SevenSpinPredictionData;
}

export const ActiveTracking: React.FC<ActiveTrackingProps> = ({ prediction }) => {
  const { windowId, spinInWindow, totalWindowSpins, activeRows } = prediction;

  const progressPct = Math.round((spinInWindow / totalWindowSpins) * 100);

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/90 p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-cyan-300">
              Active Tracking Timeline
            </h3>
            <span className="text-[10px] text-gray-400">
              Spin-by-spin verification for Window #{windowId}
            </span>
          </div>
        </div>

        <span className="text-xs font-black text-white px-2 py-0.5 rounded-lg bg-gray-800 border border-gray-700">
          {spinInWindow} of {totalWindowSpins} Evaluated
        </span>
      </div>

      {/* Timeline Rows */}
      {activeRows.length === 0 ? (
        <div className="py-6 text-center text-xs text-gray-500 italic bg-gray-950/40 rounded-xl border border-dashed border-gray-800">
          Waiting for spins in current 7-spin window. Tap any number on the table to begin tracking.
        </div>
      ) : (
        <div className="space-y-2 mb-3.5">
          {activeRows.map((row) => {
            const color = getColor(row.value);
            const bgHex = getColorHex(color);

            let statusBadge = (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/40 text-rose-300 font-bold text-[11px] flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Miss</span>
              </span>
            );

            if (row.status === 'direct') {
              statusBadge = (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct Hit!</span>
                </span>
              );
            } else if (row.status === 'nearby') {
              statusBadge = (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-[11px] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nearby (±{row.distance})</span>
                </span>
              );
            }

            return (
              <div
                key={row.spinIndex}
                className="flex items-center justify-between p-2.5 bg-gray-950/70 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
              >
                {/* Left: Spin Index + Landed Number */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-gray-500 w-12">
                    Spin {row.spinIndex}/7
                  </span>

                  <div
                    style={{ backgroundColor: bgHex }}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white shadow border border-white/20"
                  >
                    {row.value}
                  </div>
                </div>

                {/* Right: Status badge & Proximity details */}
                <div className="flex items-center gap-2.5">
                  {row.closestTarget !== null && row.status !== 'direct' && (
                    <span className="text-[10px] text-gray-400 hidden sm:inline">
                      Near #{row.closestTarget}
                    </span>
                  )}
                  {statusBadge}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress Bar at Bottom */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
          <span>Window Progress</span>
          <span className="text-cyan-400">{progressPct}%</span>
        </div>
        <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden p-0.5 border border-gray-800">
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 rounded-full transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};
