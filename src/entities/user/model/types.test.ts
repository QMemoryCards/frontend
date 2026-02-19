import { describe, expect, it } from 'vitest';
import type {
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
} from './types';

describe('User types', () => {
  describe('User', () => {
    it('should have correct structure', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        login: 'testuser',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('login');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
    });
  });

  describe('RegisterRequest', () => {
    it('should have required fields', () => {
      const request: RegisterRequest = {
        email: 'test@example.com',
        login: 'testuser',
        password: 'Password123!',
      };

      expect(request).toHaveProperty('email');
      expect(request).toHaveProperty('login');
      expect(request).toHaveProperty('password');
    });
  });

  describe('LoginRequest', () => {
    it('should have required fields', () => {
      const request: LoginRequest = {
        login: 'testuser',
        password: 'Password123!',
      };

      expect(request).toHaveProperty('login');
      expect(request).toHaveProperty('password');
    });
  });

  describe('UpdateUserRequest', () => {
    it('should allow partial updates', () => {
      const requestWithEmail: UpdateUserRequest = {
        email: 'newemail@example.com',
      };

      const requestWithLogin: UpdateUserRequest = {
        login: 'newlogin',
      };

      const requestWithBoth: UpdateUserRequest = {
        email: 'newemail@example.com',
        login: 'newlogin',
      };

      expect(requestWithEmail).toHaveProperty('email');
      expect(requestWithLogin).toHaveProperty('login');
      expect(requestWithBoth).toHaveProperty('email');
      expect(requestWithBoth).toHaveProperty('login');
    });
  });

  describe('ChangePasswordRequest', () => {
    it('should have required fields', () => {
      const request: ChangePasswordRequest = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
      };

      expect(request).toHaveProperty('currentPassword');
      expect(request).toHaveProperty('newPassword');
    });
  });
});
