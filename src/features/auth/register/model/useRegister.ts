import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import type { RegisterRequest } from '@entities/user';
import { registerUser } from '@entities/user';
import { handleApiError, setToken } from '@shared/api';
import { ROUTES } from '@shared/config';
import { validateEmail, validateLogin, validatePassword } from '@shared/lib/validation';

interface UseRegisterReturn {
  register: (data: RegisterRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const emailValidation = validateEmail(data.email);
      if (!emailValidation.isValid) {
        const validationError = emailValidation.error || 'Неверный формат email';
        setError(validationError);
        return;
      }

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

      const response = await registerUser(data);

      setToken(response.token);

      navigate(ROUTES.LOGIN);
    } catch (err: unknown) {
      const apiError = handleApiError(err as AxiosError);

      // Формируем понятное сообщение об ошибке
      let errorMessage = 'Ошибка регистрации';

      if (apiError.code === 'email_conflict') {
        errorMessage = 'Данный email уже занят';
      } else if (apiError.code === 'login_conflict') {
        errorMessage = 'Данный логин уже занят';
      } else if (apiError.statusCode === 400) {
        errorMessage = apiError.message || 'Неверные данные для регистрации';
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

  return { register, isLoading, error };
};
