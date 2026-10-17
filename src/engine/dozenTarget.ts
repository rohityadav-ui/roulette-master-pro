export interface DozenTargetResult {
  safeDozens: number[]; // exactly 2 numbers e.g. [1, 2]
  dangerDozen: number;  // exactly 1 number e.g. 3
  reason: string;
}

export const DOZEN_NAMES: Record<number, string> = {
  1: '1st Dozen (1-12)',
  2: '2nd Dozen (13-24)',
  3: '3rd Dozen (25-36)',
};

export const DOZEN_SHORT_NAMES: Record<number, string> = {
  1: '1st Dozen',
  2: '2nd Dozen',
  3: '3rd Dozen',
};

export const DOZEN_RANGES: Record<number, string> = {
  1: '1 - 12',
  2: '13 - 24',
  3: '25 - 36',
};

export function getNumberDozen(num: number): 1 | 2 | 3 | 0 {
  if (num === 0) return 0;
  if (num >= 1 && num <= 12) return 1;
  if (num >= 13 && num <= 24) return 2;
  if (num >= 25 && num <= 36) return 3;
  return 0;
}

/**
 * Calculates the Dozen Target recommendation (2 Safe Dozens to BET, 1 Danger Dozen to AVOID).
 * Applies advanced rules in order:
 * 1. Zero Pivot (last is 0 -> 2nd Dozen safe, avoid outer)
 * 2. Triple Streak Jump (last 3 in same dozen -> jump to opposite outer, avoid middle)
 * 3. Double Streak Continuation (last 2 in same dozen -> 70% repeat chance + outer)
 * 4. Neighbor Clusters (3 of last 4 in same cluster/dozen)
 * 5. Default Frequency (last 15 numbers: Hot + Adjacent safe, Cold danger)
 */
