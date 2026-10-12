export type RouletteColor = 'R' | 'B' | 'G';

export type RouletteCategory = 1 | 2 | 3 | 4 | 5;

export type RouletteDozen = 1 | 2 | 3 | 0;

export type RouletteColumn = 1 | 2 | 3 | 0;

export interface SpinItem {
  id: string;
  value: number; // 0 to 36
  color: RouletteColor;
  category: RouletteCategory;
  dozen: RouletteDozen;
  column: RouletteColumn;
  timestamp: number;
}

export type ActiveTab = 'home' | 'patterns' | 'trends';

export interface CategoryPredictionItem {
  category: RouletteCategory;
  percentage: number;
  weight: number;
  numbers: number[];
}

export interface ComboItem {
  id: number;
  name: string;
  count: number;
  oneCutCount: number;
  desc: string;
  targets: number[];
}

export interface TripalItem {
  id: number;
  name: string;
  count: number;
  desc: string;
  numbers: number[];
}

export interface PatternCounts {
  sequence: number;
  oneCutSequence: number;
  combo: number;
  oneCutCombo: number;
  repeating: number;
  oneCutRepeating: number;
  combos: ComboItem[];
  tripals: TripalItem[];
}

export interface PredictionResult {
  dozenHint: {
    dozen: 1 | 2 | 3;
    title: string;
    description: string;
    probability: number;
  };
  columnHint: {
    column: 1 | 2 | 3;
    title: string;
    description: string;
    probability: number;
  };
  topCategories: CategoryPredictionItem[];
  suggestedNumbers: number[];
}
