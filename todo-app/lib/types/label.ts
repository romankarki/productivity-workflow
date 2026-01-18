export interface Label {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
}

export interface CreateLabelInput {
  name: string;
  color: string;
}

export interface UpdateLabelInput {
  name?: string;
  color?: string;
}
