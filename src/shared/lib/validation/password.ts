/**
 * Валидация пароля согласно п. 3.2.3-3.2.4 Функциональных требований
 * 8-64 символа, минимум 1 заглавная, 1 строчная, 1 цифра, 1 спецсимвол
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Пароль обязателен для заполнения' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Пароль должен содержать минимум 8 символов' };
  }

  if (password.length > 64) {
    return { isValid: false, error: 'Пароль должен содержать максимум 64 символа' };
  }

  // Проверка на наличие заглавной буквы
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Пароль должен содержать минимум одну заглавную букву' };
  }

  // Проверка на наличие строчной буквы
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Пароль должен содержать минимум одну строчную букву' };
  }

  // Проверка на наличие цифры
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Пароль должен содержать минимум одну цифру' };
  }

  // Проверка на наличие спецсимвола
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false, error: 'Пароль должен содержать минимум один спецсимвол' };
  }

  // Проверка на допустимые символы: латиница, цифры, спецсимволы
  const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      error: 'Пароль содержит недопустимые символы',
    };
  }

  return { isValid: true };
};

/**
 * Получить требования к паролю для отображения пользователю
 */
export const getPasswordRequirements = (): string[] => {
  return [
    'Минимум 8 символов',
    'Максимум 64 символа',
    'Минимум 1 заглавная буква (A-Z)',
    'Минимум 1 строчная буква (a-z)',
    'Минимум 1 цифра (0-9)',
    'Минимум 1 спецсимвол (!@#$%^&* и т.д.)',
  ];
};
