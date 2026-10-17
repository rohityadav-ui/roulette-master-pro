import React, { useMemo, useState, useEffect } from 'react';
import { SpinItem } from '../types';
import { calculatePredictions } from '../engine/prediction';
import { calculateDozenTarget } from '../engine/dozenTarget';
import { usePredictionTracking } from '../hooks/usePredictionTracking';
import { SevenSpinPrediction } from './SevenSpinPrediction';
import { ActiveTracking } from './ActiveTracking';
import { SessionStats } from './SessionStats';
import { HotNumbers } from './HotNumbers';
import { DozenColumnHint } from './DozenColumnHint';
import { CategoryPrediction } from './CategoryPrediction';
import { RouletteTable } from './RouletteTable';
import { Pin, Lock, Unlock, Eye, Sparkles } from 'lucide-react';

interface HomeTabProps {
  spins: SpinItem[];
  onSelectNumber: (num: number) => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  spins,
  onSelectNumber,
  isPinned: externalPinned,
  onTogglePin: externalTogglePin,
}) => {
  // Support both internal state and external control
  const [localPinned, setLocalPinned] = useState<boolean>(() => {
    return localStorage.getItem('roulette_layout_pinned') === 'true';
  });

  const isPinned = externalPinned !== undefined ? externalPinned : localPinned;

  const handleToggle = () => {
    if (externalTogglePin) {
      externalTogglePin();
    } else {
      setLocalPinned((prev) => {
        const next = !prev;
        localStorage.setItem('roulette_layout_pinned', String(next));
        return next;
      });
    }
  };

  const prediction = useMemo(() => {
    return calculatePredictions(spins);
  }, [spins]);

  const { currentPrediction, sessionStats, hotNumbers } = usePredictionTracking(spins);

  const dozenTarget = useMemo(() => {
    return (
      prediction.dozenTarget ||
      calculateDozenTarget(spins.map((s) => s.value))
    );
  }, [prediction.dozenTarget, spins]);

  const lastSpinValue = spins.length > 0 ? spins[0].value : null;

  return (
    <div className="space-y-4">
      {/* 📌 PIN / LOCK SYSTEM TOGGLE BAR */}
      <div className="sticky top-[160px] sm:top-[168px] z-20">
        {isPinned ? (
          <button
            type="button"
            onClick={handleToggle}
            className="w-full py-2.5 px-3.5 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-between bg-emerald-950/90 hover:bg-emerald-900/90 text-emerald-300 border-2 border-emerald-400 shadow-[0_0_22px_rgba(16,185,129,0.55)] ring-2 ring-emerald-400/40 animate-pulse transition-all active:scale-[0.98] cursor-pointer"
            title="Screen Locked: Dozen Target & Roulette Table are pinned together. Click to unpin."
          >
            <div className="flex items-center gap-2">
              <span className="text-base select-none">🔒</span>
              <span className="tracking-wide">Screen Locked</span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-bold">
                PINNED
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-200/90 font-medium">
              <span>Dozen Target & Table in View</span>
              <Unlock className="w-3.5 h-3.5 opacity-70" />
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            className="w-full py-2.5 px-3.5 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between bg-gray-900/90 hover:bg-gray-800/90 text-amber-300 border border-amber-500/40 shadow-lg shadow-black/50 transition-all active:scale-[0.98] cursor-pointer group backdrop-blur-md"
            title="Pin Layout: Keep Dozen Target and Roulette Table visible simultaneously without scrolling"
          >
            <div className="flex items-center gap-2">
              <span className="text-base select-none">📌</span>
              <span className="font-black tracking-wide text-white group-hover:text-amber-300">
                Pin Screen
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 group-hover:text-amber-200 font-medium">
              <span>Lock Dozen Target & Table in view</span>
              <span className="text-amber-400">→</span>
            </div>
          </button>
        )}
      </div>

      {/* RENDER LAYOUT BASED ON isPinned */}
      {isPinned ? (
        /* ═════════════════════════════════════════════════════════════════
           PINNED LAYOUT (DOZEN TARGET & ROULETTE TABLE VISIBLE TOGETHER)
           ═════════════════════════════════════════════════════════════════ */
        <div className="space-y-4">
          {/* DESKTOP / TABLET (md: and above) -> 2-Column Side-by-Side */}
          <div className="hidden md:grid md:grid-cols-12 md:gap-4 items-start">
            {/* LEFT COLUMN: Scrollable Predictions, Stats & Trends */}
            <div className="md:col-span-6 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1.5 no-scrollbar">
              <div className="flex items-center justify-between text-xs text-gray-400 px-1 py-0.5 border-b border-gray-800">
                <span className="font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Analysis & Tracking Feed</span>
                </span>
                <span className="text-[10px] text-gray-500">Scrolls independently</span>
              </div>

              {/* 1. 7-SPIN PREDICTION CARD */}
              <SevenSpinPrediction
                prediction={currentPrediction}
                onSelectNumber={onSelectNumber}
              />

              {/* 2. ACTIVE TRACKING CARD */}
              <ActiveTracking prediction={currentPrediction} />

              {/* 3. SESSION STATS CARD */}
              <SessionStats stats={sessionStats} />

              {/* 4. HOT NUMBERS CARD */}
              <HotNumbers
                hotNumbers={hotNumbers}
                onSelectNumber={onSelectNumber}
              />

              {/* 6. CATEGORY PREDICTION */}
              <CategoryPrediction
                topCategories={prediction.topCategories}
                onSelectNumber={onSelectNumber}
              />
            </div>

            {/* RIGHT COLUMN: PINNED STICKY DOZEN TARGET & ROULETTE TABLE */}
            <div className="md:col-span-6 sticky top-[215px] space-y-3 bg-gray-950/95 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-3 shadow-2xl">
              <div className="flex items-center justify-between text-xs px-1 text-emerald-400 font-black uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pinned Target & Table</span>
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Locked in View
                </span>
              </div>

              {/* 5. ONLY DOZEN TARGET */}
              <DozenColumnHint prediction={prediction} spins={spins} hideColumnHint={true} />

              {/* 7. ROULETTE TABLE (6-Column Grid, 0-36) */}
              <RouletteTable
                onSelectNumber={onSelectNumber}
                safeDozens={dozenTarget.safeDozens}
                dangerDozen={dozenTarget.dangerDozen}
                hotColumn={prediction.columnHint?.column}
                lastSpin={lastSpinValue}
              />
            </div>
          </div>

          {/* MOBILE (< md) -> Pinned split with scrollable feed above */}
          <div className="block md:hidden space-y-3">
            {/* Scrollable feed for other cards */}
            <div className="space-y-3 max-h-[28vh] overflow-y-auto no-scrollbar p-2 rounded-2xl bg-gray-950/90 border border-gray-800/80 shadow-inner">
              <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-md py-1 px-2.5 rounded-lg flex items-center justify-between text-[11px] border border-gray-800 mb-1.5">
                <span className="text-amber-400 font-black uppercase tracking-wider flex items-center gap-1">
                  <span>📊</span> Analysis & Tracking Feed
                </span>
                <span className="text-[10px] text-gray-400">Scroll for 7-Spin, Stats & Hot ↓</span>
              </div>

              {/* 1. 7-SPIN PREDICTION CARD */}
              <SevenSpinPrediction
                prediction={currentPrediction}
                onSelectNumber={onSelectNumber}
              />

              {/* 2. ACTIVE TRACKING CARD */}
              <ActiveTracking prediction={currentPrediction} />

              {/* 3. SESSION STATS CARD */}
              <SessionStats stats={sessionStats} />

              {/* 4. HOT NUMBERS CARD */}
              <HotNumbers
                hotNumbers={hotNumbers}
                onSelectNumber={onSelectNumber}
              />

              {/* 6. CATEGORY PREDICTION */}
              <CategoryPrediction
                topCategories={prediction.topCategories}
                onSelectNumber={onSelectNumber}
              />
            </div>

            {/* PINNED SECTION: DOZEN TARGET + ROULETTE TABLE WITH SOLID/BLURRED BACKGROUND */}
            <div className="space-y-2.5 sticky bottom-1 z-10 p-2.5 rounded-2xl bg-gray-950/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl shadow-black/80">
              <div className="flex items-center justify-between text-[11px] px-1 text-emerald-400 font-black uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Locked Target & Table</span>
                </span>
                <span className="text-[9px] text-emerald-300 font-bold bg-emerald-950/90 border border-emerald-500/50 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                  Always In View
                </span>
              </div>

              {/* 5. ONLY DOZEN TARGET */}
              <DozenColumnHint prediction={prediction} spins={spins} hideColumnHint={true} />

              {/* 7. ROULETTE TABLE (6-Column Grid, 0-36) */}
              <RouletteTable
                onSelectNumber={onSelectNumber}
                safeDozens={dozenTarget.safeDozens}
                dangerDozen={dozenTarget.dangerDozen}
                hotColumn={prediction.columnHint?.column}
                lastSpin={lastSpinValue}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════════
           NATURAL UNPINNED SCROLL LAYOUT (ALL CARDS IN NORMAL ORDER)
           ═════════════════════════════════════════════════════════════════ */
        <>
          {/* 1. 7-SPIN PREDICTION CARD */}
          <SevenSpinPrediction
            prediction={currentPrediction}
            onSelectNumber={onSelectNumber}
          />

          {/* 2. ACTIVE TRACKING CARD */}
          <ActiveTracking prediction={currentPrediction} />

          {/* 3. SESSION STATS CARD */}
          <SessionStats stats={sessionStats} />

          {/* 4. HOT NUMBERS CARD */}
          <HotNumbers
            hotNumbers={hotNumbers}
            onSelectNumber={onSelectNumber}
          />

          {/* 5. DOZEN & COLUMN HINT */}
          <DozenColumnHint prediction={prediction} spins={spins} />

          {/* 6. CATEGORY PREDICTION */}
          <CategoryPrediction
            topCategories={prediction.topCategories}
            onSelectNumber={onSelectNumber}
          />

          {/* 7. ROULETTE TABLE (6-Column Grid, 0-36) */}
          <RouletteTable
            onSelectNumber={onSelectNumber}
            safeDozens={dozenTarget.safeDozens}
            dangerDozen={dozenTarget.dangerDozen}
            hotColumn={prediction.columnHint?.column}
            lastSpin={lastSpinValue}
          />
        </>
      )}
    </div>
  );
};
