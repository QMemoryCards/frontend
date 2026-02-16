import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createDeck,
  deleteDeck,
  getDeck,
  getDecks,
  getSharedDeck,
  importSharedDeck,
  shareDeck,
  updateDeck,
} from './deckApi';
import { apiClient } from '@shared/api';

vi.mock('@shared/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('deckApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createDeck', () => {
    it('should create a deck', async () => {
      const mockDeck = { id: '1', name: 'Test Deck', description: 'Test' };
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockDeck });

      const result = await createDeck({ name: 'Test Deck', description: 'Test' });

      expect(apiClient.post).toHaveBeenCalledWith('/decks', {
        name: 'Test Deck',
        description: 'Test',
      });
      expect(result).toEqual(mockDeck);
    });
  });

  describe('getDecks', () => {
    it('should fetch decks with default pagination', async () => {
      const mockResponse = { content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 };
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse });

      const result = await getDecks();

      expect(apiClient.get).toHaveBeenCalledWith('/decks', {
        params: { page: 0, size: 20 },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch decks with custom pagination', async () => {
      const mockResponse = { content: [] };
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse });

      await getDecks(2, 50);

      expect(apiClient.get).toHaveBeenCalledWith('/decks', {
        params: { page: 2, size: 50 },
      });
    });
  });

  describe('updateDeck', () => {
    it('should update a deck', async () => {
      const mockDeck = { id: '1', name: 'Updated Deck' };
      (apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockDeck });

      const result = await updateDeck('1', { name: 'Updated Deck' });

      expect(apiClient.put).toHaveBeenCalledWith('/decks/1', { name: 'Updated Deck' });
      expect(result).toEqual(mockDeck);
    });
  });

  describe('deleteDeck', () => {
    it('should delete a deck', async () => {
      (apiClient.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await deleteDeck('1');

      expect(apiClient.delete).toHaveBeenCalledWith('/decks/1');
    });
  });

  describe('getDeck', () => {
    it('should fetch a single deck', async () => {
      const mockDeck = { id: '1', name: 'Test Deck', cardCount: 10 };
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockDeck });

      const result = await getDeck('1');

      expect(apiClient.get).toHaveBeenCalledWith('/decks/1');
      expect(result).toEqual(mockDeck);
    });
  });

  describe('shareDeck', () => {
    it('should share a deck', async () => {
      const mockResponse = { token: 'abc123' };
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse });

      const result = await shareDeck('1');

      expect(apiClient.post).toHaveBeenCalledWith('decks/1/share');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getSharedDeck', () => {
    it('should fetch a shared deck', async () => {
      const mockDeck = { id: '1', name: 'Shared Deck' };
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockDeck });

      const result = await getSharedDeck('token123');

      expect(apiClient.get).toHaveBeenCalledWith('share/token123');
      expect(result).toEqual(mockDeck);
    });
  });

  describe('importSharedDeck', () => {
    it('should import a shared deck', async () => {
      const mockDeck = { id: '1', name: 'Imported Deck' };
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockDeck });

      const result = await importSharedDeck('token123', { newName: 'My Deck' });

      expect(apiClient.post).toHaveBeenCalledWith('share/token123/import', { newName: 'My Deck' });
      expect(result).toEqual(mockDeck);
    });

    it('should import a shared deck without custom data', async () => {
      const mockDeck = { id: '1', name: 'Imported Deck' };
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockDeck });

      await importSharedDeck('token123');

      expect(apiClient.post).toHaveBeenCalledWith('share/token123/import', undefined);
    });
  });
});
