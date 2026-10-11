import { CATEGORIES, getNumberCategories } from './constants';
import { ComboDetail, PatternAnalytics, SpinRecord } from '../types/roulette';

// Helper to test if two category sets have consecutive relationship (diff 1 or 4)
export function areCategoriesConsecutive(cats1: number[], cats2: number[]): boolean {
  for (const c1 of cats1) {
    for (const c2 of cats2) {
      const diff = Math.abs(c1 - c2);
      if (diff === 1 || diff === 4) return true;
    }
  }
  return false;
}

// Helper to test if two category sets share any category (repeating)
export function areCategoriesSame(cats1: number[], cats2: number[]): boolean {
  for (const c1 of cats1) {
    if (cats2.includes(c1)) return true;
  }
  return false;
}

// Check which of the 8 combos match a pair (num1, num2)
export function checkComboMatch(num1: number, num2: number): number[] {
  const matches: number[] = [];
  const cats1 = getNumberCategories(num1);
  const cats2 = getNumberCategories(num2);

  // 1. Combo 2-21: num1 in Cat 2 AND num2 in [12,17,21,26]
  if (cats1.includes(2) && [12, 17, 21, 26].includes(num2)) {
    matches.push(1);
  }
  // 2. Combo 2-22: num1 in Cat 2 AND num2 in [22,27]
  if (cats1.includes(2) && [22, 27].includes(num2)) {
    matches.push(2);
  }
  // 3. Combo 7-17: num1 in Cat 2 AND num2 in [12,17,21,26]
  if (cats1.includes(2) && [12, 17, 21, 26].includes(num2)) {
    matches.push(3);
  }
  // 4. Combo 9-11: num1 in Cat 4 AND num2 in [11,16,29,24]
  if (cats1.includes(4) && [11, 16, 29, 24].includes(num2)) {
    matches.push(4);
  }
  // 5. Combo 34-12: num1 in [34,43] AND num2 in [12,17,21,26]
  if ([34, 43].includes(num1) && [12, 17, 21, 26].includes(num2)) {
    matches.push(5);
  }
  // 6. Combo 31-17: num1 in [13,18,31,36] AND num2 in [12,17,21,26]
  if ([13, 18, 31, 36].includes(num1) && [12, 17, 21, 26].includes(num2)) {
    matches.push(6);
  }
  // 7. Combo 6-8: num1 in Cat 1 AND num2 in Cat 3
  if (cats1.includes(1) && cats2.includes(3)) {
    matches.push(7);
  }
  // 8. Combo 5-8: num1 in Cat 5 AND num2 in Cat 3
  if (cats1.includes(5) && cats2.includes(3)) {
    matches.push(8);
  }

  return matches;
}

export const COMBO_INFO = [
  { id: 1, name: 'Combo 2-21', desc: 'num1 in Cat 2 → num2 in [12, 17, 21, 26]', targets: [12, 17, 21, 26] },
  { id: 2, name: 'Combo 2-22', desc: 'num1 in Cat 2 → num2 in [22, 27]', targets: [22, 27] },
  { id: 3, name: 'Combo 7-17', desc: 'num1 in Cat 2 → num2 in [12, 17, 21, 26]', targets: [12, 17, 21, 26] },
  { id: 4, name: 'Combo 9-11', desc: 'num1 in Cat 4 → num2 in [11, 16, 29, 24]', targets: [11, 16, 29, 24] },
  { id: 5, name: 'Combo 34-12', desc: 'num1 in [34, 43] → num2 in [12, 17, 21, 26]', targets: [12, 17, 21, 26] },
  { id: 6, name: 'Combo 31-17', desc: 'num1 in [13, 18, 31, 36] → num2 in [12, 17, 21, 26]', targets: [12, 17, 21, 26] },
  { id: 7, name: 'Combo 6-8', desc: 'num1 in Cat 1 → num2 in Cat 3', targets: CATEGORIES[3] },
  { id: 8, name: 'Combo 5-8', desc: 'num1 in Cat 5 → num2 in Cat 3', targets: CATEGORIES[3] },
];

