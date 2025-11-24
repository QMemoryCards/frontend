/**
 * Типы для работы с пользователем
 */

export interface User {
  id: string;
  email: string;
  login: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  login: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: {
    email?: string[];
    login?: string[];
    password?: string[];
  };
}

export interface UpdateUserRequest {
  email?: string;
  login?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
