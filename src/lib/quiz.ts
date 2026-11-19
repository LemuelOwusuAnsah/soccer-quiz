import { getQuestion, shuffledIds, TIME_LIMIT_SECONDS, TOTAL_QUESTIONS, type Question } from './questions';

export type QuizPhase = 'question' | 'feedback' | 'finished';

export type QuizState = {
  order: number[];
  index: number;
  score: number;
  phase: QuizPhase;
  selected: number | null;
  timedOut: boolean;
  feedback: string;
  lastCorrect: number | null;
};

export type AnswerResult = {
  correct: boolean;
  timedOut: boolean;
  correctIndex: number;
  correctText: string;
};

export function newQuiz(): QuizState {
  return {
    order: shuffledIds(),
    index: 0,
    score: 0,
    phase: 'question',
    selected: null,
    timedOut: false,
    feedback: '',
    lastCorrect: null,
  };
}

export function currentQuestion(state: QuizState): Question {
  const id = state.order[state.index];
  if (id === undefined) throw new Error('no current question');
  return getQuestion(id);
}

export function timeLimit(): number {
  return TIME_LIMIT_SECONDS;
}

export function total(): number {
  return TOTAL_QUESTIONS;
}

export function submitAnswer(state: QuizState, selected: number | null, timedOut: boolean): { state: QuizState; result: AnswerResult } {
  if (state.phase !== 'question') {
    throw new Error('not accepting answers');
  }
  const q = currentQuestion(state);
  const correctIndex = q.answer;
  const correctText = q.options[correctIndex];
  const correct = selected === correctIndex && !timedOut;
  const nextScore = correct ? state.score + 1 : state.score;

  let feedback: string;
  if (timedOut) {
    feedback = "Time's up! Correct answer: " + correctText;
  } else if (correct) {
    feedback = 'Correct!';
  } else {
    feedback = 'Wrong. Correct answer: ' + correctText;
  }

  return {
    state: {
      ...state,
      score: nextScore,
      phase: 'feedback',
      selected,
      timedOut,
      feedback,
      lastCorrect: correctIndex,
    },
    result: { correct, timedOut, correctIndex, correctText },
  };
}

export function nextQuestion(state: QuizState): QuizState {
  if (state.phase !== 'feedback') {
    throw new Error('not in feedback phase');
  }
  const nextIndex = state.index + 1;
  if (nextIndex >= state.order.length) {
    return { ...state, phase: 'finished', feedback: '' };
  }
  return {
    ...state,
    index: nextIndex,
    phase: 'question',
    selected: null,
    timedOut: false,
    feedback: '',
    lastCorrect: null,
  };
}

export function resultMessage(score: number, totalCount: number): string {
  const pct = (score / totalCount) * 100;
  if (pct === 100) return "Perfect! You're a soccer genius!";
  if (pct >= 80) return 'Excellent! You really know your soccer.';
  if (pct >= 50) return 'Not bad! A solid performance.';
  return "Keep practising — you'll get there!";
}
