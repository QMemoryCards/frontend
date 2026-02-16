import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getToken,
  removeToken,
  setToken,
  setupRequestInterceptor,
  setupResponseInterceptor,
} from './interceptors';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const originalLocation = window.location;

describe('interceptors', () => {
  const TOKEN_KEY = 'auth_token';
  let mockLocation: { href: string };

  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    vi.clearAllMocks();

    mockLocation = { href: '' };

    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  describe('token management', () => {
    describe('getToken', () => {
      it('should return null when no token exists', () => {
        expect(getToken()).toBeNull();
        expect(localStorageMock.getItem).toHaveBeenCalledWith(TOKEN_KEY);
      });

      it('should return token when it exists', () => {
        const token = 'test-token';
        localStorageMock.setItem(TOKEN_KEY, token);
        expect(getToken()).toBe(token);
      });
    });

    describe('setToken', () => {
      it('should store token in localStorage', () => {
        const token = 'new-token';
        setToken(token);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(TOKEN_KEY, token);
      });
    });

    describe('removeToken', () => {
      it('should remove token from localStorage', () => {
        removeToken();
        expect(localStorageMock.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
      });
    });
  });

  describe('setupRequestInterceptor', () => {
    let mockInstance: AxiosInstance;
    let requestInterceptor: {
      fulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
      rejected: (error: AxiosError) => Promise<never>;
    };

    beforeEach(() => {
      mockInstance = {
        interceptors: {
          request: {
            use: vi.fn((fulfilled, rejected) => {
              requestInterceptor = { fulfilled, rejected };
            }),
          },
        },
      } as unknown as AxiosInstance;

      setupRequestInterceptor(mockInstance);
    });

    it('should add Authorization header if token exists', () => {
      const token = 'test-token';
      localStorageMock.setItem(TOKEN_KEY, token);
      const config = { headers: {} } as InternalAxiosRequestConfig;

      const result = requestInterceptor.fulfilled(config);
      expect(result.headers?.Authorization).toBe(`Bearer ${token}`);
    });

    it('should not add Authorization header if token does not exist', () => {
      const config = { headers: {} } as InternalAxiosRequestConfig;
      const result = requestInterceptor.fulfilled(config);
      expect(result.headers?.Authorization).toBeUndefined();
    });

    it('should reject error in request interceptor', async () => {
      const error = new Error('Request error') as AxiosError;
      await expect(requestInterceptor.rejected(error)).rejects.toThrow('Request error');
    });
  });

  describe('setupResponseInterceptor', () => {
    let mockInstance: AxiosInstance;
    let responseInterceptor: {
      fulfilled: (response: AxiosResponse) => AxiosResponse;
      rejected: (error: AxiosError) => Promise<never>;
    };

    beforeEach(() => {
      mockInstance = {
        interceptors: {
          response: {
            use: vi.fn((fulfilled, rejected) => {
              responseInterceptor = { fulfilled, rejected };
            }),
          },
        },
      } as unknown as AxiosInstance;

      setupResponseInterceptor(mockInstance);
    });

    it('should return response on success', () => {
      const response = { data: {} } as AxiosResponse;
      const result = responseInterceptor.fulfilled(response);
      expect(result).toBe(response);
    });

    describe('401 Unauthorized', () => {
      it('should remove token and redirect to login for non-auth endpoints', async () => {
        const error = {
          response: { status: 401 },
          config: { url: '/api/decks' },
        } as AxiosError;

        await expect(responseInterceptor.rejected(error)).rejects.toBe(error);
        expect(localStorageMock.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
        expect(mockLocation.href).toBe('/login');
      });

      it('should NOT remove token or redirect for login endpoint', async () => {
        const error = {
          response: { status: 401 },
          config: { url: '/auth/login' },
        } as AxiosError;

        await expect(responseInterceptor.rejected(error)).rejects.toBe(error);
        expect(localStorageMock.removeItem).not.toHaveBeenCalled();
        expect(mockLocation.href).toBe('');
      });

      it('should NOT remove token or redirect for register endpoint', async () => {
        const error = {
          response: { status: 401 },
          config: { url: '/auth/register' },
        } as AxiosError;

        await expect(responseInterceptor.rejected(error)).rejects.toBe(error);
        expect(localStorageMock.removeItem).not.toHaveBeenCalled();
        expect(mockLocation.href).toBe('');
      });
    });

    describe('403 Forbidden', () => {
      it('should remove token and redirect to login for non-password-change endpoints', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const error = {
          response: { status: 403 },
          config: { url: '/api/decks' },
        } as AxiosError;

        try {
          await expect(responseInterceptor.rejected(error)).rejects.toBe(error);
        } finally {
          consoleSpy.mockRestore();
        }

        expect(localStorageMock.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
        expect(mockLocation.href).toBe('/login');
      });

      it('should NOT remove token or redirect for password change endpoint', async () => {
        const error = {
          response: { status: 403 },
          config: { url: '/users/me/password' },
        } as AxiosError;

        await expect(responseInterceptor.rejected(error)).rejects.toBe(error);
        expect(localStorageMock.removeItem).not.toHaveBeenCalled();
        expect(mockLocation.href).toBe('');
      });
    });

    it('should not handle other status codes', async () => {
      const error = {
        response: { status: 500 },
        config: { url: '/api/decks' },
      } as AxiosError;

      await expect(responseInterceptor.rejected(error)).rejects.toBe(error);
      expect(localStorageMock.removeItem).not.toHaveBeenCalled();
      expect(mockLocation.href).toBe('');
    });

    it('should handle error without response (network error)', async () => {
      const error = { config: { url: '/api/decks' } } as AxiosError;
      await expect(responseInterceptor.rejected(error)).rejects.toBe(error);
      expect(localStorageMock.removeItem).not.toHaveBeenCalled();
      expect(mockLocation.href).toBe('');
    });
  });
});
