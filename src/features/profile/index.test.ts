import { describe, expect, it } from 'vitest';
import * as profileExports from './index';

describe('features/profile index', () => {
  it('should export useGetUser', () => {
    expect(profileExports.useGetUser).toBeDefined();
  });

  it('should export useUpdateUser', () => {
    expect(profileExports.useUpdateUser).toBeDefined();
  });

  it('should export useChangePassword', () => {
    expect(profileExports.useChangePassword).toBeDefined();
  });

  it('should export useDeleteUser', () => {
    expect(profileExports.useDeleteUser).toBeDefined();
  });
});
