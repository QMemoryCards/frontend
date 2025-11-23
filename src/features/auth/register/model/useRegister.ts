import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '@entities/user';
import type { RegisterRequest } from '@entities/user';
import { setToken } from '@shared/api';
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
        throw new Error(emailValidation.error);
      }

      const loginValidation = validateLogin(data.login);
      if (!loginValidation.isValid) {
        throw new Error(loginValidation.error);
      }

      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.error);
      }

      // const [emailUnique, loginUnique] = await Promise.all([
      //   checkEmailUnique(data.email),
      //   checkLoginUnique(data.login),
      // ]);

      // if (!emailUnique) {
      //   alert()
      //   throw new Error('Пользователь с таким email уже существует');
      // }
      //
      // if (!loginUnique) {
      //   throw new Error('Пользователь с таким логином уже существует');
      // }

      // alert("sending post")
      const response = await registerUser(data);

      setToken(response.token);

      navigate(ROUTES.LOGIN);
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        (err as Error).message ||
        'Ошибка регистрации';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};
