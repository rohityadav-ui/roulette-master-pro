import { RouletteCategory, RouletteColumn, RouletteDozen } from '../types';

export const CATEGORY_NUMBERS: Record<RouletteCategory, number[]> = {
  1: [1, 6, 10, 15, 24, 29, 33],
  2: [2, 7, 11, 16, 20, 24, 25, 29, 34],
  3: [3, 8, 12, 17, 21, 26, 30, 35],
  4: [4, 9, 13, 18, 22, 27, 31, 36],
  5: [5, 0, 10, 14, 15, 19, 23, 28, 32],
};

export function getCategory(num: number): RouletteCategory {
  const cat1 = [1, 6, 10, 15, 24, 29, 33];
  const cat2 = [2, 7, 11, 16, 20, 24, 25, 29, 34];
  const cat3 = [3, 8, 12, 17, 21, 26, 30, 35];
  const cat4 = [4, 9, 13, 18, 22, 27, 31, 36];
  const cat5 = [5, 0, 10, 14, 15, 19, 23, 28, 32];
  if (cat1.includes(num)) return 1;
  if (cat2.includes(num)) return 2;
  if (cat3.includes(num)) return 3;
  if (cat4.includes(num)) return 4;
  return 5;
}

export function getDozen(num: number): RouletteDozen {
  if (num === 0) return 0;
  if (num <= 12) return 1;
  if (num <= 24) return 2;
  return 3;
}

export function getColumn(num: number): RouletteColumn {
  if (num === 0) return 0;
  const mod = num % 3;
  if (mod === 1) return 1;
  if (mod === 2) return 2;
  return 3;
}
