import { describe, it, expect } from 'vitest';
import { validateDeckName, validateDeckDescription } from './deck';

describe('validateDeckName', () => {
  it('should return error for empty name', () => {
    const result = validateDeckName('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Название колоды обязательно');
  });

  it('should return error for whitespace-only name', () => {
    const result = validateDeckName('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Название колоды обязательно');
  });

  it('should return error for name too long', () => {
    const longName = 'a'.repeat(91);
    const result = validateDeckName(longName);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Название не должно превышать 90 символов');
  });

  it('should accept valid name with minimum length', () => {
    const result = validateDeckName('a');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid name with maximum length', () => {
    const maxName = 'a'.repeat(90);
    const result = validateDeckName(maxName);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid name with spaces', () => {
    const result = validateDeckName('My Deck Name');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should trim whitespace and validate', () => {
    const result = validateDeckName('  Valid Name  ');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept name with special characters', () => {
    const result = validateDeckName('Math & Physics - 2024');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});

describe('validateDeckDescription', () => {
  it('should accept empty description', () => {
    const result = validateDeckDescription('');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return error for description too long', () => {
    const longDescription = 'a'.repeat(201);
    const result = validateDeckDescription(longDescription);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Описание не должно превышать 200 символов');
  });

  it('should accept valid description with maximum length', () => {
    const maxDescription = 'a'.repeat(200);
    const result = validateDeckDescription(maxDescription);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid description with text', () => {
    const result = validateDeckDescription('This is a valid deck description');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept description with special characters', () => {
    const result = validateDeckDescription('Description with special chars: !@#$%');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept description with newlines', () => {
    const result = validateDeckDescription('Line 1\nLine 2\nLine 3');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
