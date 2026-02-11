import { describe, it, expect } from 'vitest';
import * as api from './index';

describe('entities/user/api exports', () => {
  it('should export registerUser', () => {
    expect(api.registerUser).toBeDefined();
  });

  it('should export loginUser', () => {
    expect(api.loginUser).toBeDefined();
  });

  it('should export logoutUser', () => {
    expect(api.logoutUser).toBeDefined();
  });

  it('should export checkEmailUnique', () => {
    expect(api.checkEmailUnique).toBeDefined();
  });

  it('should export checkLoginUnique', () => {
    expect(api.checkLoginUnique).toBeDefined();
  });
});
