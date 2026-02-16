import { describe, expect, it } from 'vitest';
import * as authExports from './index';

describe('features/auth index', () => {
  it('should export LoginForm', () => {
    expect(authExports.LoginForm).toBeDefined();
  });

  it('should export useLogin', () => {
    expect(authExports.useLogin).toBeDefined();
  });

  it('should export RegisterForm', () => {
    expect(authExports.RegisterForm).toBeDefined();
  });

  it('should export useRegister', () => {
    expect(authExports.useRegister).toBeDefined();
  });
});
