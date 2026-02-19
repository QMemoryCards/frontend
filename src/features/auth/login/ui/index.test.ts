import { describe, expect, it } from 'vitest';
import * as loginUiExports from './index';

describe('features/auth/login/ui index', () => {
  it('should export LoginForm', () => {
    expect(loginUiExports.LoginForm).toBeDefined();
  });
});
