import {
  newQuiz,
  currentQuestion,
  submitAnswer,
  nextQuestion,
  resultMessage,
  timeLimit,
  total,
  type QuizState,
} from '../lib/quiz';
import { loadScores, saveScore, formatDate, type ScoreEntry } from '../lib/leaderboard';

function $<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error('missing #' + id);
  return el as T;
}

const quizScreen = $<HTMLElement>('quiz');
const resultScreen = $<HTMLElement>('result');

const progressEl = $<HTMLElement>('progress');
const scoreEl = $<HTMLElement>('score');
const timerEl = $<HTMLElement>('timer');
const timerValueEl = $<HTMLElement>('timerValue');
const pauseBtn = $<HTMLButtonElement>('pauseBtn');
const questionTextEl = $<HTMLElement>('questionText');
const answerForm = $<HTMLFormElement>('answerForm');
const answerButtons = Array.from(answerForm.querySelectorAll<HTMLButtonElement>('.answer'));
const feedbackEl = $<HTMLElement>('feedback');
const nextBtn = $<HTMLButtonElement>('nextBtn');

const resultMessageEl = $<HTMLElement>('resultMessage');
const resultScoreEl = $<HTMLElement>('resultScore');
const resultTotalEl = $<HTMLElement>('resultTotal');
const resultPercentEl = $<HTMLElement>('resultPercent');
const saveForm = $<HTMLFormElement>('saveForm');
const playerNameEl = $<HTMLInputElement>('playerName');
const playAgainBtn = $<HTMLButtonElement>('playAgainBtn');
const leaderboardList = $<HTMLOListElement>('leaderboardList');
const leaderboardEmpty = $<HTMLElement>('leaderboardEmpty');

let state: QuizState = newQuiz();
let secondsLeft = timeLimit();
let paused = false;
let timerId: number | null = null;
let savingEnabled = true;

function stopTimer(): void {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function startTimer(): void {
  stopTimer();
  secondsLeft = timeLimit();
  paused = false;
  pauseBtn.textContent = 'Pause';
  timerEl.classList.remove('warning');
  timerValueEl.textContent = String(secondsLeft);
  timerId = window.setInterval(() => {
    if (paused) return;
    secondsLeft -= 1;
    if (secondsLeft < 0) secondsLeft = 0;
    timerValueEl.textContent = String(secondsLeft);
    if (secondsLeft <= 5) timerEl.classList.add('warning');
    if (secondsLeft <= 0) {
      stopTimer();
      handleAnswer(null, true);
    }
  }, 1000);
}

function renderQuestion(): void {
  const q = currentQuestion(state);
  progressEl.textContent = 'Question ' + (state.index + 1) + ' / ' + total();
  scoreEl.textContent = String(state.score);
  questionTextEl.textContent = q.text;
  answerButtons.forEach((btn, i) => {
    btn.textContent = q.options[i] ?? '';
    btn.className = 'answer';
    btn.disabled = false;
  });
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  nextBtn.style.display = 'none';
  savingEnabled = true;
  startTimer();
}

function handleAnswer(selected: number | null, timedOut: boolean): void {
  stopTimer();
  const { state: nextState, result } = submitAnswer(state, selected, timedOut);
  state = nextState;

  answerButtons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === result.correctIndex) {
      btn.classList.add('correct');
    } else if (selected === i && !result.correct) {
      btn.classList.add('wrong');
    } else {
      btn.classList.add('dim');
    }
  });

  scoreEl.textContent = String(state.score);
  feedbackEl.textContent = state.feedback;
  feedbackEl.className = 'feedback ' + (result.correct ? 'correct' : 'wrong');
  nextBtn.textContent = state.index + 1 >= total() ? 'See results' : 'Next';
  nextBtn.style.display = '';
}

function advance(): void {
  if (state.phase !== 'feedback') return;
  state = nextQuestion(state);
  if (state.phase === 'finished') {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult(): void {
  stopTimer();
  quizScreen.style.display = 'none';
  resultScreen.style.display = '';

  resultMessageEl.textContent = resultMessage(state.score, total());
  resultScoreEl.textContent = String(state.score);
  resultTotalEl.textContent = String(total());
  const pct = Math.round((state.score / total()) * 100);
  resultPercentEl.textContent = pct + '% correct';

  savingEnabled = true;
  saveForm.style.display = '';
  playerNameEl.value = '';
  renderLeaderboard();
}

function renderLeaderboard(): void {
  const scores = loadScores();
  if (scores.length === 0) {
    leaderboardList.innerHTML = '';
    leaderboardEmpty.style.display = '';
    return;
  }
  leaderboardEmpty.style.display = 'none';
  leaderboardList.innerHTML = scores
    .map(
      (s: ScoreEntry) =>
        '<li><span class="lb-name">' +
        escapeHtml(s.name) +
        '</span><span class="lb-score">' +
        s.score +
        '/' +
        s.total +
        '</span></li>'
    )
    .join('');
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

function restart(): void {
  stopTimer();
  state = newQuiz();
  resultScreen.style.display = 'none';
  quizScreen.style.display = '';
  renderQuestion();
}

answerButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    if (state.phase !== 'question') return;
    handleAnswer(i, false);
  });
});

nextBtn.addEventListener('click', advance);

pauseBtn.addEventListener('click', () => {
  if (state.phase !== 'question') return;
  paused = !paused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
});

saveForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!savingEnabled) return;
  savingEnabled = false;
  saveScore(playerNameEl.value, state.score, total());
  saveForm.style.display = 'none';
  renderLeaderboard();
});

playAgainBtn.addEventListener('click', restart);

renderQuestion();
