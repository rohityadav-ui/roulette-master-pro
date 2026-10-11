export type RouletteNumber = number; // 0 to 36

export type ColorType = 'red' | 'black' | 'green';

export interface SpinRecord {
  id: string;
  spinNumber: number;
  value: RouletteNumber;
  color: ColorType;
  isEven: boolean | null;
  dozen: 1 | 2 | 3 | null;
  group6: number | null; // 1 to 6
  sector: 'tier' | 'voisin' | 'orphelin' | 'none';
  categories: number[]; // Cat 1 to 5
  timestamp: number;
}

export type TabType = 'home' | 'neighbours' | 'charts' | 'history' | 'patterns' | 'rng' | 'settings';

export interface ComboDetail {
  id: number;
  name: string;
  count: number;
  oneCutCount: number;
  description: string;
  predictedNumbers: number[];
}

export interface PatternAnalytics {
  sequenceCount: number;
  oneCutSequenceCount: number;
  comboCount: number;
  oneCutComboCount: number;
  repeatingCount: number;
  oneCutRepeatingCount: number;
  combos: ComboDetail[];
}
