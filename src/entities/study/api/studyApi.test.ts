import { beforeEach, describe, expect, it, vi } from 'vitest';
import { studyApi } from './studyApi';
import { apiClient } from '@shared/api';

vi.mock('@shared/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('studyApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStudyCards', () => {
    it('should fetch study cards for a deck', async () => {
      const mockResponse = { cards: [], totalCards: 0 };
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse });

      const result = await studyApi.getStudyCards('deck-123');

      expect(apiClient.get).toHaveBeenCalledWith('/study/deck-123/cards');
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('submitAnswer', () => {
    it('should submit answer for study session', async () => {
      const mockResponse = { correct: true, nextCard: null };
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse });

      const result = await studyApi.submitAnswer('deck-123', { cardId: 'card-1', isLearned: true });

      expect(apiClient.post).toHaveBeenCalledWith('/study/deck-123/answer', {
        cardId: 'card-1',
        isLearned: true,
      });
      expect(result.data).toEqual(mockResponse);
    });
  });
});
