export type OperationType = '+' | '-' | '×' | '÷';

export interface MathProblem {
  num1: number;
  num2: number;
  operation: OperationType;
  answer: number;
  options: number[];
}

export interface GameState {
  score: number;
  level: number; // 1, 2, or 3
  lives: number;
  progress: number; // Number of correct answers in current race
  isPlaying: boolean;
  isGameOver: boolean;
  isVictory: boolean; // New state for winning
  selectedOperations: OperationType[];
  currentProblem: MathProblem | null;
  lastAnswerCorrect: boolean | null; // null = waiting, true = correct, false = wrong
}

export const LEVELS = {
  1: { label: 'Fácil', range: 10, mulRange: 5, color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  2: { label: 'Medio', range: 50, mulRange: 10, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200' },
  3: { label: 'Difícil', range: 100, mulRange: 12, color: 'text-rose-500', bg: 'bg-rose-100', border: 'border-rose-200' },
};

export const GOAL_SCORE = 10; // Number of correct answers to reach the finish line