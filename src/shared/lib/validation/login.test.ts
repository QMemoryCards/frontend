import { describe, expect, it } from 'vitest';
import { validateLogin } from './login';

describe('validateLogin', () => {
  it('should return error for empty login', () => {
    const result = validateLogin('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Логин обязателен для заполнения');
  });

  it('should return error for whitespace-only login', () => {
    const result = validateLogin('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Логин обязателен для заполнения');
  });

  it('should return error for login too short', () => {
    const result = validateLogin('ab');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Логин должен содержать минимум 3 символа');
  });

  it('should return error for login too long', () => {
    const longLogin = 'a'.repeat(65);
    const result = validateLogin(longLogin);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Логин должен содержать максимум 64 символа');
  });

  it('should return error for login with cyrillic characters', () => {
    const result = validateLogin('пользователь');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Логин может содержать только латиницу, цифры и символы -._');
  });

  it('should return error for login with spaces', () => {
    const result = validateLogin('user name');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Логин может содержать только латиницу, цифры и символы -._');
  });

  it('should return error for login with special characters', () => {
    const result = validateLogin('user@name');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Логин может содержать только латиницу, цифры и символы -._');
  });

  it('should accept valid login with minimum length', () => {
    const result = validateLogin('abc');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid login with maximum length', () => {
    const maxLogin = 'a'.repeat(64);
    const result = validateLogin(maxLogin);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid login with letters and numbers', () => {
    const result = validateLogin('user123');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid login with hyphen', () => {
    const result = validateLogin('user-name');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid login with dot', () => {
    const result = validateLogin('user.name');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid login with underscore', () => {
    const result = validateLogin('user_name');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid login with all allowed special characters', () => {
    const result = validateLogin('user-name_123.test');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
