import { describe, expect, it } from 'vitest';
import * as authPagesExports from './index';

describe('pages/auth index', () => {
  it('should export LoginPage', () => {
    expect(authPagesExports.LoginPage).toBeDefined();
  });

  it('should export RegisterPage', () => {
    expect(authPagesExports.RegisterPage).toBeDefined();
  });
});
