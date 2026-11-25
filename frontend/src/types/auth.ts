import type { User } from './user';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  fullName: string;
}

export interface AuthResponse {
  status: 'success';
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}
