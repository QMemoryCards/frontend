export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateDeckName = (name: string): ValidationResult => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      isValid: false,
      error: 'Название колоды обязательно',
    };
  }

  if (trimmedName.length > 90) {
    return {
      isValid: false,
      error: 'Название не должно превышать 90 символов',
    };
  }

  return { isValid: true };
};

export const validateDeckDescription = (description: string): ValidationResult => {
  if (description.length > 200) {
    return {
      isValid: false,
      error: 'Описание не должно превышать 200 символов',
    };
  }

  return { isValid: true };
};
