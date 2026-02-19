import { apiClient } from '@shared/api';
import type { ChangePasswordRequest, UpdateUserRequest, User } from '../model/types';

export const userApi = {
  getMe: () => apiClient.get<User>('/users/me'),

  updateMe: (data: UpdateUserRequest) => apiClient.put<User>('/users/me', data),

  changePassword: (data: ChangePasswordRequest) => apiClient.put('/users/me/password', data),

  deleteMe: () => apiClient.delete('/users/me'),
};
