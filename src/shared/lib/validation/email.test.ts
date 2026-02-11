import { describe, it, expect } from 'vitest';
import { validateEmail } from './email';

describe('validateEmail', () => {
  it('should return error for empty email', () => {
    const result = validateEmail('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Email обязателен для заполнения');
  });

  it('should return error for whitespace-only email', () => {
    const result = validateEmail('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Email обязателен для заполнения');
  });

  it('should return error for invalid email format', () => {
    const result = validateEmail('invalid-email');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Введите корректный email адрес');
  });

  it('should return error for email without @', () => {
    const result = validateEmail('invalid.email.com');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Введите корректный email адрес');
  });

  it('should return error for email without domain', () => {
    const result = validateEmail('user@');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Введите корректный email адрес');
  });

  it('should return error for email too long', () => {
    const longEmail = 'a'.repeat(250) + '@test.com';
    const result = validateEmail(longEmail);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Email слишком длинный (максимум 254 символа)');
  });

  it('should accept valid simple email', () => {
    const result = validateEmail('user@example.com');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid email with subdomain', () => {
    const result = validateEmail('user@mail.example.com');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid email with plus sign', () => {
    const result = validateEmail('user+tag@example.com');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid email with dots', () => {
    const result = validateEmail('first.last@example.com');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid email with numbers', () => {
    const result = validateEmail('user123@example456.com');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid email with hyphens in domain', () => {
    const result = validateEmail('user@my-domain.com');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
