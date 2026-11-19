export type Question = {
  id: number;
  text: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
};

export const QUESTIONS: ReadonlyArray<Question> = [
  { id: 1, text: 'How many players are on the field per team in a standard soccer match?', options: ['9', '10', '11', '12'], answer: 2 },
  { id: 2, text: 'What is the maximum duration of a standard professional soccer match (regulation time)?', options: ['60 minutes', '80 minutes', '90 minutes', '120 minutes'], answer: 2 },
  { id: 3, text: 'Which country has won the most FIFA World Cup titles?', options: ['Germany', 'Italy', 'Argentina', 'Brazil'], answer: 3 },
  { id: 4, text: 'What is the name of the kick used to start the game and after a goal is scored?', options: ['Goal kick', 'Kick-off', 'Corner kick', 'Throw-in'], answer: 1 },
  { id: 5, text: 'What colour card does a referee show to send a player off?', options: ['Yellow', 'Red', 'Green', 'Blue'], answer: 1 },
  { id: 6, text: 'How wide is a standard soccer goal?', options: ['7.32 m (24 ft)', '5.5 m (18 ft)', '10 m (33 ft)', '6 m (20 ft)'], answer: 0 },
  { id: 7, text: 'Which position is allowed to handle the ball inside the penalty area?', options: ['Defender', 'Midfielder', 'Goalkeeper', 'Striker'], answer: 2 },
  { id: 8, text: 'How many minutes are in extra time (each half) in most tournaments?', options: ['5', '10', '15', '20'], answer: 2 },
  { id: 9, text: 'What is it called when a player scores three goals in a single match?', options: ['Hat-trick', 'Triple', 'Three-peat', 'Perfect'], answer: 0 },
  { id: 10, text: 'Which of these is NOT a real soccer position?', options: ['Striker', 'Goalkeeper', 'Quarterback', 'Defender'], answer: 2 },
];

export const TIME_LIMIT_SECONDS = 15;
export const TOTAL_QUESTIONS = QUESTIONS.length;

export function shuffledIds(): number[] {
  const ids = QUESTIONS.map((q) => q.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const v = buf[0] ?? 0;
    const j = v % (i + 1);
    const a = ids[i];
    const b = ids[j];
    if (a === undefined || b === undefined) continue;
    ids[i] = b;
    ids[j] = a;
  }
  return ids;
}

export function getQuestion(id: number): Question {
  const q = QUESTIONS.find((x) => x.id === id);
  if (!q) throw new Error('unknown question id: ' + id);
  return q;
}
