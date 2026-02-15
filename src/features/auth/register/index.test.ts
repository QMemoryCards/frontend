import { describe, it, expect } from 'vitest';
import * as registerExports from './index';

describe('features/auth/register index', () => {
  it('should export RegisterForm', () => {
    expect(registerExports.RegisterForm).toBeDefined();
  });

  it('should export useRegister', () => {
    expect(registerExports.useRegister).toBeDefined();
  });
});
