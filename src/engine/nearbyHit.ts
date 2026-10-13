import { HitStatus } from '../types';
import { EUROPEAN_WHEEL } from './wheelNeighbors';

export interface NearbyHitEvaluation {
  status: HitStatus;
  distance: number; // 0 = direct, 1 = neighbor 1, 2 = neighbor 2, >2 = miss
  closestTarget: number | null;
}

/**
 * Calculates shortest distance around circular European wheel between two numbers
 */
export function getWheelDistance(numA: number, numB: number): number {
  const idxA = EUROPEAN_WHEEL.indexOf(numA);
  const idxB = EUROPEAN_WHEEL.indexOf(numB);

  if (idxA === -1 || idxB === -1) return 99;

  const total = EUROPEAN_WHEEL.length; // 37
  const directDiff = Math.abs(idxA - idxB);
  return Math.min(directDiff, total - directDiff);
}

/**
 * Evaluates whether a landed spin was a direct hit, nearby neighbor (±1, ±2), or miss
 */
export function evaluateNearbyHit(
  landedNum: number,
  predictedNumbers: number[]
): NearbyHitEvaluation {
  if (predictedNumbers.length === 0) {
    return {
      status: 'miss',
      distance: 99,
      closestTarget: null,
    };
  }

  // Check direct hit
  if (predictedNumbers.includes(landedNum)) {
    return {
      status: 'direct',
      distance: 0,
      closestTarget: landedNum,
    };
  }

  // Find minimum distance to any predicted number
  let minDistance = 99;
  let closestTarget: number | null = null;

  for (const target of predictedNumbers) {
    const dist = getWheelDistance(landedNum, target);
    if (dist < minDistance) {
      minDistance = dist;
      closestTarget = target;
    }
  }

  if (minDistance <= 2) {
    return {
      status: 'nearby',
      distance: minDistance,
      closestTarget,
    };
  }

  return {
    status: 'miss',
    distance: minDistance,
    closestTarget,
  };
}
