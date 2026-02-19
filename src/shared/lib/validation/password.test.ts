import { describe, expect, it } from 'vitest';
import { getPasswordRequirements, validatePassword } from './password';

describe('validatePassword', () => {
  it('should return error for empty password', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Пароль обязателен для заполнения');
  });

  it('should return error for whitespace-only password', () => {
    const result = validatePassword('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Пароль обязателен для заполнения');
  });

  it('should return error for password too short', () => {
    const result = validatePassword('Pass1!');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Пароль должен содержать минимум 8 символов');
  });

  it('should return error for password too long', () => {
    const longPassword = 'A'.repeat(30) + 'a'.repeat(30) + '1234!';
    const result = validatePassword(longPassword);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Пароль должен содержать максимум 64 символа');
  });

  it('should return error for password without uppercase letter', () => {
    const result = validatePassword('password1!');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Пароль должен содержать минимум одну заглавную букву');
  });

  it('should return error for password without lowercase letter', () => {
    const result = validatePassword('PASSWORD1!');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Пароль должен содержать минимум одну строчную букву');
  });

  it('should return error for password without digit', () => {
    const result = validatePassword('Password!');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Пароль должен содержать минимум одну цифру');
  });

  it('should return error for password without special character', () => {
    const result = validatePassword('Password1');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Пароль должен содержать минимум один спецсимвол');
  });

  it('should return error for password with cyrillic characters', () => {
    const result = validatePassword('Пароль1!aA');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Пароль содержит недопустимые символы');
  });

  it('should accept valid password with minimum length', () => {
    const result = validatePassword('Pass1234!');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid password with maximum length', () => {
    const maxPassword = 'A'.repeat(30) + 'a'.repeat(30) + '123!';
    const result = validatePassword(maxPassword);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid password with exclamation mark', () => {
    const result = validatePassword('Password123!');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid password with at sign', () => {
    const result = validatePassword('Password123@');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid password with hash', () => {
    const result = validatePassword('Password123#');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid password with dollar sign', () => {
    const result = validatePassword('Password123$');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid password with multiple special characters', () => {
    const result = validatePassword('Pass!@#$%123');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});

describe('getPasswordRequirements', () => {
  it('should return array of password requirements', () => {
    const requirements = getPasswordRequirements();
    expect(requirements).toHaveLength(6);
    expect(requirements).toContain('Минимум 8 символов');
    expect(requirements).toContain('Максимум 64 символа');
    expect(requirements).toContain('Минимум 1 заглавная буква (A-Z)');
    expect(requirements).toContain('Минимум 1 строчная буква (a-z)');
    expect(requirements).toContain('Минимум 1 цифра (0-9)');
    expect(requirements).toContain('Минимум 1 спецсимвол (!@#$%^&* и т.д.)');
  });
});
