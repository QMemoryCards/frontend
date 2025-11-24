import { useState, useCallback } from 'react';
import { message } from 'antd';
import { AxiosError } from 'axios';
import { userApi } from '@entities/user';
import type { User, UpdateUserRequest, ChangePasswordRequest } from '@entities/user';
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

  return { user, loading, fetchUser };
};

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);

  const updateUser = async (data: UpdateUserRequest): Promise<User | null> => {
    setLoading(true);
    try {
      const response = await userApi.updateMe(data);
      message.success('Данные успешно обновлены');
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      message.error(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading };
};

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async (data: ChangePasswordRequest): Promise<boolean> => {
    setLoading(true);
    try {
      await userApi.changePassword(data);
      message.success('Пароль успешно изменен');
      return true;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      message.error(apiError.message);
      return false;
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
      message.success('Аккаунт удален');
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
