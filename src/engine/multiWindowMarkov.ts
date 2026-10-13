import { RouletteCategory, SpinItem } from '../types';
import { CATEGORY_NUMBERS, getCategory } from './categories';

export interface MarkovWindowWeights {
  w15: number;
  w30: number;
  w60: number;
}

export const DEFAULT_WEIGHTS: MarkovWindowWeights = {
  w15: 0.5,
  w30: 0.3,
  w60: 0.2,
};

export interface MultiWindowMarkovResult {
  categoryProbabilities: Record<RouletteCategory, number>; // in %
  rankedNumbers: { number: number; score: number; category: RouletteCategory }[];
  currentCategory: RouletteCategory | null;
}

/**
 * Calculates transition matrix P(Cat_next | Cat_current) for a slice of spins
 */
function calculateTransitionMatrix(
  spinsSlice: SpinItem[]
): Record<RouletteCategory, Record<RouletteCategory, number>> {
  const matrix: Record<RouletteCategory, Record<RouletteCategory, number>> = {
    1: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    2: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    3: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    4: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    5: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  const fromCounts: Record<RouletteCategory, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (let i = 0; i < spinsSlice.length - 1; i++) {
    const fromCat = spinsSlice[i].category;
    const toCat = spinsSlice[i + 1].category;
    matrix[fromCat][toCat]++;
    fromCounts[fromCat]++;
  }

  // Normalize rows
  for (let c = 1; c <= 5; c++) {
    const cat = c as RouletteCategory;
    const total = fromCounts[cat];
    for (let target = 1; target <= 5; target++) {
      const tCat = target as RouletteCategory;
      if (total > 0) {
        matrix[cat][tCat] = matrix[cat][tCat] / total;
      } else {
        // Laplace smoothing / uniform prior if no transitions observed
        matrix[cat][tCat] = 0.2;
      }
    }
  }

  return matrix;
}

export function computeMultiWindowMarkov(
  spins: SpinItem[],
  weights: MarkovWindowWeights = DEFAULT_WEIGHTS
): MultiWindowMarkovResult {
  const total = spins.length;
  const lastSpin = total > 0 ? spins[total - 1] : null;
  const currentCategory = lastSpin ? lastSpin.category : null;

  // Window slices
  const slice15 = spins.slice(-15);
  const slice30 = spins.slice(-30);
  const slice60 = spins.slice(-60);

  const mat15 = calculateTransitionMatrix(slice15);
  const mat30 = calculateTransitionMatrix(slice30);
  const mat60 = calculateTransitionMatrix(slice60);

  // Compute blended transition probabilities from current category
  const blendedProbs: Record<RouletteCategory, number> = { 1: 20, 2: 20, 3: 20, 4: 20, 5: 20 };

  if (currentCategory) {
    let sum = 0;
    for (let c = 1; c <= 5; c++) {
      const cat = c as RouletteCategory;
      const p15 = mat15[currentCategory][cat];
      const p30 = mat30[currentCategory][cat];
      const p60 = mat60[currentCategory][cat];

      const blended = p15 * weights.w15 + p30 * weights.w30 + p60 * weights.w60;
      blendedProbs[cat] = blended;
      sum += blended;
    }

    if (sum > 0) {
      for (let c = 1; c <= 5; c++) {
        const cat = c as RouletteCategory;
        blendedProbs[cat] = Math.round((blendedProbs[cat] / sum) * 100);
      }
    }
  }

  // Score all 37 numbers (0 - 36)
  const numberScores: { number: number; score: number; category: RouletteCategory }[] = [];

  // Recent frequency counts over last 60 spins
  const last60Nums = slice60.map((s) => s.value);
  const freqMap = new Map<number, number>();
  for (const n of last60Nums) {
    freqMap.set(n, (freqMap.get(n) || 0) + 1);
  }

  for (let num = 0; num <= 36; num++) {
    const cat = getCategory(num);
    const catProbability = blendedProbs[cat] || 20;

    // Weight elements:
    // 1. Markov category probability (0-100)
    // 2. Local frequency (momentum)
    // 3. Recency decay
    const freq = freqMap.get(num) || 0;
    let spinsSinceLast = total;
    for (let i = total - 1; i >= 0; i--) {
      if (spins[i].value === num) {
        spinsSinceLast = total - 1 - i;
        break;
      }
    }

    // Numbers that appeared recently get a momentum bonus, but extreme sleepers get regression return
    let recencyWeight = 1.0;
    if (spinsSinceLast <= 7) recencyWeight = 1.25; // Hot streak
    else if (spinsSinceLast >= 25) recencyWeight = 1.15; // Sleeper return

    const score = (catProbability * 1.5 + freq * 8) * recencyWeight;

    numberScores.push({
      number: num,
      score,
      category: cat,
    });
  }

  numberScores.sort((a, b) => b.score - a.score);

  return {
    categoryProbabilities: blendedProbs,
    rankedNumbers: numberScores,
    currentCategory,
  };
}
