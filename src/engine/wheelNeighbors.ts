export const EUROPEAN_WHEEL: number[] = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16,
  33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

export interface WheelNeighborsResult {
  l2: number;
  l1: number;
  center: number;
  r1: number;
  r2: number;
  neighborsList: number[];
}

export function getWheelNeighbors(centerNum: number): WheelNeighborsResult {
  const total = EUROPEAN_WHEEL.length;
  const centerIdx = EUROPEAN_WHEEL.indexOf(centerNum);

  if (centerIdx === -1) {
    return {
      l2: 0,
      l1: 0,
      center: 0,
      r1: 0,
      r2: 0,
      neighborsList: [0, 0, 0, 0, 0],
    };
  }

  const getIdx = (offset: number) => (centerIdx + offset + total) % total;

  const l2 = EUROPEAN_WHEEL[getIdx(-2)];
  const l1 = EUROPEAN_WHEEL[getIdx(-1)];
  const center = EUROPEAN_WHEEL[centerIdx];
  const r1 = EUROPEAN_WHEEL[getIdx(1)];
  const r2 = EUROPEAN_WHEEL[getIdx(2)];

  return {
    l2,
    l1,
    center,
    r1,
    r2,
    neighborsList: [l2, l1, center, r1, r2],
  };
}
