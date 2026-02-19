import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import type { LoginRequest } from '@entities/user';
import { loginUser } from '@entities/user';
import { handleApiError, setToken } from '@shared/api';
import { ROUTES } from '@shared/config';
import { validateLogin, validatePassword } from '@shared/lib/validation';

interface UseLoginReturn {
  login: (data: LoginRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Хук для входа пользователя
 * Согласно п. 4 Функциональных требований
 */
export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const loginValidation = validateLogin(data.login);
      if (!loginValidation.isValid) {
        const validationError = loginValidation.error || 'Неверный формат логина';
        setError(validationError);
        return;
      }

      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        const validationError = passwordValidation.error || 'Неверный формат пароля';
        setError(validationError);
        return;
      }

      const response = await loginUser(data);

      setToken(response.token);

      navigate(ROUTES.DECKS);
    } catch (err: unknown) {
      const apiError = handleApiError(err as AxiosError);

      // Формируем понятное сообщение об ошибке
      let errorMessage = 'Ошибка входа';

      if (apiError.statusCode === 401) {
        errorMessage = 'Неверный логин или пароль';
      } else if (apiError.statusCode === 400) {
        errorMessage = apiError.message || 'Неверные данные для входа';
      } else if (apiError.statusCode === 0) {
        errorMessage = 'Сервер недоступен. Проверьте подключение к интернету';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);

      // НЕ бросаем ошибку дальше, чтобы избежать необработанного исключения
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
