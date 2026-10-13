import { useMemo } from 'react';
import {
  HitStatus,
  HotNumbersAnalysis,
  SessionAccuracyStats,
  SevenSpinPredictionData,
  SpinItem,
  TrackingSpinRow,
} from '../types';
import { computeMultiWindowMarkov } from '../engine/multiWindowMarkov';
import { analyzeHotNumbers } from '../engine/hotNumbers';
import { evaluateNearbyHit } from '../engine/nearbyHit';
import { CATEGORY_NUMBERS } from '../engine/categories';

export interface UsePredictionTrackingResult {
  currentPrediction: SevenSpinPredictionData;
  sessionStats: SessionAccuracyStats;
  hotNumbers: HotNumbersAnalysis;
}

/**
 * Generates 8-10 suggested numbers divided into 3 tiers based on
 * Multi-Window Markov (15/30/60) + Hot Numbers + activated combos
 */
function generateTieredPrediction(
  spinsSlice: SpinItem[]
): {
  tier1High: number[];
  tier2Medium: number[];
  tier3Value: number[];
  allSuggested: number[];
} {
  const markov = computeMultiWindowMarkov(spinsSlice);
  const hot = analyzeHotNumbers(spinsSlice);

  const selectedSet = new Set<number>();
  const tier1High: number[] = [];
  const tier2Medium: number[] = [];
  const tier3Value: number[] = [];

  // Super hot numbers get high priority
  const superHotNums = hot.superHot.map((h) => h.number);
  const warmNums = hot.warm.map((w) => w.number);

  // 1. Tier 1: High Confidence (3 to 4 numbers)
  // Combines top Markov ranked numbers that are also Super Hot or Warm
  for (const item of markov.rankedNumbers) {
    if (tier1High.length >= 4) break;
    if (superHotNums.includes(item.number) || warmNums.includes(item.number)) {
      if (!selectedSet.has(item.number)) {
        selectedSet.add(item.number);
        tier1High.push(item.number);
      }
    }
  }

  // If tier 1 has fewer than 3, fill from top Markov
  for (const item of markov.rankedNumbers) {
    if (tier1High.length >= 3) break;
    if (!selectedSet.has(item.number)) {
      selectedSet.add(item.number);
      tier1High.push(item.number);
    }
  }

  // 2. Tier 2: Medium Confidence (3 to 4 numbers)
  for (const item of markov.rankedNumbers) {
    if (tier2Medium.length >= 3) break;
    if (!selectedSet.has(item.number)) {
      selectedSet.add(item.number);
      tier2Medium.push(item.number);
    }
  }

  // 3. Tier 3: Value / Sleeper Confidence (2 to 3 numbers)
  // Pull from top cold/sleeping numbers in high-probability Markov categories
  const topCategories = Object.entries(markov.categoryProbabilities)
    .sort(([, a], [, b]) => b - a)
    .map(([cat]) => Number(cat) as 1 | 2 | 3 | 4 | 5);

  const coldInTopCat = hot.cold
    .map((c) => c.number)
    .filter((num) => topCategories.slice(0, 2).includes(CATEGORY_NUMBERS[1].includes(num) ? 1 : 2));

  for (const num of coldInTopCat) {
    if (tier3Value.length >= 2) break;
    if (!selectedSet.has(num)) {
      selectedSet.add(num);
      tier3Value.push(num);
    }
  }

  // Fill tier 3 if needed
  for (const item of markov.rankedNumbers) {
    if (tier3Value.length >= 2) break;
    if (!selectedSet.has(item.number)) {
      selectedSet.add(item.number);
      tier3Value.push(item.number);
    }
  }

  // Fallback defaults if history is empty
  if (selectedSet.size < 8) {
    const defaults = [26, 0, 32, 15, 19, 4, 21, 2, 25];
    for (const d of defaults) {
      if (selectedSet.size >= 9) break;
      if (!selectedSet.has(d)) {
        selectedSet.add(d);
        if (tier1High.length < 3) tier1High.push(d);
        else if (tier2Medium.length < 3) tier2Medium.push(d);
        else tier3Value.push(d);
      }
    }
  }

  const allSuggested = [...tier1High, ...tier2Medium, ...tier3Value];

  return {
    tier1High,
    tier2Medium,
    tier3Value,
    allSuggested,
  };
}

