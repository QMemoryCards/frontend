import { describe, expect, it } from 'vitest';
import * as loginModelExports from './index';

describe('features/auth/login/model index', () => {
  it('should export useLogin', () => {
    expect(loginModelExports.useLogin).toBeDefined();
  });
});
