import React, { useMemo } from 'react';
import { SpinItem } from '../types';
import { calculatePredictions } from '../engine/prediction';
import { usePredictionTracking } from '../hooks/usePredictionTracking';
import { SevenSpinPrediction } from './SevenSpinPrediction';
import { ActiveTracking } from './ActiveTracking';
import { SessionStats } from './SessionStats';
import { HotNumbers } from './HotNumbers';
import { DozenColumnHint } from './DozenColumnHint';
import { CategoryPrediction } from './CategoryPrediction';
import { RouletteTable } from './RouletteTable';

interface HomeTabProps {
  spins: SpinItem[];
  onSelectNumber: (num: number) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ spins, onSelectNumber }) => {
  const prediction = useMemo(() => {
    return calculatePredictions(spins);
  }, [spins]);

  const { currentPrediction, sessionStats, hotNumbers } = usePredictionTracking(spins);

  return (
    <div className="space-y-4">
      {/* 1. 7-SPIN PREDICTION CARD (8-10 Numbers across 3 Confidence Tiers) */}
      <SevenSpinPrediction
        prediction={currentPrediction}
        onSelectNumber={onSelectNumber}
      />

      {/* 2. ACTIVE TRACKING CARD (Timeline with Direct, Nearby ±1/±2, and Miss rows) */}
      <ActiveTracking prediction={currentPrediction} />

      {/* 3. SESSION STATS CARD (3-Column Layout + Accuracy Circle Chart) */}
      <SessionStats stats={sessionStats} />

      {/* 4. HOT NUMBERS CARD (Last 60 Spins with Super Hot, Warm, and Cold Tiers) */}
      <HotNumbers
        hotNumbers={hotNumbers}
        onSelectNumber={onSelectNumber}
      />

      {/* 5. DOZEN & COLUMN HINT */}
      <DozenColumnHint prediction={prediction} />

      {/* 6. CATEGORY PREDICTION (Top 3 with %) */}
      <CategoryPrediction
        topCategories={prediction.topCategories}
        onSelectNumber={onSelectNumber}
      />

      {/* 7. ROULETTE TABLE (0-36, 6 Columns) */}
      <RouletteTable onSelectNumber={onSelectNumber} />
    </div>
  );
};
