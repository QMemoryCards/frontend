import { describe, it, expect } from 'vitest';
import * as loginExports from './index';

describe('features/auth/login index', () => {
  it('should export LoginForm', () => {
    expect(loginExports.LoginForm).toBeDefined();
  });

  it('should export useLogin', () => {
    expect(loginExports.useLogin).toBeDefined();
  });
});
