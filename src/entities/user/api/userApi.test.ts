import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userApi } from './userApi';
import { apiClient } from '@shared/api';

vi.mock('@shared/api', () => ({
  apiClient: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('userApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMe', () => {
    it('should fetch current user', async () => {
      const mockUser = { id: '1', email: 'test@test.com', login: 'testuser' };
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockUser });

      const result = await userApi.getMe();

      expect(apiClient.get).toHaveBeenCalledWith('/users/me');
      expect(result.data).toEqual(mockUser);
    });
  });

  describe('updateMe', () => {
    it('should update current user', async () => {
      const mockUser = { id: '1', email: 'new@test.com', login: 'newlogin' };
      (apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockUser });

      const result = await userApi.updateMe({ email: 'new@test.com', login: 'newlogin' });

      expect(apiClient.put).toHaveBeenCalledWith('/users/me', {
        email: 'new@test.com',
        login: 'newlogin',
      });
      expect(result.data).toEqual(mockUser);
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      (apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await userApi.changePassword({
        currentPassword: 'OldPass1!',
        newPassword: 'NewPass1!',
      });

      expect(apiClient.put).toHaveBeenCalledWith('/users/me/password', {
        currentPassword: 'OldPass1!',
        newPassword: 'NewPass1!',
      });
    });
  });

  describe('deleteMe', () => {
    it('should delete current user', async () => {
      (apiClient.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await userApi.deleteMe();

      expect(apiClient.delete).toHaveBeenCalledWith('/users/me');
    });
  });
});
