export const API_BASE_URL = 'http://localhost:8080/api';
export const APP_NAME = 'Flashcards App';

export const SESSION_TIMEOUT = 1800000; // 30 минут в мс

export const VALIDATION = {
  EMAIL: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 254,
  },
  LOGIN: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 64,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 64,
  },
  DECK: {
    NAME_MIN: 1,
    NAME_MAX: 90,
    DESCRIPTION_MAX: 200,
    MAX_DECKS: 30,
  },
  CARD: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
    MAX_CARDS: 30,
  },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DECKS: '/decks',
  DECK_EDIT: '/decks/:id/edit',
  STUDY: '/decks/:id/study',
  ACCOUNT: '/account',
  SHARE: '/share/:token',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;
