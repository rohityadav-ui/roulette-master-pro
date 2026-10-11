import {
  GROUPS_6,
  ORPHELIN,
  TIER,
  VOISIN,
  getNumberCategories,
  getNumberColor,
  getNumberDozen,
  getNumberGroup6,
  getNumberSector,
} from './constants';
import { SpinRecord } from '../types/roulette';

export function createSpinRecord(val: number, spinNumber: number): SpinRecord {
  const color = getNumberColor(val);
  const isZero = val === 0;

  return {
    id: `spin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    spinNumber,
    value: val,
    color,
    isEven: isZero ? null : val % 2 === 0,
    dozen: getNumberDozen(val),
    group6: getNumberGroup6(val),
    sector: getNumberSector(val),
    categories: getNumberCategories(val),
    timestamp: Date.now(),
  };
}

export interface LiveStatsData {
  totalSpins: number;
  redCount: number;
  blackCount: number;
  greenCount: number;
  redPercent: number;
  blackPercent: number;
  greenPercent: number;
  evenCount: number;
  oddCount: number;
  evenPercent: number;
  oddPercent: number;
  dozens: {
    dozen: 1 | 2 | 3;
    name: string;
    range: string;
    count: number;
    percent: number;
  }[];
  groups6: {
    group: number;
    range: string;
    count: number;
    percent: number;
  }[];
  sectors: {
    name: string;
    key: 'voisin' | 'tier' | 'orphelin';
    count: number;
    percent: number;
  }[];
  hotTop3: { value: number; count: number; color: 'red' | 'black' | 'green' }[];
  coldTop3: { value: number; count: number; color: 'red' | 'black' | 'green' }[];
  currentStreak: { type: string; count: number } | null;
}

export function calculateLiveStats(spins: SpinRecord[]): LiveStatsData {
  const totalSpins = spins.length;
  let redCount = 0;
  let blackCount = 0;
  let greenCount = 0;
  let evenCount = 0;
  let oddCount = 0;

  const dozenCounts = { 1: 0, 2: 0, 3: 0 };
  const group6Counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const sectorCounts = { voisin: 0, tier: 0, orphelin: 0, none: 0 };
  const numHitsMap = new Map<number, number>();

  for (let i = 0; i <= 36; i++) {
    numHitsMap.set(i, 0);
  }

  spins.forEach((s) => {
    numHitsMap.set(s.value, (numHitsMap.get(s.value) || 0) + 1);

    if (s.color === 'red') redCount++;
    else if (s.color === 'black') blackCount++;
    else greenCount++;

    if (s.isEven === true) evenCount++;
    else if (s.isEven === false) oddCount++;

    if (s.dozen) dozenCounts[s.dozen]++;
    if (s.group6) group6Counts[s.group6]++;
    sectorCounts[s.sector]++;
  });

  const redPercent = totalSpins > 0 ? (redCount / totalSpins) * 100 : 0;
  const blackPercent = totalSpins > 0 ? (blackCount / totalSpins) * 100 : 0;
  const greenPercent = totalSpins > 0 ? (greenCount / totalSpins) * 100 : 0;

  const evenTotal = evenCount + oddCount;
  const evenPercent = evenTotal > 0 ? (evenCount / evenTotal) * 100 : 0;
  const oddPercent = evenTotal > 0 ? (oddCount / evenTotal) * 100 : 0;

  // Dozens
  const dozens = ([1, 2, 3] as const).map((d) => ({
    dozen: d,
    name: `${d === 1 ? '1st' : d === 2 ? '2nd' : '3rd'} Dozen`,
    range: d === 1 ? '1 - 12' : d === 2 ? '13 - 24' : '25 - 36',
    count: dozenCounts[d],
    percent: totalSpins > 0 ? (dozenCounts[d] / totalSpins) * 100 : 0,
  }));

  // 6 Groups
  const groupRanges = ['1-6', '7-12', '13-18', '19-24', '25-30', '31-36'];
  const groups6 = [1, 2, 3, 4, 5, 6].map((g) => ({
    group: g,
    range: groupRanges[g - 1],
    count: group6Counts[g] || 0,
    percent: totalSpins > 0 ? ((group6Counts[g] || 0) / totalSpins) * 100 : 0,
  }));

  // Sectors
  const sectors = [
    {
      name: 'Voisin du Zéro',
      key: 'voisin' as const,
      count: sectorCounts.voisin,
      percent: totalSpins > 0 ? (sectorCounts.voisin / totalSpins) * 100 : 0,
    },
    {
      name: 'Tiers du Cylindre',
      key: 'tier' as const,
      count: sectorCounts.tier,
      percent: totalSpins > 0 ? (sectorCounts.tier / totalSpins) * 100 : 0,
    },
    {
      name: 'Orphelins',
      key: 'orphelin' as const,
      count: sectorCounts.orphelin,
      percent: totalSpins > 0 ? (sectorCounts.orphelin / totalSpins) * 100 : 0,
    },
  ];

  // Hot (top 3) & Cold (top 3)
  const sortedNumbers = Array.from(numHitsMap.entries())
    .map(([val, count]) => ({
      value: val,
      count,
      color: getNumberColor(val),
    }))
    .sort((a, b) => b.count - a.count);

  const hotTop3 = sortedNumbers.slice(0, 3);
  const coldTop3 = [...sortedNumbers].reverse().slice(0, 3);

  // Current Streak (e.g. 3x Red, 4x Black, etc.)
  let currentStreak: { type: string; count: number } | null = null;
  if (spins.length > 0) {
    const lastColor = spins[spins.length - 1].color;
    let streakCount = 0;
    for (let i = spins.length - 1; i >= 0; i--) {
      if (spins[i].color === lastColor) {
        streakCount++;
      } else {
        break;
      }
    }
    const colorLabel = lastColor === 'red' ? 'Red' : lastColor === 'black' ? 'Black' : 'Green';
    currentStreak = { type: colorLabel, count: streakCount };
  }

  return {
    totalSpins,
    redCount,
    blackCount,
    greenCount,
    redPercent,
    blackPercent,
    greenPercent,
    evenCount,
    oddCount,
    evenPercent,
    oddPercent,
    dozens,
    groups6,
    sectors,
    hotTop3,
    coldTop3,
    currentStreak,
  };
}
