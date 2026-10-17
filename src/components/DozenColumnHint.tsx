import React from 'react';
import { PredictionResult, SpinItem } from '../types';
import { calculateDozenTarget, DOZEN_NAMES } from '../engine/dozenTarget';
import { Target, AlertTriangle, ShieldCheck, Lightbulb, Sparkles, Ban } from 'lucide-react';

interface DozenColumnHintProps {
  prediction: PredictionResult;
  spins?: SpinItem[];
  hideColumnHint?: boolean;
}

export const DozenColumnHint: React.FC<DozenColumnHintProps> = ({
  prediction,
  spins,
  hideColumnHint = false,
}) => {
  const { columnHint } = prediction;

  // Use precomputed dozenTarget from prediction or calculate from spins
  const dozenTarget =
    prediction.dozenTarget ||
    (spins ? calculateDozenTarget(spins.map((s) => s.value)) : calculateDozenTarget([]));

  const { safeDozens, dangerDozen, reason } = dozenTarget;

  return (
    <div className="space-y-3">
      {/* 🎯 DOZEN TARGET (2 SAFE / 1 AVOID) */}
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-amber-500/40 p-4 shadow-2xl relative overflow-hidden group">
        {/* Subtle background ambient glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800/80">
          <div className="flex items-center gap-2">
            <span className="text-base select-none">🎯</span>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>DOZEN TARGET</span>
              <span className="text-gray-400 font-semibold">(2 SAFE / 1 AVOID)</span>
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300">
            67% Coverage
          </span>
        </div>

        <div className="space-y-3.5">
          {/* 🟢 SAFE TO BET (2 Dozens): */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs select-none">🟢</span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                SAFE TO BET (2 Dozens):
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {safeDozens.map((d) => (
                <div
                  key={d}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-950/90 to-teal-950/70 border-2 border-emerald-500/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-black tracking-wide">
                      {DOZEN_NAMES[d] || `${d}th Dozen`}
                    </span>
                  </div>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 uppercase">
                    SAFE BET
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 🔴 DANGER - AVOID: */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs select-none">🔴</span>
              <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                DANGER - AVOID:
              </span>
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-950/90 to-red-950/70 border-2 border-rose-500/80 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs sm:text-sm font-black tracking-wide">
                  {DOZEN_NAMES[dangerDozen] || `${dangerDozen}th Dozen`}
                </span>
              </div>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-200 border border-rose-500/40 uppercase">
                AVOID
              </span>
            </div>
          </div>

          {/* 💡 Reason: */}
          <div className="bg-gray-950/70 rounded-xl border border-gray-800 p-3 mt-1">
            <div className="flex items-center gap-1.5 mb-1 text-amber-300">
              <span className="text-xs select-none">💡</span>
              <span className="text-[11px] font-black uppercase tracking-wider">Reason:</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              {reason}
            </p>
          </div>
        </div>
      </div>

      {/* Column Target (Maintained for complete table insights) */}
      {!hideColumnHint && (
        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 p-3.5 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
                Column Target
              </span>
            </div>
            <span className="text-xs font-black text-cyan-300 px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
              {columnHint.probability}%
            </span>
          </div>

          <h4 className="text-sm font-black text-white mb-0.5">
            {columnHint.title}
          </h4>
          <p className="text-[11px] text-gray-400 leading-tight">
            {columnHint.description}
          </p>

          {/* Progress indicator */}
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-2.5">
            <div
              style={{ width: `${columnHint.probability}%` }}
              className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
