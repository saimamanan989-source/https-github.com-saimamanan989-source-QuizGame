export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizConfig {
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
}

export type GameState = 'SETUP' | 'LOADING' | 'PLAYING' | 'FINISHED' | 'ERROR';

export interface UserAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
}