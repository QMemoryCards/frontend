import axios, { AxiosInstance, AxiosError } from 'axios';
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Создание экземпляра Axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Настройка interceptors
setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);

// Типы для ошибок API
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  code?: string;
}

// Тип для структуры ошибки ответа сервера
interface ApiErrorResponse {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// Утилита для обработки ошибок
export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    const data = error.response.data as ApiErrorResponse;
    // Сервер вернул ответ с ошибкой
    return {
      message: data?.message || 'Произошла ошибка',
      statusCode: error.response.status,
      errors: data?.errors,
      code: data?.code,
    };
  } else if (error.request) {
    // Запрос был отправлен, но ответа не получено
    return {
      message: 'Сервер не отвечает. Проверьте подключение к интернету.',
      statusCode: 0,
    };
  } else {
    // Ошибка при настройке запроса
    return {
      message: error.message || 'Неизвестная ошибка',
      statusCode: 0,
    };
  }
};

export default apiClient;
