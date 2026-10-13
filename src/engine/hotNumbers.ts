import { HotNumberItem, HotNumbersAnalysis, SpinItem } from '../types';

export function analyzeHotNumbers(spins: SpinItem[]): HotNumbersAnalysis {
  const windowSlice = spins.slice(-60);
  const totalEvaluated = windowSlice.length;

  const hitsMap = new Map<number, number>();
  const lastIndexMap = new Map<number, number>();

  for (let i = 0; i <= 36; i++) {
    hitsMap.set(i, 0);
    lastIndexMap.set(i, -1);
  }

  windowSlice.forEach((spin, idx) => {
    hitsMap.set(spin.value, (hitsMap.get(spin.value) || 0) + 1);
    lastIndexMap.set(spin.value, idx);
  });

  const allItems: HotNumberItem[] = [];

  for (let num = 0; num <= 36; num++) {
    const hits = hitsMap.get(num) || 0;
    const lastIdx = lastIndexMap.get(num) ?? -1;
    const spinsAgo = lastIdx >= 0 ? totalEvaluated - 1 - lastIdx : totalEvaluated;
    const percentage = totalEvaluated > 0 ? (hits / totalEvaluated) * 100 : 0;

    // Thresholds:
    // With 60 spins, expected frequency per number is 60/37 ~ 1.62.
    // Super Hot: hits >= 4 (or top hits if lower sample)
    // Warm: hits 2 to 3
    // Cold: hits <= 1
    let tier: HotNumberItem['tier'] = 'cold';
    if (totalEvaluated >= 10) {
      if (hits >= 4) {
        tier = 'super-hot';
      } else if (hits >= 2) {
        tier = 'warm';
      } else {
        tier = 'cold';
      }
    } else {
      // Small sample fallback
      if (hits >= 2) tier = 'super-hot';
      else if (hits === 1) tier = 'warm';
      else tier = 'cold';
    }

    allItems.push({
      number: num,
      hits,
      tier,
      percentage: Number(percentage.toFixed(1)),
      spinsAgo,
    });
  }

  // Sort within each tier by hit count descending, then by recency (least spinsAgo)
  const superHot = allItems
    .filter((item) => item.tier === 'super-hot')
    .sort((a, b) => b.hits - a.hits || a.spinsAgo - b.spinsAgo);

  const warm = allItems
    .filter((item) => item.tier === 'warm')
    .sort((a, b) => b.hits - a.hits || a.spinsAgo - b.spinsAgo);

  const cold = allItems
    .filter((item) => item.tier === 'cold')
    .sort((a, b) => b.spinsAgo - a.spinsAgo || a.hits - b.hits);

  return {
    superHot,
    warm,
    cold,
    totalEvaluated,
  };
}
