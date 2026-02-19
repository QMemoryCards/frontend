import { describe, expect, it } from 'vitest';
import * as loginPageExports from './index';

describe('pages/auth/login index', () => {
  it('should export LoginPage', () => {
    expect(loginPageExports.LoginPage).toBeDefined();
  });
});
