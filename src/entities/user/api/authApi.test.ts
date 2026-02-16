import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkEmailUnique, checkLoginUnique, loginUser, logoutUser, registerUser } from './authApi';
import { apiClient } from '@shared/api';

vi.mock('@shared/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@test.com', login: 'testuser' },
        token: 'token123',
      };
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse });

      const result = await registerUser({
        email: 'test@test.com',
        login: 'testuser',
        password: 'Password1!',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@test.com',
        login: 'testuser',
        password: 'Password1!',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('loginUser', () => {
    it('should login a user', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@test.com', login: 'testuser' },
        token: 'token123',
      };
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse });

      const result = await loginUser({ login: 'testuser', password: 'Password1!' });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        login: 'testuser',
        password: 'Password1!',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logoutUser', () => {
    it('should logout a user', async () => {
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await logoutUser();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('checkEmailUnique', () => {
    it('should return true if email is unique', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { isUnique: true } });

      const result = await checkEmailUnique('test@test.com');

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-email', {
        params: { email: 'test@test.com' },
      });
      expect(result).toBe(true);
    });

    it('should return false if email is not unique', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { isUnique: false } });

      const result = await checkEmailUnique('test@test.com');

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const result = await checkEmailUnique('test@test.com');

      expect(result).toBe(false);
    });
  });

  describe('checkLoginUnique', () => {
    it('should return true if login is unique', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { isUnique: true } });

      const result = await checkLoginUnique('testuser');

      expect(apiClient.get).toHaveBeenCalledWith('/auth/check-login', {
        params: { login: 'testuser' },
      });
      expect(result).toBe(true);
    });

    it('should return false if login is not unique', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { isUnique: false } });

      const result = await checkLoginUnique('testuser');

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const result = await checkLoginUnique('testuser');

      expect(result).toBe(false);
    });
  });
});
