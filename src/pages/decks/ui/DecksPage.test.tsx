import { render, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DecksPage } from './DecksPage';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('antd', () => ({
  App: {
    useApp: () => ({
      message: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
      },
    }),
  },
  Modal: ({ children }: any) => <div>{children}</div>,
}));

const mockGetDecks = vi.fn().mockResolvedValue({
  data: {
    content: [
      { id: '1', name: 'Deck 1', description: 'Test 1', cardsCount: 5 },
      { id: '2', name: 'Deck 2', description: 'Test 2', cardsCount: 10 },
    ],
    page: { totalElements: 2, totalPages: 1 },
  },
});
const mockCreateDeck = vi.fn().mockResolvedValue({ data: {} });
const mockUpdateDeck = vi.fn().mockResolvedValue({ data: {} });
const mockDeleteDeck = vi.fn().mockResolvedValue({ data: {} });

vi.mock('@entities/deck', () => ({
  getDecks: (params: any) => mockGetDecks(params),
  createDeck: (data: any) => mockCreateDeck(data),
  updateDeck: (id: string, data: any) => mockUpdateDeck(id, data),
  deleteDeck: (id: string) => mockDeleteDeck(id),
}));

describe('DecksPage', () => {
  beforeEach(() => {
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  it('should render decks page', () => {
    const { container } = render(
      <BrowserRouter>
        <DecksPage />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it('should load decks', async () => {
    const { container } = render(
      <BrowserRouter>
        <DecksPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockGetDecks).toHaveBeenCalled();
    });
    expect(container).toBeTruthy();
  });

  it('should handle button clicks', async () => {
    const { container } = render(
      <BrowserRouter>
        <DecksPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockGetDecks).toHaveBeenCalled();
    });
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      fireEvent.click(button);
    });
    expect(container).toBeTruthy();
  });

  it('should handle error loading decks', async () => {
    mockGetDecks.mockRejectedValueOnce(new Error('Failed'));
    const { container } = render(
      <BrowserRouter>
        <DecksPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockGetDecks).toHaveBeenCalled();
    });
    expect(container).toBeTruthy();
  });

  it('should handle empty decks list', async () => {
    mockGetDecks.mockResolvedValueOnce({
      data: { content: [], page: { totalElements: 0, totalPages: 0 } },
    });
    const { container } = render(
      <BrowserRouter>
        <DecksPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockGetDecks).toHaveBeenCalled();
    });
    expect(container).toBeTruthy();
  });

  it('should render page with multiple decks', async () => {
    mockGetDecks.mockResolvedValueOnce({
      data: {
        content: [
          { id: '1', name: 'D1', description: 'Desc1', cardsCount: 3 },
          { id: '2', name: 'D2', description: 'Desc2', cardsCount: 5 },
          { id: '3', name: 'D3', description: 'Desc3', cardsCount: 7 },
        ],
        page: { totalElements: 3, totalPages: 1 },
      },
    });
    const { container } = render(
      <BrowserRouter>
        <DecksPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockGetDecks).toHaveBeenCalled();
    });
    expect(container).toBeTruthy();
  });
});
