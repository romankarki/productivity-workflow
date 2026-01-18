export interface Stopwatch {
  id: string;
  taskId: string;
  startTime: Date;
  endTime: Date | null;
  totalDuration: number; // milliseconds
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  laps: Lap[];
}

export interface Lap {
  id: string;
  stopwatchId: string;
  labelId: string | null;
  startTime: Date;
  endTime: Date;
  duration: number; // milliseconds
  createdAt: Date;
  label?: {
    id: string;
    name: string;
    color: string;
  } | null;
}

export interface CreateStopwatchInput {
  taskId: string;
}

export interface UpdateStopwatchInput {
  action: 'pause' | 'resume' | 'stop';
}

export interface CreateLapInput {
  labelId?: string;
}

export interface StopwatchWithTask extends Stopwatch {
  task: {
    id: string;
    title: string;
  };
}
