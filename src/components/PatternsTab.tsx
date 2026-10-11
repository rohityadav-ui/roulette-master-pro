import React, { useState } from 'react';
import { SpinRecord } from '../types/roulette';
import { CATEGORIES, getNumberCategories, getNumberColor } from '../utils/constants';
import { calculatePatterns, getPredictionsForLastNumber } from '../utils/patterns';
import {
  Layers,
  ArrowRightLeft,
  Boxes,
  RotateCw,
  Repeat,
  Sparkles,
  ChevronRight,
  X,
  Compass,
} from 'lucide-react';

interface PatternsTabProps {
  spins: SpinRecord[];
  onSelectNumber: (num: number) => void;
}

export const PatternsTab: React.FC<PatternsTabProps> = ({ spins, onSelectNumber }) => {
  const [showComboModal, setShowComboModal] = useState<boolean>(false);
  const [comboModalMode, setComboModalMode] = useState<'normal' | 'oneCut'>('normal');

  const historyLength = spins.length;
  const lastSpin = spins.length > 0 ? spins[spins.length - 1] : null;
  const lastNum = lastSpin ? lastSpin.value : null;

  const lastCategories = lastNum !== null ? getNumberCategories(lastNum) : [];
  const lastColor = lastNum !== null ? getNumberColor(lastNum) : null;
  const lastColorEmoji = lastColor === 'red' ? '🔴 RED' : lastColor === 'black' ? '⚫ BLACK' : '🟢 GREEN';

  const patternData = calculatePatterns(spins);
  const predictions = getPredictionsForLastNumber(lastNum);

  // Helper to compute percentage = (count / historyLength) * 100
  const getPercent = (count: number) => {
    if (historyLength === 0) return 0;
    return Math.min(100, (count / historyLength) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Last Number & Category Indicator */}
      <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 sm:p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
              Current Active State:
            </span>
            {lastNum !== null ? (
              <span className="text-xs font-bold text-slate-100">
                Last Number: <strong className="text-amber-400 font-black">#{lastNum}</strong> | Category:{' '}
                <strong className="text-amber-300 font-bold">
                  {lastCategories.map((c) => `Cat ${c}`).join(', ')}
                </strong>{' '}
                | Color: <span className="font-bold">{lastColorEmoji}</span>
              </span>
            ) : (
              <span className="text-xs text-slate-500 italic">No spins logged yet</span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            History: {historyLength} spins
          </div>
        </div>
      </div>

      {/* Category Legend (All 5 Categories) */}
      <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 shadow-xl">
        <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block mb-2.5">
          Category Legend (Cat 1 - Cat 5)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {([1, 2, 3, 4, 5] as const).map((cat) => {
            const nums = CATEGORIES[cat];
            const isLastInThis = lastCategories.includes(cat);
            return (
              <div
                key={cat}
                className={`p-2.5 rounded-xl border text-xs transition-colors ${
                  isLastInThis
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-400/50'
                    : 'bg-[#161822] border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-amber-300">Cat {cat}</span>
                  {isLastInThis && (
                    <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-black">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-300 font-semibold">
                  {nums.map((n) => (
                    <span
                      key={n}
                      className={lastNum === n ? 'text-amber-300 underline font-black' : ''}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PREDICTION SECTION (Based on Last Number) */}
      <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 sm:p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
            Predictions Engine (Based on Last Spin #{lastNum ?? '—'})
          </h3>
        </div>

        {/* Next Sequence Predictions (Right & Left) */}
        <div>
          <span className="text-xs font-bold text-slate-300 block mb-2">
            Next Sequence Predictions:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* RIGHT: Cat +1 */}
            <div className="bg-[#161822] p-3 rounded-xl border border-blue-900/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-blue-400">
                  RIGHT (+1 Cycle): Cat {predictions.rightCat}
                </span>
                <span className="text-[10px] text-slate-500">Tap number to log</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {predictions.rightNumbers.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onSelectNumber(n)}
                    style={{ backgroundColor: getNumberColor(n) === 'red' ? '#E53935' : getNumberColor(n) === 'green' ? '#4CAF50' : '#212121' }}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white border border-white/20 hover:scale-110 active:scale-95 transition-transform"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* LEFT: Cat -1 */}
            <div className="bg-[#161822] p-3 rounded-xl border border-cyan-900/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-cyan-400">
                  LEFT (-1 Cycle): Cat {predictions.leftCat}
                </span>
                <span className="text-[10px] text-slate-500">Tap number to log</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {predictions.leftNumbers.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onSelectNumber(n)}
                    style={{ backgroundColor: getNumberColor(n) === 'red' ? '#E53935' : getNumberColor(n) === 'green' ? '#4CAF50' : '#212121' }}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white border border-white/20 hover:scale-110 active:scale-95 transition-transform"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Combos activated by Last Number */}
        <div>
          <span className="text-xs font-bold text-slate-300 block mb-2">
            Active Combo Triggers:
          </span>
          {predictions.activeCombos.length === 0 ? (
            <div className="text-xs text-slate-500 italic bg-[#161822] p-2.5 rounded-xl border border-slate-800">
              Koi active combo trigger nahi hai is number ke sath.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {predictions.activeCombos.map((ac, idx) => (
                <div key={idx} className="bg-[#161822] p-2.5 rounded-xl border border-emerald-900/40">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">
                    {ac.name}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ac.numbers.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => onSelectNumber(n)}
                        style={{ backgroundColor: getNumberColor(n) === 'red' ? '#E53935' : getNumberColor(n) === 'green' ? '#4CAF50' : '#212121' }}
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] text-white border border-white/20 hover:scale-110 active:scale-95 transition-transform"
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 6 INSIDE PATTERN BOXES (2 x 3 Grid) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
            Inside Patterns Monitor (2 × 3 Grid)
          </span>
          <span className="text-[11px] text-slate-400">
            Tap Combos for 8-Combo Breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 1. SEQUENCE (Blue #3b82f6) */}
          <div className="bg-[#10121a] p-3.5 rounded-2xl border border-blue-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                  Sequence
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Consecutive categories (diff 1 or 4)
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xl font-black text-white">
                  {patternData.sequenceCount} <span className="text-xs font-semibold text-slate-400">baar</span>
                </span>
                <span className="text-xs font-bold text-blue-400">
                  {getPercent(patternData.sequenceCount).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${getPercent(patternData.sequenceCount)}%` }}
                  className="bg-[#3b82f6] h-full rounded-full transition-all"
                />
              </div>
            </div>
          </div>

          {/* 2. ONE CUT SEQUENCE (Cyan #06b6d4) */}
          <div className="bg-[#10121a] p-3.5 rounded-2xl border border-cyan-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                  One Cut Sequence
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Consecutive with 1 gap in between
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xl font-black text-white">
                  {patternData.oneCutSequenceCount} <span className="text-xs font-semibold text-slate-400">baar</span>
                </span>
                <span className="text-xs font-bold text-cyan-400">
                  {getPercent(patternData.oneCutSequenceCount).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${getPercent(patternData.oneCutSequenceCount)}%` }}
                  className="bg-[#06b6d4] h-full rounded-full transition-all"
                />
              </div>
            </div>
          </div>

          {/* 3. COMBO (Green #22c55e) - TAP TO EXPAND */}
          <div
            onClick={() => {
              setComboModalMode('normal');
              setShowComboModal(true);
            }}
            className="bg-[#10121a] p-3.5 rounded-2xl border border-emerald-500/40 shadow-xl flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Combo (8 Combos)
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Adjacent combo match. (Tap for 8 combo details)
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xl font-black text-white">
                  {patternData.comboCount} <span className="text-xs font-semibold text-slate-400">baar</span>
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {getPercent(patternData.comboCount).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${getPercent(patternData.comboCount)}%` }}
                  className="bg-[#22c55e] h-full rounded-full transition-all"
                />
              </div>
            </div>
          </div>

          {/* 4. ONE CUT COMBO (Yellow #eab308) - TAP TO EXPAND */}
          <div
            onClick={() => {
              setComboModalMode('oneCut');
              setShowComboModal(true);
            }}
            className="bg-[#10121a] p-3.5 rounded-2xl border border-yellow-500/40 shadow-xl flex flex-col justify-between cursor-pointer hover:border-yellow-400 transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="text-xs font-black uppercase tracking-wider text-yellow-400">
                    One Cut Combo
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Combos with 1 gap in between (Tap for details)
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xl font-black text-white">
                  {patternData.oneCutComboCount} <span className="text-xs font-semibold text-slate-400">baar</span>
                </span>
                <span className="text-xs font-bold text-yellow-400">
                  {getPercent(patternData.oneCutComboCount).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${getPercent(patternData.oneCutComboCount)}%` }}
                  className="bg-[#eab308] h-full rounded-full transition-all"
                />
              </div>
            </div>
          </div>

          {/* 5. REPEATING (Purple #a855f7) */}
          <div className="bg-[#10121a] p-3.5 rounded-2xl border border-purple-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-xs font-black uppercase tracking-wider text-purple-400">
                  Repeating
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Consecutive same category numbers
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xl font-black text-white">
                  {patternData.repeatingCount} <span className="text-xs font-semibold text-slate-400">baar</span>
                </span>
                <span className="text-xs font-bold text-purple-400">
                  {getPercent(patternData.repeatingCount).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${getPercent(patternData.repeatingCount)}%` }}
                  className="bg-[#a855f7] h-full rounded-full transition-all"
                />
              </div>
            </div>
          </div>

          {/* 6. ONE CUT REPEATING (Pink #ec4899) */}
          <div className="bg-[#10121a] p-3.5 rounded-2xl border border-pink-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                <span className="text-xs font-black uppercase tracking-wider text-pink-400">
                  One Cut Repeating
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Same category repeating with 1 gap in between
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xl font-black text-white">
                  {patternData.oneCutRepeatingCount} <span className="text-xs font-semibold text-slate-400">baar</span>
                </span>
                <span className="text-xs font-bold text-pink-400">
                  {getPercent(patternData.oneCutRepeatingCount).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${getPercent(patternData.oneCutRepeatingCount)}%` }}
                  className="bg-[#ec4899] h-full rounded-full transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMBO DETAILS EXPAND MODAL / BOTTOM SHEET */}
      {showComboModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141620] border border-amber-900/50 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-black text-[#D4AF37]">
                  {comboModalMode === 'normal' ? '8 Combos Breakdown' : 'One Cut 8 Combos Breakdown'}
                </h3>
                <span className="text-xs text-slate-400">
                  Individual occurrence count for each predefined combo
                </span>
              </div>
              <button
                onClick={() => setShowComboModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#202330]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {patternData.combos.map((cb) => {
                const count = comboModalMode === 'normal' ? cb.count : cb.oneCutCount;
                return (
                  <div key={cb.id} className="p-3 bg-[#181a26] rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-amber-300">
                        {cb.id}. {cb.name}
                      </span>
                      <span className="text-xs font-black text-emerald-400">
                        {count} baar
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2">
                      {cb.description}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Targets:</span>
                      {cb.predictedNumbers.map((n) => (
                        <span
                          key={n}
                          style={{ backgroundColor: getNumberColor(n) === 'red' ? '#E53935' : getNumberColor(n) === 'green' ? '#4CAF50' : '#212121' }}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/20"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowComboModal(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
