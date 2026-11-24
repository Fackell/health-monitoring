export interface Activity {
  id: string;
  userId: string;
  type: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityData {
  type: string;
  duration: number;
}
