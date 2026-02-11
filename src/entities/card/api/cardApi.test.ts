import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cardApi } from './cardApi';
import { apiClient } from '@shared/api';

vi.mock('@shared/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('cardApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCards', () => {
    it('should fetch cards with default pagination', async () => {
      const mockResponse = {
        data: {
          content: [],
          page: 0,
          size: 100,
          totalElements: 0,
          totalPages: 0,
        },
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await cardApi.getCards('deck-123');

      expect(apiClient.get).toHaveBeenCalledWith('/decks/deck-123/cards', {
        params: { page: 0, size: 100 },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch cards with custom pagination', async () => {
      const mockResponse = { data: { content: [] } };
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      await cardApi.getCards('deck-123', 2, 50);

      expect(apiClient.get).toHaveBeenCalledWith('/decks/deck-123/cards', {
        params: { page: 2, size: 50 },
      });
    });
  });

  describe('createCard', () => {
    it('should create a card', async () => {
      const mockCard = { id: '1', question: 'Q', answer: 'A' };
      const mockResponse = { data: mockCard };
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await cardApi.createCard('deck-123', { question: 'Q', answer: 'A' });

      expect(apiClient.post).toHaveBeenCalledWith('/decks/deck-123/cards', {
        question: 'Q',
        answer: 'A',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateCard', () => {
    it('should update a card', async () => {
      const mockCard = { id: '1', question: 'Updated', answer: 'Updated A' };
      const mockResponse = { data: mockCard };
      (apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await cardApi.updateCard('deck-123', 'card-1', {
        question: 'Updated',
        answer: 'Updated A',
      });

      expect(apiClient.put).toHaveBeenCalledWith('/decks/deck-123/cards/card-1', {
        question: 'Updated',
        answer: 'Updated A',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteCard', () => {
    it('should delete a card', async () => {
      (apiClient.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await cardApi.deleteCard('deck-123', 'card-1');

      expect(apiClient.delete).toHaveBeenCalledWith('/decks/deck-123/cards/card-1');
    });
  });
});
