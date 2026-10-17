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

export interface DozenTargetResult {
  safeDozens: number[];
  dangerDozen: number;
  reason: string;
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
  dozenTarget?: DozenTargetResult;
  topCategories: CategoryPredictionItem[];
  suggestedNumbers: number[];
}

// NEW TYPES FOR 7-SPIN PREDICTION & TRACKING
export type HotTier = 'super-hot' | 'warm' | 'cold';

export interface HotNumberItem {
  number: number;
  hits: number;
  tier: HotTier;
  percentage: number;
  spinsAgo: number;
}

export interface HotNumbersAnalysis {
  superHot: HotNumberItem[];
  warm: HotNumberItem[];
  cold: HotNumberItem[];
  totalEvaluated: number;
}

export type HitStatus = 'direct' | 'nearby' | 'miss';

export interface TrackingSpinRow {
  spinIndex: number; // 1 to 7
  value: number;
  status: HitStatus;
  distance: number; // 0 = direct, 1 or 2 = nearby, > 2 = miss
  closestTarget: number | null;
  timestamp: number;
}

export interface SevenSpinPredictionData {
  windowId: number;
  spinInWindow: number; // 1 to 7
  totalWindowSpins: number; // 7
  tier1High: number[]; // 🔴 3-4 numbers
  tier2Medium: number[]; // 🟡 3-4 numbers
  tier3Value: number[]; // 🟢 2-3 numbers
  allSuggested: number[]; // 8-10 numbers
  activeRows: TrackingSpinRow[];
}

export interface SessionAccuracyStats {
  totalWindowsCompleted: number;
  totalTrackedSpins: number;
  directHits: number;
  nearbyHits: number;
  misses: number;
  directAccuracy: number; // %
  combinedAccuracy: number; // direct + nearby %
  bestWindow: {
    windowId: number;
    directCount: number;
    nearbyCount: number;
    total: number;
  } | null;
}
