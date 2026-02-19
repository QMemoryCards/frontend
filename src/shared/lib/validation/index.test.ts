import { describe, expect, it } from 'vitest';
import * as validationExports from './index';

describe('validation exports', () => {
  it('should export email validator', () => {
    expect(validationExports.validateEmail).toBeDefined();
  });

  it('should export login validator', () => {
    expect(validationExports.validateLogin).toBeDefined();
  });

  it('should export password validator', () => {
    expect(validationExports.validatePassword).toBeDefined();
    expect(validationExports.getPasswordRequirements).toBeDefined();
  });

  it('should export deck validators', () => {
    expect(validationExports.validateDeckName).toBeDefined();
    expect(validationExports.validateDeckDescription).toBeDefined();
  });

  it('should export card validators', () => {
    expect(validationExports.validateCardQuestion).toBeDefined();
    expect(validationExports.validateCardAnswer).toBeDefined();
  });
});
