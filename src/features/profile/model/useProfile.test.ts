import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useChangePassword, useDeleteUser, useGetUser, useUpdateUser } from './useProfile';
import { message as mockMessage } from 'antd';
import { userApi } from '@entities/user';

vi.mock('antd', () => ({
  message: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('@entities/user', () => ({
  userApi: {
    getMe: vi.fn(),
    updateMe: vi.fn(),
    changePassword: vi.fn(),
    deleteMe: vi.fn(),
  },
}));

vi.mock('@shared/api', () => ({
  handleApiError: vi.fn(error => ({
    message: error.message || 'Error',
    statusCode: error.response?.status ?? 0,
    code: error.code || '',
  })),
}));

describe('useProfile hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useGetUser', () => {
    it('should fetch user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        login: 'testuser',
        createdAt: '2024-01-01',
      };

      (userApi.getMe as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockUser,
      });

      const { result } = renderHook(() => useGetUser());

      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeNull();

      await waitFor(async () => {
        await result.current.fetchUser();
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle fetch error', async () => {
      (userApi.getMe as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 401 },
        message: 'Unauthorized',
      });

      const { result } = renderHook(() => useGetUser());

      await waitFor(async () => {
        await result.current.fetchUser();
      });

      await waitFor(() => {
        expect(mockMessage.error).toHaveBeenCalledWith('Unauthorized');
        expect(result.current.loading).toBe(false);
      });
    });

    it('should allow setting user manually', () => {
      const { result } = renderHook(() => useGetUser());

      const newUser = {
        id: '2',
        email: 'new@example.com',
        login: 'newuser',
        createdAt: '2024-01-02',
      };

      act(() => {
        result.current.setUser(newUser);
      });

      expect(result.current.user).toEqual(newUser);
    });
  });

  describe('useUpdateUser', () => {
    it('should update user successfully', async () => {
      const mockUpdatedUser = {
        id: '1',
        email: 'updated@example.com',
        login: 'updateduser',
        createdAt: '2024-01-01',
      };

      (userApi.updateMe as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockUpdatedUser,
      });

      const { result } = renderHook(() => useUpdateUser());

      let updateResult;
      await waitFor(async () => {
        updateResult = await result.current.updateUser({ email: 'updated@example.com' });
      });

      await waitFor(() => {
        expect(updateResult).toEqual({ user: mockUpdatedUser });
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle email conflict error', async () => {
      (userApi.updateMe as ReturnType<typeof vi.fn>).mockRejectedValue({
        code: 'email_conflict',
        response: { status: 409 },
        message: 'Email already exists',
      });

      const { result } = renderHook(() => useUpdateUser());

      let updateResult;
      await waitFor(async () => {
        updateResult = await result.current.updateUser({ email: 'existing@example.com' });
      });

      await waitFor(() => {
        expect(updateResult).toEqual({
          user: null,
          statusCode: 409,
          code: 'email_conflict',
          message: 'Email already exists',
        });
      });
    });

    it('should handle login conflict error', async () => {
      (userApi.updateMe as ReturnType<typeof vi.fn>).mockRejectedValue({
        code: 'login_conflict',
        response: { status: 409 },
        message: 'Login already exists',
      });

      const { result } = renderHook(() => useUpdateUser());

      let updateResult;
      await waitFor(async () => {
        updateResult = await result.current.updateUser({ login: 'existinguser' });
      });

      await waitFor(() => {
        expect(updateResult).toEqual({
          user: null,
          statusCode: 409,
          code: 'login_conflict',
          message: 'Login already exists',
        });
      });
    });
  });

  describe('useChangePassword', () => {
    it('should change password successfully', async () => {
      (userApi.changePassword as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const { result } = renderHook(() => useChangePassword());

      let changeResult;
      await waitFor(async () => {
        changeResult = await result.current.changePassword({
          currentPassword: 'oldpass123',
          newPassword: 'newpass456',
        });
      });

      await waitFor(() => {
        expect(changeResult).toEqual({ success: true });
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle incorrect current password', async () => {
      (userApi.changePassword as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 401 },
        message: 'Incorrect password',
      });

      const { result } = renderHook(() => useChangePassword());

      let changeResult;
      await waitFor(async () => {
        changeResult = await result.current.changePassword({
          currentPassword: 'wrongpass',
          newPassword: 'newpass456',
        });
      });

      await waitFor(() => {
        expect(changeResult).toEqual({
          success: false,
          statusCode: 401,
          message: 'Incorrect password',
        });
      });
    });

    it('should handle validation error', async () => {
      (userApi.changePassword as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 400 },
        message: 'Password too weak',
      });

      const { result } = renderHook(() => useChangePassword());

      let changeResult;
      await waitFor(async () => {
        changeResult = await result.current.changePassword({
          currentPassword: 'oldpass123',
          newPassword: '123',
        });
      });

      await waitFor(() => {
        expect(changeResult).toEqual({
          success: false,
          statusCode: 400,
          message: 'Password too weak',
        });
      });
    });
  });

  describe('useDeleteUser', () => {
    it('should delete user successfully', async () => {
      (userApi.deleteMe as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const { result } = renderHook(() => useDeleteUser());

      let deleteResult;
      await waitFor(async () => {
        deleteResult = await result.current.deleteUser();
      });

      await waitFor(() => {
        expect(deleteResult).toBe(true);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle delete error', async () => {
      (userApi.deleteMe as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 401 },
        message: 'Unauthorized',
      });

      const { result } = renderHook(() => useDeleteUser());

      let deleteResult;
      await waitFor(async () => {
        deleteResult = await result.current.deleteUser();
      });

      await waitFor(() => {
        expect(deleteResult).toBe(false);
        expect(mockMessage.error).toHaveBeenCalledWith('Unauthorized');
      });
    });

    it('should handle server error on delete', async () => {
      (userApi.deleteMe as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 500 },
        message: 'Server error',
      });

      const { result } = renderHook(() => useDeleteUser());

      let deleteResult;
      await waitFor(async () => {
        deleteResult = await result.current.deleteUser();
      });

      await waitFor(() => {
        expect(deleteResult).toBe(false);
        expect(mockMessage.error).toHaveBeenCalledWith('Server error');
      });
    });
  });
});
