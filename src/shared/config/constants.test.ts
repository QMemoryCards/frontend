import { describe, it, expect } from 'vitest';
import {
  API_BASE_URL,
  APP_NAME,
  SESSION_TIMEOUT,
  VALIDATION,
  ROUTES,
  STORAGE_KEYS,
} from './constants';

describe('constants', () => {
  describe('API_BASE_URL', () => {
    it('should be a valid URL', () => {
      expect(API_BASE_URL).toBe('http://localhost:8080/api');
    });
  });

  describe('APP_NAME', () => {
    it('should be defined', () => {
      expect(APP_NAME).toBe('Flashcards App');
    });
  });

  describe('SESSION_TIMEOUT', () => {
    it('should be 30 minutes in milliseconds', () => {
      expect(SESSION_TIMEOUT).toBe(1800000);
      expect(SESSION_TIMEOUT).toBe(30 * 60 * 1000);
    });
  });

  describe('VALIDATION', () => {
    it('should have email validation rules', () => {
      expect(VALIDATION.EMAIL.MIN_LENGTH).toBe(1);
      expect(VALIDATION.EMAIL.MAX_LENGTH).toBe(254);
    });

    it('should have user validation rules', () => {
      expect(VALIDATION.USER.EMAIL_MAX).toBe(254);
      expect(VALIDATION.USER.LOGIN_MAX).toBe(64);
      expect(VALIDATION.USER.PASSWORD_MAX).toBe(64);
    });

    it('should have login validation rules', () => {
      expect(VALIDATION.LOGIN.MIN_LENGTH).toBe(3);
      expect(VALIDATION.LOGIN.MAX_LENGTH).toBe(64);
    });

    it('should have password validation rules', () => {
      expect(VALIDATION.PASSWORD.MIN_LENGTH).toBe(8);
      expect(VALIDATION.PASSWORD.MAX_LENGTH).toBe(64);
    });

    it('should have deck validation rules', () => {
      expect(VALIDATION.DECK.NAME_MIN).toBe(1);
      expect(VALIDATION.DECK.NAME_MAX).toBe(90);
      expect(VALIDATION.DECK.DESCRIPTION_MAX).toBe(200);
      expect(VALIDATION.DECK.MAX_DECKS).toBe(30);
    });

    it('should have card validation rules', () => {
      expect(VALIDATION.CARD.MIN_LENGTH).toBe(1);
      expect(VALIDATION.CARD.MAX_LENGTH).toBe(200);
      expect(VALIDATION.CARD.MAX_CARDS).toBe(30);
    });
  });

  describe('ROUTES', () => {
    it('should have home route', () => {
      expect(ROUTES.HOME).toBe('/');
    });

    it('should have auth routes', () => {
      expect(ROUTES.LOGIN).toBe('/login');
      expect(ROUTES.REGISTER).toBe('/register');
    });

    it('should have deck routes', () => {
      expect(ROUTES.DECKS).toBe('/decks');
      expect(ROUTES.DECK_EDIT).toBe('/decks/:id/edit');
      expect(ROUTES.STUDY).toBe('/decks/:id/study');
    });

    it('should have user routes', () => {
      expect(ROUTES.PROFILE).toBe('/profile');
      expect(ROUTES.ACCOUNT).toBe('/account');
    });

    it('should have share route', () => {
      expect(ROUTES.SHARE).toBe('/shared-deck/:token');
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have auth token key', () => {
      expect(STORAGE_KEYS.AUTH_TOKEN).toBe('auth_token');
    });

    it('should have user data key', () => {
      expect(STORAGE_KEYS.USER_DATA).toBe('user_data');
    });
  });
});
