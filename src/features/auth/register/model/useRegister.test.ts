import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRegister } from './useRegister';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@entities/user', () => ({
  registerUser: vi.fn(),
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
    LOGIN: '/login',
  },
}));

vi.mock('@shared/lib/validation', () => ({
  validateEmail: vi.fn((email: string) => ({
    isValid: email.includes('@'),
    error: !email.includes('@') ? 'Invalid email' : null,
  })),
  validateLogin: vi.fn((login: string) => ({
    isValid: login.length >= 3,
    error: login.length < 3 ? 'Login too short' : null,
  })),
  validatePassword: vi.fn((password: string) => ({
    isValid: password.length >= 6,
    error: password.length < 6 ? 'Password too short' : null,
  })),
}));

import * as userApi from '@entities/user';
import * as sharedApi from '@shared/api';

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register successfully', async () => {
    (userApi.registerUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      token: 'test-token-123',
    });

    const { result } = renderHook(() => useRegister());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    await waitFor(async () => {
      await result.current.register({
        email: 'test@example.com',
        login: 'testuser',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(sharedApi.setToken).toHaveBeenCalledWith('test-token-123');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(result.current.error).toBeNull();
  });

  it('should handle email validation error', async () => {
    const { result } = renderHook(() => useRegister());

    await waitFor(async () => {
      await result.current.register({
        email: 'invalid-email',
        login: 'testuser',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Invalid email');
      expect(result.current.isLoading).toBe(false);
    });

    expect(userApi.registerUser).not.toHaveBeenCalled();
  });

  it('should handle login validation error', async () => {
    const { result } = renderHook(() => useRegister());

    await waitFor(async () => {
      await result.current.register({
        email: 'test@example.com',
        login: 'ab',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Login too short');
      expect(result.current.isLoading).toBe(false);
    });

    expect(userApi.registerUser).not.toHaveBeenCalled();
  });

  it('should handle password validation error', async () => {
    const { result } = renderHook(() => useRegister());

    await waitFor(async () => {
      await result.current.register({
        email: 'test@example.com',
        login: 'testuser',
        password: '123',
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Password too short');
      expect(result.current.isLoading).toBe(false);
    });

    expect(userApi.registerUser).not.toHaveBeenCalled();
  });

  it('should handle email conflict error', async () => {
    (userApi.registerUser as ReturnType<typeof vi.fn>).mockRejectedValue({
      code: 'email_conflict',
      response: { status: 409 },
    });

    const { result } = renderHook(() => useRegister());

    await waitFor(async () => {
      await result.current.register({
        email: 'existing@example.com',
        login: 'testuser',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Данный email уже занят');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle login conflict error', async () => {
    (userApi.registerUser as ReturnType<typeof vi.fn>).mockRejectedValue({
      code: 'login_conflict',
      response: { status: 409 },
    });

    const { result } = renderHook(() => useRegister());

    await waitFor(async () => {
      await result.current.register({
        email: 'test@example.com',
        login: 'existinguser',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Данный логин уже занят');
    });
  });

  it('should handle 400 bad request error', async () => {
    (userApi.registerUser as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { status: 400 },
      message: 'Invalid data',
    });

    const { result } = renderHook(() => useRegister());

    await waitFor(async () => {
      await result.current.register({
        email: 'test@example.com',
        login: 'testuser',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Invalid data');
    });
  });

  it('should handle network error', async () => {
    (userApi.registerUser as ReturnType<typeof vi.fn>).mockRejectedValue({
      message: 'Network error',
    });

    const { result } = renderHook(() => useRegister());

    await waitFor(async () => {
      await result.current.register({
        email: 'test@example.com',
        login: 'testuser',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Сервер недоступен. Проверьте подключение к интернету');
    });
  });

  it('should clear error on new registration attempt', async () => {
    (userApi.registerUser as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce({
        code: 'email_conflict',
      })
      .mockResolvedValueOnce({ token: 'new-token' });

    const { result } = renderHook(() => useRegister());

    // First attempt - should fail
    await waitFor(async () => {
      await result.current.register({
        email: 'existing@example.com',
        login: 'testuser',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    // Second attempt - should clear error
    await waitFor(async () => {
      await result.current.register({
        email: 'new@example.com',
        login: 'testuser',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});
