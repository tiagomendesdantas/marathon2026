export type Phase = 'base' | 'endurance' | 'peak' | 'taper';

export type WorkoutType = 'rest' | 'easy' | 'long' | 'tempo' | 'intervals' | 'recovery' | 'race';

export interface Workout {
  dayOfWeek: number;
  date: string;
  type: WorkoutType;
  distanceKm: number | null;
  description: string;
  paceGuidance: string;
}

export interface TrainingWeek {
  weekNumber: number;
  phase: Phase;
  phaseLabel: string;
  totalDistanceKm: number;
  workouts: Workout[];
}

export interface TrainingPlan {
  startDate: string;
  weeks: TrainingWeek[];
}

export interface RunLog {
  date: string;
  actualDistanceKm: number;
  actualTimeMinutes: number;
  feeling: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export interface AppState {
  logs: Record<string, RunLog>;
  planStartDate: string;
}
