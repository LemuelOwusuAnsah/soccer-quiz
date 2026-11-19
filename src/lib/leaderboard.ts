export type ScoreEntry = {
  name: string;
  score: number;
  total: number;
  date: string;
};

const STORAGE_KEY = 'soccer-quiz:leaderboard';
const MAX_ENTRIES = 5;

export function loadScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isEntry);
  } catch {
    return [];
  }
}

function isEntry(v: unknown): v is ScoreEntry {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.name === 'string' &&
    typeof o.score === 'number' &&
    typeof o.total === 'number' &&
    typeof o.date === 'string'
  );
}

export function saveScore(name: string, score: number, total: number): ScoreEntry[] {
  const trimmed = name.trim().slice(0, 20) || 'Anonymous';
  const entry: ScoreEntry = {
    name: trimmed,
    score,
    total,
    date: new Date().toISOString(),
  };
  const all = [...loadScores(), entry];
  all.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.date.localeCompare(b.date);
  });
  const top = all.slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top));
  } catch {
    return top;
  }
  return top;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
