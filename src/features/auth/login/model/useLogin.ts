import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@entities/user';
import type { LoginRequest } from '@entities/user';
import { setToken } from '@shared/api';
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
        throw new Error(loginValidation.error);
      }

      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.error);
      }

      const response = await loginUser(data);

      setToken(response.token);

      navigate(ROUTES.DECKS);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка входа';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
