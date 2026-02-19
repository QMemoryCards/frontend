import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validateCardAnswer, validateCardQuestion } from './card';

vi.mock('@shared/config', () => ({
  VALIDATION: {
    CARD: {
      MAX_LENGTH: 200,
      MAX_CARDS: 30,
    },
  },
}));

describe('validateCardQuestion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error for empty question', () => {
    const result = validateCardQuestion('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Вопрос не может быть пустым');
  });

  it('should return error for whitespace-only question', () => {
    const result = validateCardQuestion('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Вопрос не может быть пустым');
  });

  it('should return error for question too long', () => {
    const longQuestion = 'a'.repeat(201);
    const result = validateCardQuestion(longQuestion);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Вопрос не должен превышать 200 символов');
  });

  it('should accept valid question with minimum length', () => {
    const result = validateCardQuestion('a');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid question with maximum length', () => {
    const maxQuestion = 'a'.repeat(200);
    const result = validateCardQuestion(maxQuestion);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid question with text', () => {
    const result = validateCardQuestion('What is the capital of France?');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept question with special characters', () => {
    const result = validateCardQuestion('What is 2+2?');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});

describe('validateCardAnswer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error for empty answer', () => {
    const result = validateCardAnswer('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Ответ не может быть пустым');
  });

  it('should return error for whitespace-only answer', () => {
    const result = validateCardAnswer('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Ответ не может быть пустым');
  });

  it('should return error for answer too long', () => {
    const longAnswer = 'a'.repeat(201);
    const result = validateCardAnswer(longAnswer);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Ответ не должен превышать 200 символов');
  });

  it('should accept valid answer with minimum length', () => {
    const result = validateCardAnswer('a');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid answer with maximum length', () => {
    const maxAnswer = 'a'.repeat(200);
    const result = validateCardAnswer(maxAnswer);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid answer with text', () => {
    const result = validateCardAnswer('Paris');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept answer with special characters', () => {
    const result = validateCardAnswer('The answer is 4!');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
