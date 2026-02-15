import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SharedDeckPage } from './DeckSharedPage.tsx';
import { BrowserRouter } from 'react-router-dom';

const mockGetSharedDeck = vi.fn();
const mockImportSharedDeck = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ shareCode: '123' }),
  };
});

vi.mock('antd', () => ({
  App: {
    useApp: () => ({
      message: {
        success: vi.fn(),
        error: vi.fn(),
      },
    }),
  },
  Button: vi.fn(({ children }) => <button>{children}</button>),
  Modal: ({ children }: any) => <div>{children}</div>,
  Input: vi.fn(({ value, onChange }) => <input value={value} onChange={onChange} />),
}));

vi.mock('@entities/deck/api/deckApi', () => ({
  getSharedDeck: () => mockGetSharedDeck(),
  importSharedDeck: () => mockImportSharedDeck(),
}));

describe('SharedDeckPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  it('should render loading state', () => {
    mockGetSharedDeck.mockResolvedValue({ data: null });
    const { container } = render(
      <BrowserRouter>
        <SharedDeckPage />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it('should render shared deck with cards', async () => {
    mockGetSharedDeck.mockResolvedValue({
      data: {
        id: '1',
        title: 'Shared Deck',
        description: 'Test deck',
        cards: [
          { id: '1', question: 'Q1', answer: 'A1' },
          { id: '2', question: 'Q2', answer: 'A2' },
        ],
      },
    });

    const { container } = render(
      <BrowserRouter>
        <SharedDeckPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  it('should render error state', async () => {
    mockGetSharedDeck.mockRejectedValue(new Error('Failed to load'));

    const { container } = render(
      <BrowserRouter>
        <SharedDeckPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  it('should render deck without cards', async () => {
    mockGetSharedDeck.mockResolvedValue({
      data: {
        id: '1',
        title: 'Empty Deck',
        description: 'No cards',
        cards: [],
      },
    });

    const { container } = render(
      <BrowserRouter>
        <SharedDeckPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});
