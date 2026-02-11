import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getToken,
  setToken,
  removeToken,
  setupRequestInterceptor,
  setupResponseInterceptor,
} from './interceptors';
import type { AxiosInstance } from 'axios';

describe('interceptors - token management', () => {
  const TOKEN_KEY = 'auth_token';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getToken', () => {
    it('should return null when no token exists', () => {
      const token = getToken();
      expect(localStorage.getItem).toHaveBeenCalledWith(TOKEN_KEY);
    });

    it('should return token when it exists', () => {
      const mockToken = 'test-token-123';
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(mockToken);

      const token = getToken();
      expect(token).toBe(mockToken);
      expect(localStorage.getItem).toHaveBeenCalledWith(TOKEN_KEY);
    });
  });

  describe('setToken', () => {
    it('should store token in localStorage', () => {
      const mockToken = 'test-token-456';
      setToken(mockToken);

      expect(localStorage.setItem).toHaveBeenCalledWith(TOKEN_KEY, mockToken);
    });

    it('should overwrite existing token', () => {
      const firstToken = 'first-token';
      const secondToken = 'second-token';

      setToken(firstToken);
      setToken(secondToken);

      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(localStorage.setItem).toHaveBeenLastCalledWith(TOKEN_KEY, secondToken);
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      removeToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
    });

    it('should remove existing token', () => {
      setToken('some-token');
      removeToken();

      expect(localStorage.setItem).toHaveBeenCalledWith(TOKEN_KEY, 'some-token');
      expect(localStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
    });
  });

  describe('setupRequestInterceptor', () => {
    it('should setup request interceptor', () => {
      const mockInstance = {
        interceptors: {
          request: {
            use: vi.fn(),
          },
        },
      } as unknown as AxiosInstance;

      setupRequestInterceptor(mockInstance);
      expect(mockInstance.interceptors.request.use).toHaveBeenCalled();
    });
  });

  describe('setupResponseInterceptor', () => {
    it('should setup response interceptor', () => {
      const mockInstance = {
        interceptors: {
          response: {
            use: vi.fn(),
          },
        },
      } as unknown as AxiosInstance;

      setupResponseInterceptor(mockInstance);
      expect(mockInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });
});
