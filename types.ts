
export interface Question {
  id: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  answer: number;
}

export interface ExamData {
  id: string;
  examName: string;
  timeLimitMinutes: number;
  questions: Question[];
  icon: string;
  color: string;
  timerEnabled?: boolean;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number | null;
  isCorrect: boolean;
}

export enum AppState {
  SELECTION = 'SELECTION',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS'
}
