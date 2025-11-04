import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const TOKEN_KEY = 'auth_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Request interceptor - добавление токена к каждому запросу
export const setupRequestInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
};

// Response interceptor - обработка ошибок авторизации
export const setupResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Если токен истек или невалиден
      if (error.response?.status === 401) {
        removeToken();
        // Редирект на страницу входа
        window.location.href = '/';
      }

      if (error.response?.status === 403) {
        console.error('Access denied');
      }

      return Promise.reject(error);
    }
  );
};
