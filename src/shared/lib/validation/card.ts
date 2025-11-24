import { VALIDATION } from '@shared/config';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateCardQuestion = (question: string): ValidationResult => {
  if (!question || question.trim().length === 0) {
    return {
      isValid: false,
      error: 'Вопрос не может быть пустым',
    };
  }

  if (question.length > VALIDATION.CARD.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Вопрос не должен превышать ${VALIDATION.CARD.MAX_LENGTH} символов`,
    };
  }

  return { isValid: true };
};

export const validateCardAnswer = (answer: string): ValidationResult => {
  if (!answer || answer.trim().length === 0) {
    return {
      isValid: false,
      error: 'Ответ не может быть пустым',
    };
  }

  if (answer.length > VALIDATION.CARD.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Ответ не должен превышать ${VALIDATION.CARD.MAX_LENGTH} символов`,
    };
  }

  return { isValid: true };
};
