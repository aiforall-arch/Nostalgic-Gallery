export enum ViewState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  GALLERY = 'GALLERY',
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
  description: string; // Used for AI context
  aspectRatio: string; // Tailwind class
}

export interface AuthState {
  step: 'INPUT' | 'OTP';
  method: 'email' | 'phone';
  value: string;
  loading: boolean;
  error: string | null;
}
