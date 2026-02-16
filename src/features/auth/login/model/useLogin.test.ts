import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLogin } from './useLogin';
import * as userApi from '@entities/user';
import * as sharedApi from '@shared/api';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@entities/user', () => ({
  loginUser: vi.fn(),
}));

vi.mock('@shared/api', () => ({
  setToken: vi.fn(),
  handleApiError: vi.fn(error => ({
    message: error.message || 'Error',
    statusCode: error.response?.status ?? 0,
    code: error.code || '',
  })),
}));

vi.mock('@shared/config', () => ({
  ROUTES: {
    DECKS: '/decks',
  },
}));

vi.mock('@shared/lib/validation', () => ({
  validateLogin: vi.fn((login: string) => ({
    isValid: login.length >= 3,
    error: login.length < 3 ? 'Login too short' : null,
  })),
  validatePassword: vi.fn((password: string) => ({
    isValid: password.length >= 6,
    error: password.length < 6 ? 'Password too short' : null,
  })),
}));

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login successfully', async () => {
    (userApi.loginUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      token: 'test-token-123',
    });

    const { result } = renderHook(() => useLogin());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    await waitFor(async () => {
      await result.current.login({ login: 'testuser', password: 'password123' });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(sharedApi.setToken).toHaveBeenCalledWith('test-token-123');
    expect(mockNavigate).toHaveBeenCalledWith('/decks');
    expect(result.current.error).toBeNull();
  });

  it('should handle login validation error', async () => {
    const { result } = renderHook(() => useLogin());

    await waitFor(async () => {
      await result.current.login({ login: 'ab', password: 'password123' });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Login too short');
      expect(result.current.isLoading).toBe(false);
    });

    expect(userApi.loginUser).not.toHaveBeenCalled();
  });

  it('should handle password validation error', async () => {
    const { result } = renderHook(() => useLogin());

    await waitFor(async () => {
      await result.current.login({ login: 'testuser', password: '123' });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Password too short');
      expect(result.current.isLoading).toBe(false);
    });

    expect(userApi.loginUser).not.toHaveBeenCalled();
  });

  it('should handle 401 unauthorized error', async () => {
    (userApi.loginUser as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { status: 401 },
      message: 'Unauthorized',
    });

    const { result } = renderHook(() => useLogin());

    await waitFor(async () => {
      await result.current.login({ login: 'testuser', password: 'wrongpassword' });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Неверный логин или пароль');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle 400 bad request error', async () => {
    (userApi.loginUser as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { status: 400 },
      message: 'Invalid request',
    });

    const { result } = renderHook(() => useLogin());

    await waitFor(async () => {
      await result.current.login({ login: 'testuser', password: 'password123' });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Invalid request');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle network error', async () => {
    (userApi.loginUser as ReturnType<typeof vi.fn>).mockRejectedValue({
      message: 'Network error',
    });

    const { result } = renderHook(() => useLogin());

    await waitFor(async () => {
      await result.current.login({ login: 'testuser', password: 'password123' });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Сервер недоступен. Проверьте подключение к интернету');
    });
  });

  it('should clear error on new login attempt', async () => {
    const { result } = renderHook(() => useLogin());

    // First attempt - should fail
    (userApi.loginUser as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      response: { status: 401 },
    });

    await waitFor(async () => {
      await result.current.login({ login: 'testuser', password: 'password123' });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Неверный логин или пароль');
    });

    // Second attempt - should clear error and succeed
    (userApi.loginUser as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ token: 'new-token' });

    await waitFor(async () => {
      await result.current.login({ login: 'testuser', password: 'password123' });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
