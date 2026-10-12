import { ComboItem, PatternCounts, SpinItem, TripalItem } from '../types';
import { CATEGORY_NUMBERS, getCategory } from './categories';

export const COMBO_DEFINITIONS = [
  {
    id: 1,
    name: '2-21 Combo',
    desc: 'Cat 2 → 21 RF (12, 17, 21, 26)',
    targets: [12, 17, 21, 26],
    check: (n1: number, n2: number) =>
      getCategory(n1) === 2 && [12, 17, 21, 26].includes(n2),
  },
  {
    id: 2,
    name: '2-22 Combo',
    desc: 'Cat 2 → 22 RF (22, 27)',
    targets: [22, 27],
    check: (n1: number, n2: number) =>
      getCategory(n1) === 2 && [22, 27].includes(n2),
  },
  {
    id: 3,
    name: '7-17 Combo',
    desc: 'Cat 2 → 17 RF (12, 17, 21, 26)',
    targets: [12, 17, 21, 26],
    check: (n1: number, n2: number) =>
      getCategory(n1) === 2 && [12, 17, 21, 26].includes(n2),
  },
  {
    id: 4,
    name: '9-11 Combo',
    desc: 'Cat 4 → 11 RF (11, 16, 29, 24)',
    targets: [11, 16, 29, 24],
    check: (n1: number, n2: number) =>
      getCategory(n1) === 4 && [11, 16, 29, 24].includes(n2),
  },
  {
    id: 5,
    name: '34-12 Combo',
    desc: '34 RF (34, 43) → 12 RF (12, 17, 21, 26)',
    targets: [12, 17, 21, 26],
    check: (n1: number, n2: number) =>
      [34, 43].includes(n1) && [12, 17, 21, 26].includes(n2),
  },
  {
    id: 6,
    name: '31-17 Combo',
    desc: '31 RF (13, 18, 31, 36) → 17 RF (12, 17, 21, 26)',
    targets: [12, 17, 21, 26],
    check: (n1: number, n2: number) =>
      [13, 18, 31, 36].includes(n1) && [12, 17, 21, 26].includes(n2),
  },
  {
    id: 7,
    name: '6-8 Combo',
    desc: 'Cat 1 → Cat 3 (3, 8, 12, 17, 21, 26, 30, 35)',
    targets: CATEGORY_NUMBERS[3],
    check: (n1: number, n2: number) =>
      getCategory(n1) === 1 && getCategory(n2) === 3,
  },
  {
    id: 8,
    name: '5-8 Combo',
    desc: 'Cat 5 → Cat 3 (3, 8, 12, 17, 21, 26, 30, 35)',
    targets: CATEGORY_NUMBERS[3],
    check: (n1: number, n2: number) =>
      getCategory(n1) === 5 && getCategory(n2) === 3,
  },
];

export const TRIPAL_DEFINITIONS = [
  {
    id: 1,
    name: 'Ascending Triplet',
    desc: '3 spins in direct ascending order (e.g. Cat 1 → 2 → 3)',
    numbers: [1, 2, 3],
    check: (c1: number, c2: number, c3: number) =>
      (c2 - c1 === 1 || (c1 === 5 && c2 === 1)) &&
      (c3 - c2 === 1 || (c2 === 5 && c3 === 1)),
  },
  {
    id: 2,
    name: 'Descending Triplet',
    desc: '3 spins in direct descending order (e.g. Cat 3 → 2 → 1)',
    numbers: [3, 2, 1],
    check: (c1: number, c2: number, c3: number) =>
      (c1 - c2 === 1 || (c1 === 1 && c2 === 5)) &&
      (c2 - c3 === 1 || (c2 === 1 && c3 === 5)),
  },
  {
    id: 3,
    name: 'Triple Repeat',
    desc: '3 consecutive spins landing in the exact same category',
    numbers: [1, 1, 1],
    check: (c1: number, c2: number, c3: number) => c1 === c2 && c2 === c3,
  },
  {
    id: 4,
    name: 'Ping-Pong Triplet',
    desc: 'Oscillation pattern between 2 categories (e.g. Cat 2 → 4 → 2)',
    numbers: [2, 4, 2],
    check: (c1: number, c2: number, c3: number) => c1 === c3 && c1 !== c2,
  },
];

export function isCategoryConsecutive(cat1: number, cat2: number): boolean {
  const diff = Math.abs(cat1 - cat2);
  return diff === 1 || diff === 4;
}

export function analyzePatterns(spins: SpinItem[]): PatternCounts {
  const nums = spins.map((s) => s.value);
  const n = nums.length;

  let sequence = 0;
  let oneCutSequence = 0;
  let combo = 0;
  let oneCutCombo = 0;
  let repeating = 0;
  let oneCutRepeating = 0;

  const comboCounts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };
  const oneCutComboCounts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };
  const tripalCounts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };

  // Adjacent checks (i and i + 1)
  for (let i = 0; i < n - 1; i++) {
    const n1 = nums[i];
    const n2 = nums[i + 1];
    const c1 = getCategory(n1);
    const c2 = getCategory(n2);

    // 1. Sequence
    if (isCategoryConsecutive(c1, c2)) {
      sequence++;
    }

    // 5. Repeating
    if (c1 === c2) {
      repeating++;
    }

    // 3. Combos
    let anyCombo = false;
    COMBO_DEFINITIONS.forEach((cd) => {
      if (cd.check(n1, n2)) {
        comboCounts[cd.id]++;
        anyCombo = true;
      }
    });
    if (anyCombo) combo++;
  }

  // One Cut checks (i and i + 2)
  for (let i = 0; i < n - 2; i++) {
    const n1 = nums[i];
    const n3 = nums[i + 2];
    const c1 = getCategory(n1);
    const c3 = getCategory(n3);

    // 2. One Cut Sequence
    if (isCategoryConsecutive(c1, c3)) {
      oneCutSequence++;
    }

    // 6. One Cut Repeating
    if (c1 === c3) {
      oneCutRepeating++;
    }

    // 4. One Cut Combos
    let anyOneCutCombo = false;
    COMBO_DEFINITIONS.forEach((cd) => {
      if (cd.check(n1, n3)) {
        oneCutComboCounts[cd.id]++;
        anyOneCutCombo = true;
      }
    });
    if (anyOneCutCombo) oneCutCombo++;

    // Tripal checks (i, i+1, i+2)
    const c2 = getCategory(nums[i + 1]);
    TRIPAL_DEFINITIONS.forEach((td) => {
      if (td.check(c1, c2, c3)) {
        tripalCounts[td.id]++;
      }
    });
  }

  const combos: ComboItem[] = COMBO_DEFINITIONS.map((cd) => ({
    id: cd.id,
    name: cd.name,
    count: comboCounts[cd.id],
    oneCutCount: oneCutComboCounts[cd.id],
    desc: cd.desc,
    targets: cd.targets,
  }));

  const tripals: TripalItem[] = TRIPAL_DEFINITIONS.map((td) => ({
    id: td.id,
    name: td.name,
    count: tripalCounts[td.id],
    desc: td.desc,
    numbers: td.numbers,
  }));

  return {
    sequence,
    oneCutSequence,
    combo,
    oneCutCombo,
    repeating,
    oneCutRepeating,
    combos,
    tripals,
  };
}
