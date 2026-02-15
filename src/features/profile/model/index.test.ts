import { describe, it, expect } from 'vitest';
import * as profileModelExports from './index';

describe('features/profile/model index', () => {
  it('should export useGetUser', () => {
    expect(profileModelExports.useGetUser).toBeDefined();
  });

  it('should export useUpdateUser', () => {
    expect(profileModelExports.useUpdateUser).toBeDefined();
  });

  it('should export useChangePassword', () => {
    expect(profileModelExports.useChangePassword).toBeDefined();
  });

  it('should export useDeleteUser', () => {
    expect(profileModelExports.useDeleteUser).toBeDefined();
  });
});
