import type { TimingRecord } from './timing';
import type { StreakState } from './streak';

export type QuizStats = {
  score: number;
  total: number;
  percent: number;
  correctCount: number;
  wrongCount: number;
  timedOutCount: number;
  bestStreak: number;
  averageSeconds: number;
  fastestSeconds: number | null;
};

export function buildStats(
  score: number,
  total: number,
  streak: StreakState,
  timings: ReadonlyArray<TimingRecord>
): QuizStats {
  const timedOutCount = timings.filter((t) => t.timedOut).length;
  const correctCount = score;
  const wrongCount = Math.max(0, total - correctCount);
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  const nonTimeout = timings.filter((t) => !t.timedOut);
  const averageSeconds =
    nonTimeout.length > 0
      ? nonTimeout.reduce((a, t) => a + t.secondsUsed, 0) / nonTimeout.length
      : 0;

  const fastestSeconds =
    nonTimeout.length > 0
      ? Math.min(...nonTimeout.map((t) => t.secondsUsed))
      : null;

  return {
    score,
    total,
    percent,
    correctCount,
    wrongCount,
    timedOutCount,
    bestStreak: streak.best,
    averageSeconds: Math.round(averageSeconds * 10) / 10,
    fastestSeconds,
  };
}
