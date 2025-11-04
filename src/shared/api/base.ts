import axios, { AxiosInstance, AxiosError } from 'axios';

// Базовая конфигурация
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Создание экземпляра Axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Типы для ошибок API
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Утилита для обработки ошибок
export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Сервер вернул ответ с ошибкой
    return {
      message: error.response.data?.message || 'Произошла ошибка',
      statusCode: error.response.status,
      errors: error.response.data?.errors,
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
