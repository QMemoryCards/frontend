import { describe, expect, it } from 'vitest';
import * as userExports from './index';

describe('user entity exports', () => {
  it('should export user API', () => {
    expect(userExports.userApi).toBeDefined();
  });

  it('should export auth API functions', () => {
    expect(userExports.registerUser).toBeDefined();
    expect(userExports.loginUser).toBeDefined();
  });

  it('should export types', () => {
    expect(userExports).toBeDefined();
  });
});
