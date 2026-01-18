export interface Task {
  id: string;
  taskListId: string;
  title: string;
  description: string | null;
  completed: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  labels?: TaskLabel[];
}

export interface TaskList {
  id: string;
  userId: string;
  date: Date;
  weeklyGoal: number | null;
  monthlyGoal: number | null;
  createdAt: Date;
  updatedAt: Date;
  tasks?: Task[];
  _count?: {
    tasks: number;
  };
}

export interface TaskLabel {
  id: string;
  taskId: string;
  labelId: string;
  label?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface CreateTaskListInput {
  date: string;
  weeklyGoal?: number;
  monthlyGoal?: number;
}

export interface UpdateTaskListInput {
  weeklyGoal?: number;
  monthlyGoal?: number;
}
