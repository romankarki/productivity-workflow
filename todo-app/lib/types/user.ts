export interface User {
  id: string;
  username: string;
  githubUsername: string | null;
  leetcodeUsername: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  username: string;
}

export interface UpdateUserInput {
  username?: string;
  githubUsername?: string | null;
  leetcodeUsername?: string | null;
}
