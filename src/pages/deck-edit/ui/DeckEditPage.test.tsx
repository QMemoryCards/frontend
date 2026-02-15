import { render, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeckEditPage } from './DeckEditPage';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: '1' }),
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
  Button: vi.fn(({ children, onClick }) => <button onClick={onClick}>{children}</button>),
  Modal: ({ children }: any) => <div>{children}</div>,
}));

const mockGetDeck = vi.fn().mockResolvedValue({
  data: { id: '1', title: 'Test', description: 'Test', cards: [] },
});

const mockGetCards = vi.fn().mockResolvedValue({
  data: {
    content: [
      { id: '1', question: 'Q1', answer: 'A1' },
      { id: '2', question: 'Q2', answer: 'A2' },
    ],
    page: { totalElements: 2, totalPages: 1 },
  },
});

vi.mock('@entities/deck', () => ({
  getDeck: () => mockGetDeck(),
}));

vi.mock('@entities/card', () => ({
  cardApi: {
    getCards: (params: any) => mockGetCards(params),
  },
}));

describe('DeckEditPage', () => {
  beforeEach(() => {
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  it('should render deck edit page', () => {
    const { container } = render(
      <BrowserRouter>
        <DeckEditPage />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});
