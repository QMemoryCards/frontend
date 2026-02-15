import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStudy } from './useStudy';

vi.mock('antd', () => ({
  message: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

import { message as mockMessage } from 'antd';

vi.mock('@entities/study', () => ({
  studyApi: {
    getStudyCards: vi.fn(),
    submitAnswer: vi.fn(),
  },
}));

vi.mock('@shared/api', () => ({
  handleApiError: vi.fn(error => ({
    message: error.message || 'Error',
    statusCode: error.response?.status ?? 0,
  })),
}));

import { studyApi } from '@entities/study';

describe('useStudy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCards = [
    {
      id: '1',
      question: 'What is React?',
      answer: 'A JavaScript library',
      deckId: 'deck1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      deckId: 'deck1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '3',
      question: 'What is Vite?',
      answer: 'A build tool',
      deckId: 'deck1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useStudy('deck1'));

    expect(result.current.cards).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.currentCardIndex).toBe(0);
    expect(result.current.showAnswer).toBe(false);
    expect(result.current.rememberedCount).toBe(0);
    expect(result.current.forgottenCount).toBe(0);
    expect(result.current.isLastCard).toBe(false);
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.progress).toBe(0);
  });

  it('should fetch study cards successfully', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCards,
    });

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    await waitFor(() => {
      expect(result.current.cards).toEqual(mockCards);
      expect(result.current.loading).toBe(false);
      expect(result.current.currentCardIndex).toBe(0);
    });
  });

  it('should handle array data from api', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCards,
    });

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    await waitFor(() => {
      expect(result.current.cards).toHaveLength(3);
    });
  });

  it('should handle object with content property from api', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { content: mockCards },
    });

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    await waitFor(() => {
      expect(result.current.cards).toHaveLength(3);
    });
  });

  it('should handle fetch error', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { status: 404 },
      message: 'Deck not found',
    });

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith('Deck not found');
      expect(result.current.loading).toBe(false);
    });
  });

  it('should toggle answer visibility', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCards,
    });

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    expect(result.current.showAnswer).toBe(false);

    act(() => {
      result.current.toggleAnswer();
    });

    expect(result.current.showAnswer).toBe(true);

    act(() => {
      result.current.toggleAnswer();
    });

    expect(result.current.showAnswer).toBe(false);
  });

  it('should submit remembered answer and move to next card', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCards,
    });
    (studyApi.submitAnswer as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    await waitFor(() => {
      expect(result.current.cards).toHaveLength(3);
    });

    act(() => {
      result.current.toggleAnswer();
    });

    expect(result.current.showAnswer).toBe(true);

    await act(async () => {
      await result.current.submitAnswer('remembered');
    });

    await waitFor(() => {
      expect(result.current.rememberedCount).toBe(1);
      expect(result.current.forgottenCount).toBe(0);
      expect(result.current.currentCardIndex).toBe(1);
      expect(result.current.showAnswer).toBe(false);
    });
  });

  it('should submit forgotten answer and move to next card', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCards,
    });
    (studyApi.submitAnswer as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    await act(async () => {
      await result.current.submitAnswer('forgotten');
    });

    await waitFor(() => {
      expect(result.current.rememberedCount).toBe(0);
      expect(result.current.forgottenCount).toBe(1);
      expect(result.current.currentCardIndex).toBe(1);
    });
  });

  it('should handle submit answer error', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCards,
    });
    (studyApi.submitAnswer as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { status: 500 },
      message: 'Server error',
    });

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    await act(async () => {
      await result.current.submitAnswer('remembered');
    });

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith('Server error');
    });
  });

  it('should calculate progress correctly', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCards,
    });
    (studyApi.submitAnswer as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    expect(result.current.progress).toBe(0);

    await act(async () => {
      await result.current.submitAnswer('remembered');
    });

    await waitFor(() => {
      expect(result.current.progress).toBe(33);
    });

    await act(async () => {
      await result.current.submitAnswer('forgotten');
    });

    await waitFor(() => {
      expect(result.current.progress).toBe(67);
    });

    await act(async () => {
      await result.current.submitAnswer('remembered');
    });

    await waitFor(() => {
      expect(result.current.progress).toBe(100);
    });
  });

  it('should detect last card correctly', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCards,
    });
    (studyApi.submitAnswer as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    await waitFor(() => {
      expect(result.current.isLastCard).toBe(false);
    });

    await act(async () => {
      await result.current.submitAnswer('remembered');
    });

    await waitFor(() => {
      expect(result.current.currentCardIndex).toBe(1);
    });

    await act(async () => {
      await result.current.submitAnswer('remembered');
    });

    await waitFor(() => {
      expect(result.current.currentCardIndex).toBe(2);
      expect(result.current.isLastCard).toBe(true);
    });
  });

  it('should detect completion correctly', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCards,
    });
    (studyApi.submitAnswer as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    expect(result.current.isCompleted).toBe(false);

    await act(async () => {
      await result.current.submitAnswer('remembered');
    });
    await act(async () => {
      await result.current.submitAnswer('forgotten');
    });
    await act(async () => {
      await result.current.submitAnswer('remembered');
    });

    await waitFor(() => {
      expect(result.current.isCompleted).toBe(true);
    });
  });

  it('should reset state when fetching new cards', async () => {
    (studyApi.getStudyCards as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockCards,
    });
    (studyApi.submitAnswer as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { result } = renderHook(() => useStudy('deck1'));

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    await act(async () => {
      await result.current.submitAnswer('remembered');
    });

    await waitFor(() => {
      expect(result.current.currentCardIndex).toBe(1);
      expect(result.current.rememberedCount).toBe(1);
    });

    await act(async () => {
      await result.current.fetchStudyCards();
    });

    await waitFor(() => {
      expect(result.current.currentCardIndex).toBe(0);
      expect(result.current.rememberedCount).toBe(0);
      expect(result.current.forgottenCount).toBe(0);
      expect(result.current.showAnswer).toBe(false);
    });
  });
});
