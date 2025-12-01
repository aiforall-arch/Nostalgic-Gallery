export enum ViewState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  GALLERY = 'GALLERY',
  ADMIN = 'ADMIN',
}

export interface User {
  email?: string;
  phone?: string;
  isAuthenticated: boolean;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  title: string;
  date: string;
  description: string;
  aspectRatio: string;
}

export interface AuthState {
  step: 'INPUT' | 'OTP';
  method: 'email' | 'phone';
  value: string;
  loading: boolean;
  error: string | null;
}
