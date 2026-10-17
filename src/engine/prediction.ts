import { CategoryPredictionItem, PredictionResult, RouletteCategory, SpinItem } from '../types';
import { CATEGORY_NUMBERS, getCategory, getColumn, getDozen } from './categories';
import { COMBO_DEFINITIONS } from './patterns';
import { calculateDozenTarget } from './dozenTarget';

export function calculatePredictions(spins: SpinItem[]): PredictionResult {
  const lastSpin = spins.length > 0 ? spins[spins.length - 1] : null;

  // Base uniform category probabilities
  const catScores: Record<RouletteCategory, number> = {
    1: 20,
    2: 20,
    3: 20,
    4: 20,
    5: 20,
  };

  const dozenSleep: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  const colSleep: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  const dozenHits: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  const colHits: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };

  // Track dormant spins for dozens and columns
  for (const s of spins) {
    if (s.dozen >= 1 && s.dozen <= 3) dozenHits[s.dozen as 1 | 2 | 3]++;
    if (s.column >= 1 && s.column <= 3) colHits[s.column as 1 | 2 | 3]++;
  }

  // Calculate sleep
  for (const d of [1, 2, 3] as const) {
    let sleepCount = 0;
    for (let i = spins.length - 1; i >= 0; i--) {
      if (spins[i].dozen === d) break;
      sleepCount++;
    }
    dozenSleep[d] = sleepCount;
  }

  for (const c of [1, 2, 3] as const) {
    let sleepCount = 0;
    for (let i = spins.length - 1; i >= 0; i--) {
      if (spins[i].column === c) break;
      sleepCount++;
    }
    colSleep[c] = sleepCount;
  }

  // 1. Markov chain from historical category transitions
  if (spins.length >= 2 && lastSpin) {
    const currentCat = lastSpin.category;
    const transitionCounts: Record<RouletteCategory, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalTransitionsFromCurrent = 0;

    for (let i = 0; i < spins.length - 1; i++) {
      if (spins[i].category === currentCat) {
        const nextCat = spins[i + 1].category;
        transitionCounts[nextCat]++;
        totalTransitionsFromCurrent++;
      }
    }

    if (totalTransitionsFromCurrent > 0) {
      for (let c = 1; c <= 5; c++) {
        const p = transitionCounts[c as RouletteCategory] / totalTransitionsFromCurrent;
        catScores[c as RouletteCategory] += p * 35;
      }
    }
  }

  // 2. Pattern count weights
  if (lastSpin) {
    const currCat = lastSpin.category;

    // Sequential category bias (next right +1, left -1)
    const nextRight = currCat === 5 ? 1 : ((currCat + 1) as RouletteCategory);
    const nextLeft = currCat === 1 ? 5 : ((currCat - 1) as RouletteCategory);
    catScores[nextRight] += 15;
    catScores[nextLeft] += 12;

    // Combo activation boost
    COMBO_DEFINITIONS.forEach((cd) => {
      const mockTest = cd.check(lastSpin.value, cd.targets[0]);
      if (mockTest) {
        cd.targets.forEach((targetNum) => {
          const targetCat = getCategory(targetNum);
          catScores[targetCat] += 3;
        });
      }
    });
  }

  // Normalize category scores to percentages
  const totalScore = Object.values(catScores).reduce((a, b) => a + b, 0) || 100;
  const sortedCategories: CategoryPredictionItem[] = ([1, 2, 3, 4, 5] as RouletteCategory[])
    .map((cat) => {
      const percentage = Math.round((catScores[cat] / totalScore) * 100);
      return {
        category: cat,
        percentage,
        weight: catScores[cat],
        numbers: CATEGORY_NUMBERS[cat],
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // Pick top 3 categories
  const topCategories = sortedCategories.slice(0, 3);

  // 3. Dozen + Column hints
  const dozenList: (1 | 2 | 3)[] = [1, 2, 3];
  dozenList.sort((a, b) => {
    const scoreA = dozenHits[a] * 0.4 + dozenSleep[a] * 3.5;
    const scoreB = dozenHits[b] * 0.4 + dozenSleep[b] * 3.5;
    return scoreB - scoreA;
  });
  const bestDozen: 1 | 2 | 3 = dozenList[0] || 1;
  const dozenProb = Math.min(85, Math.max(34, 38 + dozenSleep[bestDozen] * 6));

  const colList: (1 | 2 | 3)[] = [1, 2, 3];
  colList.sort((a, b) => {
    const scoreA = colHits[a] * 0.4 + colSleep[a] * 3.5;
    const scoreB = colHits[b] * 0.4 + colSleep[b] * 3.5;
    return scoreB - scoreA;
  });
  const bestCol: 1 | 2 | 3 = colList[0] || 1;
  const colProb = Math.min(85, Math.max(34, 38 + colSleep[bestCol] * 6));

  const dozenNames: Record<1 | 2 | 3, string> = {
    1: '1st Dozen (1-12)',
    2: '2nd Dozen (13-24)',
    3: '3rd Dozen (25-36)',
  };
  const colNames: Record<1 | 2 | 3, string> = {
    1: '1st Column (1,4,7...)',
    2: '2nd Column (2,5,8...)',
    3: '3rd Column (3,6,9...)',
  };

  // 4. Suggested Numbers (3-5 chips)
  const candidatePool: { num: number; score: number }[] = [];
  const topCatNumbers = new Set([
    ...CATEGORY_NUMBERS[topCategories[0].category],
    ...CATEGORY_NUMBERS[topCategories[1]?.category || 1],
  ]);

  topCatNumbers.forEach((num) => {
    let score = 10;
    if (getDozen(num) === bestDozen) score += 15;
    if (getColumn(num) === bestCol) score += 12;

    if (lastSpin) {
      COMBO_DEFINITIONS.forEach((cd) => {
        if (cd.check(lastSpin.value, num)) score += 20;
      });
    }

    candidatePool.push({ num, score });
  });

  candidatePool.sort((a, b) => b.score - a.score);
  const suggestedNumbers = candidatePool
    .slice(0, 4)
    .map((c) => c.num);

  if (suggestedNumbers.length === 0) {
    suggestedNumbers.push(26, 17, 11, 20);
  }

  const dozenTarget = calculateDozenTarget(spins.map((s) => s.value));

  return {
    dozenTarget,
    dozenHint: {
      dozen: bestDozen,
      title: dozenNames[bestDozen],
      description:
        dozenSleep[bestDozen] >= 4
          ? `High Recovery: Has not hit in ${dozenSleep[bestDozen]} spins`
          : `Optimal Cluster: High probability sector`,
      probability: dozenProb,
    },
    columnHint: {
      column: bestCol,
      title: colNames[bestCol],
      description:
        colSleep[bestCol] >= 4
          ? `Sleeper Alert: Due for statistical return (${colSleep[bestCol]} spins gap)`
          : `Momentum: Favorable category intersection`,
      probability: colProb,
    },
    topCategories,
    suggestedNumbers,
  };
}
