import { apiClient } from '@shared/api';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../model/types';

/**
 * Регистрация нового пользователя
 * POST /api/auth/register
 */
export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/auth/register', data);
  return response.data;
};

/**
 * Вход пользователя
 * POST /api/auth/login
 */
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', data);
  return response.data;
};

/**
 * Выход пользователя
 * POST /api/auth/logout
 */
export const logoutUser = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

/**
 * Проверка уникальности email
 * Согласно п. 3.2.6 Функциональных требований
 */
export const checkEmailUnique = async (email: string): Promise<boolean> => {
  try {
    const response = await apiClient.get(`/auth/check-email`, { params: { email } });
    return response.data.isUnique;
  } catch {
    return false;
  }
};

/**
 * Проверка уникальности login
 * Согласно п. 3.2.7 Функциональных требований
 */
export const checkLoginUnique = async (login: string): Promise<boolean> => {
  try {
    const response = await apiClient.get(`/auth/check-login`, { params: { login } });
    return response.data.isUnique;
  } catch {
    return false;
  }
};
