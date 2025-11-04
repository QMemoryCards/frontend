/**
 * Валидация логина согласно п. 3.2.2 Функциональных требований
 * 3-64 символа, латиница (A-Z, a-z), цифры (0-9), спецсимволы (-._)
 */
export const validateLogin = (login: string): { isValid: boolean; error?: string } => {
  if (!login || login.trim() === '') {
    return { isValid: false, error: 'Логин обязателен для заполнения' };
  }

  if (login.length < 3) {
    return { isValid: false, error: 'Логин должен содержать минимум 3 символа' };
  }

  if (login.length > 64) {
    return { isValid: false, error: 'Логин должен содержать максимум 64 символа' };
  }

  // Проверка на допустимые символы: латиница, цифры, спецсимволы -._
  const loginRegex = /^[A-Za-z0-9\-._]+$/;
  if (!loginRegex.test(login)) {
    return {
      isValid: false,
      error: 'Логин может содержать только латиницу, цифры и символы -._',
    };
  }

  return { isValid: true };
};
