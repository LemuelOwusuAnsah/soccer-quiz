export type BadgeId = 'perfect' | 'speedster' | 'streak-master' | 'survivor' | 'flawless';

export type Badge = {
  id: BadgeId;
  label: string;
  description: string;
};

export type BadgeInput = {
  score: number;
  total: number;
  bestStreak: number;
  averageSeconds: number;
  timedOutCount: number;
};

export const BADGES: ReadonlyArray<Badge> = [
  { id: 'perfect', label: 'Perfect', description: 'All questions correct' },
  { id: 'speedster', label: 'Speedster', description: 'Average under 5s per question' },
  { id: 'streak-master', label: 'Streak Master', description: '5 correct in a row' },
  { id: 'survivor', label: 'Survivor', description: 'Finished without timing out' },
  { id: 'flawless', label: 'Flawless', description: 'Perfect score and no timeouts' },
];

export function earnedBadges(input: BadgeInput): Badge[] {
  const earned: Badge[] = [];
  const pct = input.total > 0 ? (input.score / input.total) * 100 : 0;
  if (pct === 100) earned.push(BADGES[0]!);
  if (input.averageSeconds > 0 && input.averageSeconds < 5) earned.push(BADGES[1]!);
  if (input.bestStreak >= 5) earned.push(BADGES[2]!);
  if (input.timedOutCount === 0) earned.push(BADGES[3]!);
  if (pct === 100 && input.timedOutCount === 0) earned.push(BADGES[4]!);
  return earned;
}
