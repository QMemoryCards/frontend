import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  useDecks,
  useCreateDeck,
  useGetDeck,
  useUpdateDeck,
  useDeleteDeck,
  useShareDeck,
  useSharedDeck,
  useImportSharedDeck,
} from './useDecks';

const mockNavigate = vi.fn();
const mockMessage = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('antd', () => ({
  App: {
    useApp: () => ({ message: mockMessage }),
  },
}));

vi.mock('@entities/deck', () => ({
  createDeck: vi.fn(),
  getDeck: vi.fn(),
  updateDeck: vi.fn(),
  deleteDeck: vi.fn(),
  getDecks: vi.fn(),
}));

vi.mock('@entities/deck/api/deckApi', () => ({
  shareDeck: vi.fn(),
  getSharedDeck: vi.fn(),
  importSharedDeck: vi.fn(),
}));

vi.mock('@shared/api', () => ({
  handleApiError: vi.fn(error => ({
    message: error.message || 'Error',
    statusCode: error.response?.status ?? 0,
    code: error.code || '',
  })),
}));

vi.mock('@shared/config', () => ({
  ROUTES: {
    DECKS: '/decks',
  },
}));

import * as deckApi from '@entities/deck';
import * as deckApiFile from '@entities/deck/api/deckApi';

describe('useDecks hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useDecks', () => {
    it('should fetch decks successfully', async () => {
      const mockDecks = {
        content: [
          {
            id: '1',
            name: 'Deck 1',
            description: 'Description 1',
            cardCount: 10,
            learnedPercent: 50,
            lastStudied: '2024-01-01',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
        page: 0,
        size: 30,
        totalElements: 1,
        totalPages: 1,
      };

      (deckApi.getDecks as ReturnType<typeof vi.fn>).mockResolvedValue(mockDecks);

      const { result } = renderHook(() => useDecks());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.decks).toHaveLength(1);
      expect(result.current.decks[0].name).toBe('Deck 1');
      expect(result.current.totalElements).toBe(1);
    });

    it('should handle fetch error', async () => {
      (deckApi.getDecks as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 500 },
        message: 'Server error',
      });

      const { result } = renderHook(() => useDecks());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(mockMessage.error).toHaveBeenCalled();
    });

    it('should handle network error', async () => {
      (deckApi.getDecks as ReturnType<typeof vi.fn>).mockRejectedValue({
        message: 'Network error',
      });

      const { result } = renderHook(() => useDecks());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockMessage.error).toHaveBeenCalledWith(
        'Сервер недоступен. Проверьте подключение к интернету'
      );
    });
  });

  describe('useCreateDeck', () => {
    it('should create deck successfully', async () => {
      (deckApi.createDeck as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: '1',
        name: 'New Deck',
      });

      const { result } = renderHook(() => useCreateDeck());

      let createResult;
      await waitFor(async () => {
        createResult = await result.current.createDeck({ name: 'New Deck' });
      });

      expect(createResult).toBe(true);
      expect(mockMessage.success).toHaveBeenCalledWith('Колода успешно создана');
      expect(mockNavigate).toHaveBeenCalledWith('/decks');
    });

    it('should handle conflict error', async () => {
      (deckApi.createDeck as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 409 },
      });

      const { result } = renderHook(() => useCreateDeck());

      let createResult;
      await waitFor(async () => {
        createResult = await result.current.createDeck({ name: 'Existing Deck' });
      });

      expect(createResult).toBe(false);
      expect(mockMessage.error).toHaveBeenCalledWith('Колода с таким названием уже существует');
    });

    it('should handle validation error', async () => {
      (deckApi.createDeck as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 400 },
        message: 'Invalid data',
      });

      const { result } = renderHook(() => useCreateDeck());

      let createResult;
      await waitFor(async () => {
        createResult = await result.current.createDeck({ name: '' });
      });

      expect(createResult).toBe(false);
      expect(mockMessage.error).toHaveBeenCalled();
    });
  });

  describe('useGetDeck', () => {
    it('should fetch single deck successfully', async () => {
      const mockDeck = {
        id: '1',
        name: 'Test Deck',
        description: 'Test description',
        cardCount: 5,
        learnedPercent: 0,
        lastStudied: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      (deckApi.getDeck as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeck);

      const { result } = renderHook(() => useGetDeck());

      await waitFor(async () => {
        await result.current.fetchDeck('1');
      });

      await waitFor(() => {
        expect(result.current.deck).toEqual(mockDeck);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle deck not found error', async () => {
      (deckApi.getDeck as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 404 },
      });

      const { result } = renderHook(() => useGetDeck());

      await waitFor(async () => {
        await result.current.fetchDeck('999');
      });

      await waitFor(() => {
        expect(mockMessage.error).toHaveBeenCalledWith('Колода не найдена');
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('useUpdateDeck', () => {
    it('should update deck successfully', async () => {
      (deckApi.updateDeck as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const { result } = renderHook(() => useUpdateDeck());

      let updateResult;
      await waitFor(async () => {
        updateResult = await result.current.updateDeck('1', { name: 'Updated Deck' });
      });

      expect(updateResult).toBe(true);
      expect(mockMessage.success).toHaveBeenCalledWith('Колода успешно обновлена');
      expect(mockNavigate).toHaveBeenCalledWith('/decks');
    });

    it('should handle update conflict', async () => {
      (deckApi.updateDeck as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 409 },
      });

      const { result } = renderHook(() => useUpdateDeck());

      let updateResult;
      await waitFor(async () => {
        updateResult = await result.current.updateDeck('1', { name: 'Existing Name' });
      });

      expect(updateResult).toBe(false);
      expect(mockMessage.error).toHaveBeenCalledWith('Колода с таким названием уже существует');
    });

    it('should handle deck not found on update', async () => {
      (deckApi.updateDeck as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 404 },
      });

      const { result } = renderHook(() => useUpdateDeck());

      let updateResult;
      await waitFor(async () => {
        updateResult = await result.current.updateDeck('999', { name: 'Updated' });
      });

      expect(updateResult).toBe(false);
      expect(mockMessage.error).toHaveBeenCalledWith('Колода не найдена');
    });
  });

  describe('useDeleteDeck', () => {
    it('should delete deck successfully', async () => {
      (deckApi.deleteDeck as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const { result } = renderHook(() => useDeleteDeck());

      await waitFor(async () => {
        await result.current.deleteDeck('1');
      });

      await waitFor(() => {
        expect(mockMessage.success).toHaveBeenCalledWith('Колода успешно удалена');
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle delete error', async () => {
      (deckApi.deleteDeck as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 404 },
      });

      const { result } = renderHook(() => useDeleteDeck());

      await waitFor(async () => {
        await result.current.deleteDeck('999');
      });

      await waitFor(() => {
        expect(mockMessage.error).toHaveBeenCalledWith('Колода не найдена');
      });
    });
  });

  describe('useShareDeck', () => {
    it('should share deck successfully', async () => {
      const mockShareData = { token: 'share-token-123', expiresAt: '2024-12-31' };
      (deckApiFile.shareDeck as ReturnType<typeof vi.fn>).mockResolvedValue(mockShareData);

      const { result } = renderHook(() => useShareDeck());

      const sharePromise = result.current.shareDeck('1');
      const shareResult = await sharePromise;

      expect(shareResult).toEqual(mockShareData);
      expect(mockMessage.success).toHaveBeenCalledWith('Ссылка для общего доступа создана');

      await waitFor(() => {
        expect(result.current.shareData).toEqual(mockShareData);
      });
    });

    it('should handle unauthorized error', async () => {
      (deckApiFile.shareDeck as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 401 },
      });

      const { result } = renderHook(() => useShareDeck());

      const shareResult = await result.current.shareDeck('1');

      expect(shareResult).toBeNull();
      expect(mockMessage.error).toHaveBeenCalledWith('Пользователь не авторизован');
    });

    it('should handle forbidden error', async () => {
      (deckApiFile.shareDeck as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 403 },
      });

      const { result } = renderHook(() => useShareDeck());

      const shareResult = await result.current.shareDeck('1');

      expect(shareResult).toBeNull();
      expect(mockMessage.error).toHaveBeenCalledWith('Доступ запрещен');
    });
  });

  describe('useSharedDeck', () => {
    it('should fetch shared deck successfully', async () => {
      const mockSharedDeck = {
        id: '1',
        name: 'Shared Deck',
        description: 'Shared description',
        cardCount: 10,
      };
      (deckApiFile.getSharedDeck as ReturnType<typeof vi.fn>).mockResolvedValue(mockSharedDeck);

      const { result } = renderHook(() => useSharedDeck());

      await result.current.fetchSharedDeck('token-123');

      await waitFor(() => {
        expect(result.current.deck).toEqual(mockSharedDeck);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle invalid or expired token', async () => {
      (deckApiFile.getSharedDeck as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 404 },
      });

      const { result } = renderHook(() => useSharedDeck());

      await result.current.fetchSharedDeck('invalid-token');

      await waitFor(() => {
        expect(mockMessage.error).toHaveBeenCalledWith('Колода не найдена или ссылка устарела');
      });
    });
  });

  describe('useImportSharedDeck', () => {
    it('should import shared deck successfully', async () => {
      const mockImportedDeck = {
        id: '2',
        name: 'Imported Deck',
        description: 'Imported description',
        cardCount: 10,
        learnedPercent: 0,
        lastStudied: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      (deckApiFile.importSharedDeck as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockImportedDeck
      );

      const { result } = renderHook(() => useImportSharedDeck());

      const importResult = await result.current.importDeck('token-123', {
        name: 'My Imported Deck',
      });

      expect(importResult).toEqual(mockImportedDeck);
      expect(mockMessage.success).toHaveBeenCalledWith('Колода успешно импортирована');

      await waitFor(() => {
        expect(result.current.importedDeck).toEqual(mockImportedDeck);
      });
    });

    it('should handle import conflict', async () => {
      (deckApiFile.importSharedDeck as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 409 },
      });

      const { result } = renderHook(() => useImportSharedDeck());

      const importResult = await result.current.importDeck('token-123');

      expect(importResult).toBeNull();
      expect(mockMessage.error).toHaveBeenCalledWith('Колода с таким названием уже существует');
    });

    it('should handle unauthorized import', async () => {
      (deckApiFile.importSharedDeck as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: 401 },
      });

      const { result } = renderHook(() => useImportSharedDeck());

      const importResult = await result.current.importDeck('token-123');

      expect(importResult).toBeNull();
      expect(mockMessage.error).toHaveBeenCalledWith('Не авторизован');
    });
  });
});
