export interface User {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  username: string;
}

export interface UpdateUserInput {
  username: string;
}
