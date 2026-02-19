import { describe, expect, it } from 'vitest';
import type * as types from './types';

describe('entities/user/model index', () => {
  it('should have User type', () => {
    const user: types.User = {
      id: '1',
      email: 'test@test.com',
      username: 'test',
      createdAt: '',
    };
    expect(user).toBeDefined();
  });
});
