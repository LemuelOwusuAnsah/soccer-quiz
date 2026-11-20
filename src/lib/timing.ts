export type TimingRecord = {
  questionId: number;
  secondsUsed: number;
  timedOut: boolean;
};

export class TimingTracker {
  private records: TimingRecord[] = [];
  private startedAt: number | null = null;
  private currentQid: number | null = null;

  public start(questionId: number, now: number = Date.now()): void {
    this.currentQid = questionId;
    this.startedAt = now;
  }

  public stop(timedOut: boolean, now: number = Date.now()): void {
    if (this.startedAt === null || this.currentQid === null) return;
    const secondsUsed = Math.max(0, Math.round((now - this.startedAt) / 1000));
    this.records.push({ questionId: this.currentQid, secondsUsed, timedOut });
    this.startedAt = null;
    this.currentQid = null;
  }

  public all(): ReadonlyArray<TimingRecord> {
    return this.records;
  }

  public averageSeconds(): number {
    if (this.records.length === 0) return 0;
    const sum = this.records.reduce((a, r) => a + r.secondsUsed, 0);
    return sum / this.records.length;
  }

  public fastest(): TimingRecord | null {
    let best: TimingRecord | null = null;
    for (const r of this.records) {
      if (r.timedOut) continue;
      if (!best || r.secondsUsed < best.secondsUsed) best = r;
    }
    return best;
  }

  public reset(): void {
    this.records = [];
    this.startedAt = null;
    this.currentQid = null;
  }
}
