export type StreakState = {
  current: number;
  best: number;
};

export function newStreak(): StreakState {
  return { current: 0, best: 0 };
}

export function recordAnswer(streak: StreakState, correct: boolean): StreakState {
  const current = correct ? streak.current + 1 : 0;
  return { current, best: Math.max(streak.best, current) };
}

export function streakBonus(streak: StreakState): number {
  if (streak.current >= 5) return 3;
  if (streak.current >= 3) return 2;
  if (streak.current >= 2) return 1;
  return 0;
}
