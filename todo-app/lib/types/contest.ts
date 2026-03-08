export interface Contest {
  id: string;
  userId: string;
  contestName: string;
  date: string;
  rank: number | null;
  score: number | null;
  ratingBefore: number | null;
  ratingAfter: number | null;
  problemsSolved: number | null;
  totalProblems: number | null;
  finishTime: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContestInput {
  contestName: string;
  date: string;
  rank?: number | null;
  score?: number | null;
  ratingBefore?: number | null;
  ratingAfter?: number | null;
  problemsSolved?: number | null;
  totalProblems?: number | null;
  finishTime?: string | null;
  notes?: string | null;
}

export interface UpdateContestInput {
  contestName?: string;
  date?: string;
  rank?: number | null;
  score?: number | null;
  ratingBefore?: number | null;
  ratingAfter?: number | null;
  problemsSolved?: number | null;
  totalProblems?: number | null;
  finishTime?: string | null;
  notes?: string | null;
}
