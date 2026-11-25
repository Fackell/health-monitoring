export type ActivityType =
  'WALKING' | 'RUNNING' | 'CYCLING' | 'SWIMMING' | 'STRENGTH_TRAINING' | 'OTHER';

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  durationMinutes: number;
  distanceKm: number | null;
  caloriesBurned: number | null;
  notes: string | null;
  startedAt: string;
  createdAt: string;
}

export interface CreateActivityData {
  type: ActivityType;
  durationMinutes: number;
  distanceKm?: number | null;
  caloriesBurned?: number | null;
  notes?: string | null;
  startedAt: string;
}

export type UpdateActivityData = Partial<CreateActivityData>;