export function usePredictionTracking(spins: SpinItem[]): UsePredictionTrackingResult {
  return useMemo(() => {
    const totalSpins = spins.length;
    const WINDOW_SIZE = 7;

    // Hot numbers evaluated over last 60 spins
    const hotNumbers = analyzeHotNumbers(spins);

    // Number of completed full 7-spin windows
    const totalWindowsCompleted = Math.floor(totalSpins / WINDOW_SIZE);
    const activeWindowIndex = Math.floor(totalSpins / WINDOW_SIZE);
    const windowStartIdx = activeWindowIndex * WINDOW_SIZE;
    const spinsInCurrentWindow = spins.slice(windowStartIdx);

    // 1. Prediction for the current active window (based on spins up to windowStartIdx)
    const baseSliceForActiveWindow = spins.slice(0, Math.max(0, windowStartIdx));
    const activePrediction = generateTieredPrediction(
      baseSliceForActiveWindow.length > 0 ? baseSliceForActiveWindow : spins
    );

    // Evaluate each spin that has landed in the active window
    const activeRows: TrackingSpinRow[] = [];
    spinsInCurrentWindow.forEach((spin, idx) => {
      const evaluation = evaluateNearbyHit(spin.value, activePrediction.allSuggested);
      activeRows.push({
        spinIndex: idx + 1,
        value: spin.value,
        status: evaluation.status,
        distance: evaluation.distance,
        closestTarget: evaluation.closestTarget,
        timestamp: spin.timestamp,
      });
    });

    const currentPrediction: SevenSpinPredictionData = {
      windowId: activeWindowIndex + 1,
      spinInWindow: spinsInCurrentWindow.length,
      totalWindowSpins: WINDOW_SIZE,
      tier1High: activePrediction.tier1High,
      tier2Medium: activePrediction.tier2Medium,
      tier3Value: activePrediction.tier3Value,
      allSuggested: activePrediction.allSuggested,
      activeRows,
    };

    // 2. Compute historical session stats across all completed windows and active window
    let directHits = 0;
    let nearbyHits = 0;
    let misses = 0;

    let bestWindow: SessionAccuracyStats['bestWindow'] = null;
    let maxHitsInWindow = -1;

    // Evaluate each window
    for (let w = 0; w <= activeWindowIndex; w++) {
      const wStart = w * WINDOW_SIZE;
      const wEnd = Math.min(totalSpins, wStart + WINDOW_SIZE);
      const wSlice = spins.slice(wStart, wEnd);

      if (wSlice.length === 0) continue;

      const baseSlice = spins.slice(0, wStart);
      const wPred = generateTieredPrediction(baseSlice.length > 0 ? baseSlice : spins);

      let wDirect = 0;
      let wNearby = 0;

      wSlice.forEach((spin) => {
        const ev = evaluateNearbyHit(spin.value, wPred.allSuggested);
        if (ev.status === 'direct') {
          directHits++;
          wDirect++;
        } else if (ev.status === 'nearby') {
          nearbyHits++;
          wNearby++;
        } else {
          misses++;
        }
      });

      const combinedScore = wDirect * 1.5 + wNearby;
      if (combinedScore > maxHitsInWindow) {
        maxHitsInWindow = combinedScore;
        bestWindow = {
          windowId: w + 1,
          directCount: wDirect,
          nearbyCount: wNearby,
          total: wSlice.length,
        };
      }
    }

    const totalEvaluated = directHits + nearbyHits + misses;
    const directAccuracy = totalEvaluated > 0 ? Math.round((directHits / totalEvaluated) * 100) : 0;
    const combinedAccuracy =
      totalEvaluated > 0 ? Math.round(((directHits + nearbyHits) / totalEvaluated) * 100) : 0;

    const sessionStats: SessionAccuracyStats = {
      totalWindowsCompleted,
      totalTrackedSpins: totalEvaluated,
      directHits,
      nearbyHits,
      misses,
      directAccuracy,
      combinedAccuracy,
      bestWindow,
    };

    return {
      currentPrediction,
      sessionStats,
      hotNumbers,
    };
  }, [spins]);
}
