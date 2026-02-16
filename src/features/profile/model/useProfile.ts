import { useCallback, useState } from 'react';
import { message } from 'antd';
import { AxiosError } from 'axios';
import type { ChangePasswordRequest, UpdateUserRequest, User } from '@entities/user';
import { userApi } from '@entities/user';
import { handleApiError } from '@shared/api';

export const useGetUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userApi.getMe();
      setUser(response.data);
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, setUser, loading, fetchUser };
};

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);

  const updateUser = async (
    data: UpdateUserRequest
  ): Promise<{ user: User | null; statusCode?: number; code?: string; message?: string }> => {
    setLoading(true);
    try {
      const response = await userApi.updateMe(data);
      return { user: response.data };
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      return {
        user: null,
        statusCode: apiError.statusCode,
        code: apiError.code,
        message: apiError.message,
      };
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading };
};

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async (
    data: ChangePasswordRequest
  ): Promise<{ success: boolean; statusCode?: number; message?: string }> => {
    setLoading(true);
    try {
      await userApi.changePassword(data);
      return { success: true };
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      return { success: false, statusCode: apiError.statusCode, message: apiError.message };
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
};

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);

  const deleteUser = async (): Promise<boolean> => {
    setLoading(true);
    try {
      await userApi.deleteMe();
      return true;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      message.error(apiError.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading };
};