export function calculateDozenTarget(history: number[]): DozenTargetResult {
  if (!history || history.length === 0) {
    return {
      safeDozens: [1, 2],
      dangerDozen: 3,
      reason: 'No spins logged yet. Baseline distribution suggests 1st & 2nd Dozens as initial targets.',
    };
  }

  const lastSpin = history[history.length - 1];

  // 1. ZERO PIVOT
  // If the last number is 0 (Zero), predict the next spin to be in the 2nd Dozen (13-24).
  // Mark 2nd Dozen as Safe, and 1st/3rd as Danger.
  if (lastSpin === 0) {
    // Check previous spins to see which outer dozen was colder
    const recent = history.slice(-15);
    const count1 = recent.filter((n) => getNumberDozen(n) === 1).length;
    const count3 = recent.filter((n) => getNumberDozen(n) === 3).length;

    // The colder outer dozen is Danger, the warmer outer dozen joins 2nd Dozen as Safe
    const dangerDozen = count3 <= count1 ? 3 : 1;
    const secondSafe = dangerDozen === 3 ? 1 : 3;

    return {
      safeDozens: [2, secondSafe],
      dangerDozen,
      reason: `Zero Pivot: Last number was 0 (Green). 2nd Dozen (13-24) is high probability pivot target. Avoid ${DOZEN_SHORT_NAMES[dangerDozen]}.`,
    };
  }

  // 2. TRIPLE STREAK JUMP
  // Check the Dozen of the last 3 spins.
  // If the same Dozen hit 3 times in a row, predict immediate jump to opposite outer Dozen.
  // The middle Dozen (2nd) becomes Danger to avoid (or if 2nd hit 3 times, avoid 2nd).
  if (history.length >= 3) {
    const last3 = history.slice(-3);
    const d1 = getNumberDozen(last3[0]);
    const d2 = getNumberDozen(last3[1]);
    const d3 = getNumberDozen(last3[2]);

    if (d1 !== 0 && d1 === d2 && d2 === d3) {
      if (d3 === 3) {
        return {
          safeDozens: [1, 3],
          dangerDozen: 2,
          reason: `3rd Dozen hit 3 times in a row (${last3.join(', ')}). High chance of jumping to 1st Dozen. Avoid middle Dozen (2nd).`,
        };
      } else if (d3 === 1) {
        return {
          safeDozens: [3, 1],
          dangerDozen: 2,
          reason: `1st Dozen hit 3 times in a row (${last3.join(', ')}). High chance of jumping to 3rd Dozen. Avoid middle Dozen (2nd).`,
        };
      } else if (d3 === 2) {
        return {
          safeDozens: [1, 3],
          dangerDozen: 2,
          reason: `2nd Dozen hit 3 times in a row (${last3.join(', ')}). High chance of jumping to outer Dozens (1st & 3rd). Avoid 2nd Dozen.`,
        };
      }
    }
  }

  // 3. DOUBLE STREAK CONTINUATION
  // If a Dozen hits 2 times in a row, 70% chance it will hit a 3rd time.
  // Predict the same Dozen + one outer Dozen as Safe.
  if (history.length >= 2) {
    const last2 = history.slice(-2);
    const d1 = getNumberDozen(last2[0]);
    const d2 = getNumberDozen(last2[1]);

    if (d1 !== 0 && d1 === d2) {
      if (d2 === 3) {
        return {
          safeDozens: [3, 1],
          dangerDozen: 2,
          reason: `3rd Dozen is on a 2-spin streak (${last2.join(', ')}). 70% chance of 3rd repeat or jump to 1st Dozen. Avoid 2nd Dozen.`,
        };
      } else if (d2 === 1) {
        return {
          safeDozens: [1, 3],
          dangerDozen: 2,
          reason: `1st Dozen is on a 2-spin streak (${last2.join(', ')}). 70% chance of 3rd repeat or jump to 3rd Dozen. Avoid 2nd Dozen.`,
        };
      } else if (d2 === 2) {
        // 2nd Dozen streak -> Safe: [2, 1] or [2, 3] depending on last 15 spins
        const recent = history.slice(-15);
        const count1 = recent.filter((n) => getNumberDozen(n) === 1).length;
        const count3 = recent.filter((n) => getNumberDozen(n) === 3).length;
        const outerSafe = count1 >= count3 ? 1 : 3;
        const outerDanger = outerSafe === 1 ? 3 : 1;

        return {
          safeDozens: [2, outerSafe],
          dangerDozen: outerDanger,
          reason: `2nd Dozen is on a 2-spin streak (${last2.join(', ')}). 70% continuation chance supported by ${DOZEN_SHORT_NAMES[outerSafe]}. Avoid ${DOZEN_SHORT_NAMES[outerDanger]}.`,
        };
      }
    }
  }

  // 4. NEIGHBOR CLUSTERS
  // Check if the last 3-4 numbers are all in the same block (e.g., 33, 35, 36 in 3rd Dozen; 1, 2, 3 in 1st Dozen).
  if (history.length >= 3) {
    const sample = history.slice(-4);
    const nonZeroSample = sample.filter((n) => n > 0);

    const dozenBuckets: Record<1 | 2 | 3, number[]> = { 1: [], 2: [], 3: [] };
    nonZeroSample.forEach((n) => {
      const d = getNumberDozen(n);
      if (d >= 1 && d <= 3) dozenBuckets[d as 1 | 2 | 3].push(n);
    });

    // Check if any dozen has >= 3 hits in the last 3-4 spins
    for (const d of [3, 1, 2] as const) {
      if (dozenBuckets[d].length >= 3) {
        const clusterNums = dozenBuckets[d];
        if (d === 3) {
          return {
            safeDozens: [3, 1],
            dangerDozen: 2,
            reason: `Neighbor cluster detected in 3rd Dozen (${clusterNums.join(', ')}). High cluster momentum keeps 3rd Dozen safe. Avoid middle (2nd).`,
          };
        } else if (d === 1) {
          return {
            safeDozens: [1, 3],
            dangerDozen: 2,
            reason: `Neighbor cluster detected in 1st Dozen (${clusterNums.join(', ')}). Low numbers cluster keeps 1st Dozen safe. Avoid middle (2nd).`,
          };
        } else if (d === 2) {
          return {
            safeDozens: [2, 1],
            dangerDozen: 3,
            reason: `Neighbor cluster detected in 2nd Dozen (${clusterNums.join(', ')}). Mid-range cluster keeps 2nd Dozen safe. Avoid 3rd Dozen.`,
          };
        }
      }
    }
  }

  // 5. DEFAULT (If no pattern):
  // Use the last 15 numbers to find the "Hot" Dozen and the "Cold" Dozen.
  // Bet on the Hot Dozen and one adjacent Dozen. Avoid the Cold Dozen.
  const last15 = history.slice(-15);
  const counts: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  last15.forEach((num) => {
    const d = getNumberDozen(num);
    if (d >= 1 && d <= 3) counts[d as 1 | 2 | 3]++;
  });

  const sortedDozens = ([1, 2, 3] as const).slice().sort((a, b) => counts[b] - counts[a]);
  const hotDozen = sortedDozens[0];
  const coldDozen = sortedDozens[2];

  // Pick adjacent dozen to hot dozen for the 2nd safe bet
  let adjacentDozen: 1 | 2 | 3;
  if (hotDozen === 1) {
    adjacentDozen = 2;
  } else if (hotDozen === 3) {
    adjacentDozen = 2;
  } else {
    // Hot is 2 -> pick the non-cold outer dozen
    adjacentDozen = sortedDozens[1];
  }

  // Ensure safeDozens has hot and adjacent, danger is cold
  const safeDozens: number[] = [hotDozen, adjacentDozen === hotDozen ? sortedDozens[1] : adjacentDozen];
  const dangerDozen: number = coldDozen;

  return {
    safeDozens,
    dangerDozen,
    reason: `Recent 15-spin frequency: ${DOZEN_SHORT_NAMES[hotDozen]} is Hot (${counts[hotDozen]} hits). ${DOZEN_SHORT_NAMES[coldDozen]} is Cold (${counts[coldDozen]} hits) - Avoid.`,
  };
}
