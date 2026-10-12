import { RouletteColor } from '../types';

export const RED_NUMBERS: number[] = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

export const BLACK_NUMBERS: number[] = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];

export function getColor(num: number): RouletteColor {
  if (num === 0) return 'G';
  return RED_NUMBERS.includes(num) ? 'R' : 'B';
}

export function getColorHex(color: RouletteColor): string {
  switch (color) {
    case 'R':
      return '#dc2626'; // Red 600
    case 'B':
      return '#18181b'; // Zinc 900
    case 'G':
      return '#059669'; // Emerald 600
  }
}

export function getColorLabel(color: RouletteColor): string {
  switch (color) {
    case 'R':
      return 'Red';
    case 'B':
      return 'Black';
    case 'G':
      return 'Zero';
  }
}
