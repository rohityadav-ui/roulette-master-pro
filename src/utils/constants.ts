export const RED_NUMBERS: number[] = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

export const BLACK_NUMBERS: number[] = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];

export const GREEN: number[] = [0];

export const GROUPS_6: number[][] = [
  [1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30],
  [31, 32, 33, 34, 35, 36],
];

export const TIER: number[] = [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33];
export const VOISIN: number[] = [22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25];
export const ORPHELIN: number[] = [17, 34, 6, 1, 20, 14, 31, 9];

export const NEIGHBOURS: Record<number, number[]> = {
  0: [3, 26, 0, 32, 15],
  1: [16, 33, 1, 20, 14],
  2: [4, 21, 2, 25, 17],
  3: [12, 35, 3, 26, 0],
  4: [15, 19, 4, 21, 2],
  5: [23, 10, 5, 24, 16],
  6: [17, 34, 6, 27, 13],
  7: [18, 29, 7, 28, 12],
  8: [11, 30, 8, 23, 10],
  9: [14, 31, 9, 22, 18],
  10: [8, 23, 10, 5, 24],
  11: [13, 36, 11, 30, 8],
  12: [7, 28, 12, 35, 3],
  13: [6, 27, 13, 36, 11],
  14: [1, 20, 14, 31, 9],
  15: [0, 32, 15, 19, 4],
  16: [5, 24, 16, 33, 1],
  17: [2, 25, 17, 34, 6],
  18: [9, 22, 18, 29, 7],
  19: [32, 15, 19, 4, 21],
  20: [33, 1, 20, 14, 31],
  21: [19, 4, 21, 2, 25],
  22: [31, 9, 22, 18, 29],
  23: [30, 8, 23, 10, 5],
  24: [10, 5, 24, 16, 33],
  25: [21, 2, 25, 17, 34],
  26: [35, 3, 26, 0, 32],
  27: [34, 6, 27, 13, 36],
  28: [29, 7, 28, 12, 35],
  29: [22, 18, 29, 7, 28],
  30: [36, 11, 30, 8, 23],
  31: [20, 14, 31, 9, 22],
  32: [26, 0, 32, 15, 19],
  33: [24, 16, 33, 1, 20],
  34: [25, 17, 34, 6, 27],
  35: [28, 12, 35, 3, 26],
  36: [27, 13, 36, 11, 30],
};

export const CATEGORIES: Record<number, number[]> = {
  1: [1, 6, 10, 15, 24, 29, 33],
  2: [2, 7, 11, 16, 20, 24, 25, 29, 34],
  3: [3, 8, 12, 17, 21, 26, 30, 35],
  4: [4, 9, 13, 18, 22, 27, 31, 36],
  5: [5, 0, 10, 14, 15, 19, 23, 28, 32],
};

// Real face groups as specified in Section 8
export const REAL_FACE_GROUPS = {
  '21_RF': [12, 17, 21, 26],
  '22_RF': [22, 27],
  '17_RF': [12, 17, 21, 26],
  '11_RF': [11, 16, 29, 24],
  '34_RF': [34, 43], // 34 on roulette
  '31_RF': [13, 18, 31, 36],
};

export function getNumberColor(num: number): 'red' | 'black' | 'green' {
  if (num === 0) return 'green';
  return RED_NUMBERS.includes(num) ? 'red' : 'black';
}

export function getNumberCategories(num: number): number[] {
  const cats: number[] = [];
  for (let c = 1; c <= 5; c++) {
    if (CATEGORIES[c].includes(num)) {
      cats.push(c);
    }
  }
  return cats.length > 0 ? cats : [1];
}

export function getNumberSector(num: number): 'tier' | 'voisin' | 'orphelin' | 'none' {
  if (VOISIN.includes(num)) return 'voisin';
  if (TIER.includes(num)) return 'tier';
  if (ORPHELIN.includes(num)) return 'orphelin';
  return 'none';
}

export function getNumberGroup6(num: number): number | null {
  if (num === 0) return null;
  for (let i = 0; i < GROUPS_6.length; i++) {
    if (GROUPS_6[i].includes(num)) {
      return i + 1;
    }
  }
  return null;
}

export function getNumberDozen(num: number): 1 | 2 | 3 | null {
  if (num === 0) return null;
  if (num <= 12) return 1;
  if (num <= 24) return 2;
  return 3;
}
