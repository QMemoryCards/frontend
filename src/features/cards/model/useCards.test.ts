import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCards, useCreateCard, useUpdateCard, useDeleteCard } from './useCards';

vi.mock('antd', () => ({
  message: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@entities/card', () => ({
  cardApi: {
    getCards: vi.fn(),
    createCard: vi.fn(),
    updateCard: vi.fn(),
    deleteCard: vi.fn(),
  },
}));

vi.mock('@shared/api', () => ({
  handleApiError: vi.fn(error => ({
    message: error.message || 'Error',
    statusCode: error.response?.status || 500,
  })),
}));

vi.mock('@shared/config', () => ({
  VALIDATION: {
    CARD: {
      MAX_LENGTH: 200,
      MAX_CARDS: 30,
    },
  },
}));

import { cardApi } from '@entities/card';
import { message } from 'antd';

describe('useCards', () => {
  const deckId = 'deck-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch cards successfully', async () => {
    const mockCards = [
      { id: '1', question: 'Q1', answer: 'A1' },
      { id: '2', question: 'Q2', answer: 'A2' },
    ];

    (cardApi.getCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        content: mockCards,
        totalElements: 2,
      },
    });

    const { result } = renderHook(() => useCards(deckId));

    expect(result.current.loading).toBe(false);

    await waitFor(() => {
      result.current.fetchCards();
    });

    await waitFor(() => {
      expect(result.current.cards).toEqual(mockCards);
      expect(result.current.totalElements).toBe(2);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle fetch error', async () => {
    (cardApi.getCards as ReturnType<typeof vi.fn>).mockRejectedValue({
      message: 'Failed to fetch',
    });

    const { result } = renderHook(() => useCards(deckId));

    await waitFor(() => {
      result.current.fetchCards();
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
    });
  });
});

describe('useCreateCard', () => {
  const deckId = 'deck-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create card successfully', async () => {
    const mockCard = { id: '1', question: 'Q1', answer: 'A1' };
    (cardApi.createCard as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCard,
    });

    const { result } = renderHook(() => useCreateCard(deckId));

    let cardResult;
    await waitFor(async () => {
      cardResult = await result.current.createCard({ question: 'Q1', answer: 'A1' });
    });

    expect(cardResult).toEqual(mockCard);
    expect(message.success).toHaveBeenCalledWith('Карточка создана');
  });

  it('should handle card limit error', async () => {
    (cardApi.createCard as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { status: 422 },
    });

    const { result } = renderHook(() => useCreateCard(deckId));

    let cardResult;
    await waitFor(async () => {
      cardResult = await result.current.createCard({ question: 'Q1', answer: 'A1' });
    });

    expect(cardResult).toBeNull();
    expect(message.error).toHaveBeenCalledWith('Достигнут лимит карточек (30)');
  });
});

describe('useUpdateCard', () => {
  const deckId = 'deck-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update card successfully', async () => {
    const mockCard = { id: '1', question: 'Updated Q', answer: 'Updated A' };
    (cardApi.updateCard as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCard,
    });

    const { result } = renderHook(() => useUpdateCard(deckId));

    let cardResult;
    await waitFor(async () => {
      cardResult = await result.current.updateCard('1', {
        question: 'Updated Q',
        answer: 'Updated A',
      });
    });

    expect(cardResult).toEqual(mockCard);
    expect(message.success).toHaveBeenCalledWith('Карточка обновлена');
  });

  it('should handle update error', async () => {
    (cardApi.updateCard as ReturnType<typeof vi.fn>).mockRejectedValue({
      message: 'Update failed',
    });

    const { result } = renderHook(() => useUpdateCard(deckId));

    let cardResult;
    await waitFor(async () => {
      cardResult = await result.current.updateCard('1', { question: 'Q', answer: 'A' });
    });

    expect(cardResult).toBeNull();
    expect(message.error).toHaveBeenCalled();
  });
});

describe('useDeleteCard', () => {
  const deckId = 'deck-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete card successfully', async () => {
    (cardApi.deleteCard as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { result } = renderHook(() => useDeleteCard(deckId));

    let deleteResult;
    await waitFor(async () => {
      deleteResult = await result.current.deleteCard('1');
    });

    expect(deleteResult).toBe(true);
    expect(message.success).toHaveBeenCalledWith('Карточка удалена');
  });

  it('should handle delete error', async () => {
    (cardApi.deleteCard as ReturnType<typeof vi.fn>).mockRejectedValue({
      message: 'Delete failed',
    });

    const { result } = renderHook(() => useDeleteCard(deckId));

    let deleteResult;
    await waitFor(async () => {
      deleteResult = await result.current.deleteCard('1');
    });

    expect(deleteResult).toBe(false);
    expect(message.error).toHaveBeenCalled();
  });
});
