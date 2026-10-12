import React, { useMemo } from 'react';
import { SpinItem } from '../types';
import { calculatePredictions } from '../engine/prediction';
import { DozenColumnHint } from './DozenColumnHint';
import { CategoryPrediction } from './CategoryPrediction';
import { SuggestedNumbers } from './SuggestedNumbers';
import { RouletteTable } from './RouletteTable';

interface HomeTabProps {
  spins: SpinItem[];
  onSelectNumber: (num: number) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ spins, onSelectNumber }) => {
  const prediction = useMemo(() => {
    return calculatePredictions(spins);
  }, [spins]);

  return (
    <div className="space-y-3.5">
      {/* 1. DOZEN + COLUMN HINT */}
      <DozenColumnHint prediction={prediction} />

      {/* 2. CATEGORY PREDICTION */}
      <CategoryPrediction
        topCategories={prediction.topCategories}
        onSelectNumber={onSelectNumber}
      />

      {/* 3. SUGGESTED NUMBERS */}
      <SuggestedNumbers
        numbers={prediction.suggestedNumbers}
        onSelectNumber={onSelectNumber}
      />

      {/* 4. ROULETTE TABLE */}
      <RouletteTable onSelectNumber={onSelectNumber} />
    </div>
  );
};