export function calculatePatterns(spins: SpinRecord[]): PatternAnalytics {
  const historyNumbers = spins.map((s) => s.value);
  const n = historyNumbers.length;

  let sequenceCount = 0;
  let oneCutSequenceCount = 0;
  let comboCount = 0;
  let oneCutComboCount = 0;
  let repeatingCount = 0;
  let oneCutRepeatingCount = 0;

  const comboHits: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
  const oneCutComboHits: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };

  // Calculate adjacent pairs (i, i+1)
  for (let i = 0; i < n - 1; i++) {
    const num1 = historyNumbers[i];
    const num2 = historyNumbers[i + 1];
    const cats1 = getNumberCategories(num1);
    const cats2 = getNumberCategories(num2);

    // Sequence
    if (areCategoriesConsecutive(cats1, cats2)) {
      sequenceCount++;
    }

    // Repeating
    if (areCategoriesSame(cats1, cats2)) {
      repeatingCount++;
    }

    // Combos
    const matches = checkComboMatch(num1, num2);
    if (matches.length > 0) {
      comboCount += matches.length;
      matches.forEach((id) => {
        comboHits[id] = (comboHits[id] || 0) + 1;
      });
    }
  }

  // Calculate one cut pairs (i, i+2)
  for (let i = 0; i < n - 2; i++) {
    const num1 = historyNumbers[i];
    const num2 = historyNumbers[i + 2];
    const cats1 = getNumberCategories(num1);
    const cats2 = getNumberCategories(num2);

    // One Cut Sequence
    if (areCategoriesConsecutive(cats1, cats2)) {
      oneCutSequenceCount++;
    }

    // One Cut Repeating
    if (areCategoriesSame(cats1, cats2)) {
      oneCutRepeatingCount++;
    }

    // One Cut Combo
    const matches = checkComboMatch(num1, num2);
    if (matches.length > 0) {
      oneCutComboCount += matches.length;
      matches.forEach((id) => {
        oneCutComboHits[id] = (oneCutComboHits[id] || 0) + 1;
      });
    }
  }

  const combos: ComboDetail[] = COMBO_INFO.map((ci) => ({
    id: ci.id,
    name: ci.name,
    count: comboHits[ci.id] || 0,
    oneCutCount: oneCutComboHits[ci.id] || 0,
    description: ci.desc,
    predictedNumbers: ci.targets,
  }));

  return {
    sequenceCount,
    oneCutSequenceCount,
    comboCount,
    oneCutComboCount,
    repeatingCount,
    oneCutRepeatingCount,
    combos,
  };
}

// Predictions based on last number
export function getPredictionsForLastNumber(lastNum: number | null): {
  rightCat: number;
  rightNumbers: number[];
  leftCat: number;
  leftNumbers: number[];
  activeCombos: { name: string; numbers: number[] }[];
} {
  if (lastNum === null) {
    return {
      rightCat: 1,
      rightNumbers: CATEGORIES[1],
      leftCat: 5,
      leftNumbers: CATEGORIES[5],
      activeCombos: [],
    };
  }

  const cats = getNumberCategories(lastNum);
  const primaryCat = cats[0] || 1;

  // Next Sequence: RIGHT category +1 (cycle 5->1)
  const rightCat = primaryCat === 5 ? 1 : primaryCat + 1;
  const rightNumbers = CATEGORIES[rightCat] || [];

  // Next Sequence: LEFT category -1 (cycle 1->5)
  const leftCat = primaryCat === 1 ? 5 : primaryCat - 1;
  const leftNumbers = CATEGORIES[leftCat] || [];

  // Next Combos activated by this number
  const activeCombos: { name: string; numbers: number[] }[] = [];

  if (cats.includes(2)) {
    activeCombos.push({ name: 'Combo 2-21 / 7-17', numbers: [12, 17, 21, 26] });
    activeCombos.push({ name: 'Combo 2-22', numbers: [22, 27] });
  }
  if (cats.includes(4)) {
    activeCombos.push({ name: 'Combo 9-11', numbers: [11, 16, 29, 24] });
  }
  if ([34, 43].includes(lastNum)) {
    activeCombos.push({ name: 'Combo 34-12', numbers: [12, 17, 21, 26] });
  }
  if ([13, 18, 31, 36].includes(lastNum)) {
    activeCombos.push({ name: 'Combo 31-17', numbers: [12, 17, 21, 26] });
  }
  if (cats.includes(1)) {
    activeCombos.push({ name: 'Combo 6-8', numbers: CATEGORIES[3] });
  }
  if (cats.includes(5)) {
    activeCombos.push({ name: 'Combo 5-8', numbers: CATEGORIES[3] });
  }

  return {
    rightCat,
    rightNumbers,
    leftCat,
    leftNumbers,
    activeCombos,
  };
}
