import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DecksPage } from './DecksPage';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockModalConfirm = vi.fn();
vi.mock('antd', () => ({
  App: {
    useApp: () => ({
      modal: {
        confirm: mockModalConfirm,
      },
    }),
  },
}));

const mockRefetch = vi.fn();
let mockDecks: any[] = [];
let mockIsLoading = false;
let mockTotalElements = 0;
const mockCreateDeck = vi.fn();
const mockDeleteDeck = vi.fn();

vi.mock('@features/decks', () => ({
  useDecks: () => ({
    decks: mockDecks,
    isLoading: mockIsLoading,
    totalElements: mockTotalElements,
    refetch: mockRefetch,
  }),
  useCreateDeck: () => ({
    createDeck: mockCreateDeck,
    isLoading: false,
  }),
  useDeleteDeck: () => ({
    deleteDeck: mockDeleteDeck,
  }),
  CreateDeckModal: ({ isOpen, onClose, onSubmit, isLoading }: any) => (
    isOpen ? (
      <div data-testid="create-deck-modal">
        <button onClick={() => onSubmit({ name: 'New Deck', description: 'Description' })}>
          Submit
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
}));

vi.mock('@entities/deck', () => ({
  DeckCard: ({ deck, onEdit, onDelete, onStudy }: any) => (
    <div data-testid={`deck-card-${deck.id}`}>
      <h3>{deck.name}</h3>
      <p>{deck.description}</p>
      <button onClick={() => onEdit(deck)}>Edit</button>
      <button onClick={() => onDelete(deck.id)}>Delete</button>
      <button onClick={() => onStudy(deck.id)}>Study</button>
    </div>
  ),
}));

vi.mock('@widgets/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

vi.mock('@shared/ui', () => ({
  Spinner: ({ size }: any) => <div data-testid="spinner" data-size={size}>Loading...</div>,
}));

describe('DecksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDecks = [
      {
        id: '1',
        name: 'Deck 1',
        description: 'Description 1',
        cardCount: 5,
        learnedPercent: 30,
        lastStudied: null,
      },
      {
        id: '2',
        name: 'Deck 2',
        description: 'Description 2',
        cardCount: 10,
        learnedPercent: 70,
        lastStudied: '2025-02-15',
      },
      {
        id: '3',
        name: 'Deck 3',
        description: 'Description 3',
        cardCount: 0,
        learnedPercent: 0,
        lastStudied: null,
      },
    ];
    mockTotalElements = 3;
    mockIsLoading = false;

    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  const renderDecksPage = () => {
    return render(
      <BrowserRouter>
        <DecksPage />
      </BrowserRouter>
    );
  };

  it('shows loading spinner when loading', () => {
    mockIsLoading = true;
    renderDecksPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders page title and controls', () => {
    renderDecksPage();

    expect(screen.getByText('Мои колоды')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Поиск по названию или описанию...')).toBeInTheDocument();
    expect(screen.getByText('Создать колоду')).toBeInTheDocument();
  });

  it('displays statistics when decks exists', () => {
    renderDecksPage();

    expect(screen.getByText('Всего колод')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // totalElements

    const statItems = screen.getAllByText('Изучено');
    expect(statItems[0]).toBeInTheDocument(); // первое вхождение - это статистика

    expect(screen.getByText('В процессе')).toBeInTheDocument();
  });

  it('filters decks by status', () => {
    renderDecksPage();

    // Фильтр "Новые" (learnedPercent === 0)
    fireEvent.click(screen.getByRole('button', { name: 'Новые' }));
    expect(screen.getByTestId('deck-card-3')).toBeInTheDocument();
    expect(screen.queryByTestId('deck-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deck-card-2')).not.toBeInTheDocument();

    // Фильтр "В изучении" (0 < learnedPercent < 100)
    fireEvent.click(screen.getByRole('button', { name: 'В изучении' }));
    expect(screen.getByTestId('deck-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('deck-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('deck-card-3')).not.toBeInTheDocument();

    // Фильтр "Изучено" (learnedPercent === 100) - нет таких
    fireEvent.click(screen.getByRole('button', { name: 'Изучено' }));
    expect(screen.queryByTestId('deck-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deck-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deck-card-3')).not.toBeInTheDocument();

    // Все
    fireEvent.click(screen.getByRole('button', { name: 'Все' }));
    expect(screen.getByTestId('deck-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('deck-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('deck-card-3')).toBeInTheDocument();
  });

  it('filters decks by search query', () => {
    renderDecksPage();

    const searchInput = screen.getByPlaceholderText('Поиск по названию или описанию...');

    fireEvent.change(searchInput, { target: { value: 'Deck 1' } });

    expect(screen.getByTestId('deck-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('deck-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deck-card-3')).not.toBeInTheDocument();
  });

  it('searches in description as well', () => {
    renderDecksPage();

    const searchInput = screen.getByPlaceholderText('Поиск по названию или описанию...');

    fireEvent.change(searchInput, { target: { value: 'Description 2' } });

    expect(screen.getByTestId('deck-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('deck-card-1')).not.toBeInTheDocument();
  });

  it('shows empty state when no decks', () => {
    mockDecks = [];
    mockTotalElements = 0;
    renderDecksPage();

    expect(screen.getByText('У вас пока нет колод')).toBeInTheDocument();
    expect(screen.getByText('Создайте свою первую колоду, чтобы начать изучение')).toBeInTheDocument();
    expect(screen.getByText('Создать первую колоду')).toBeInTheDocument();
  });

  it('shows empty state when no search results', () => {
    renderDecksPage();

    const searchInput = screen.getByPlaceholderText('Поиск по названию или описанию...');
    fireEvent.change(searchInput, { target: { value: 'NonExistentDeck' } });

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
    expect(screen.getByText('Попробуйте изменить параметры поиска или фильтры')).toBeInTheDocument();
  });

  it('disables create button when totalElements >= 30', () => {
    mockTotalElements = 30;
    renderDecksPage();

    const createButtons = screen.getAllByText(/Создать колоду|Создать первую колоду/);
    createButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('opens create deck modal when clicking create button', () => {
    renderDecksPage();

    fireEvent.click(screen.getByText('Создать колоду'));
    expect(screen.getByTestId('create-deck-modal')).toBeInTheDocument();
  });

  it('calls createDeck and refetch when submitting modal', async () => {
    mockCreateDeck.mockResolvedValue(true);
    renderDecksPage();

    fireEvent.click(screen.getByText('Создать колоду'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateDeck).toHaveBeenCalledWith({ name: 'New Deck', description: 'Description' });
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('navigates to edit page when edit button is clicked', () => {
    renderDecksPage();

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/decks/1/edit');
  });

  it('navigates to study page when study button is clicked', () => {
    renderDecksPage();

    const studyButtons = screen.getAllByText('Study');
    fireEvent.click(studyButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/decks/1/study');
  });

  it('shows confirmation modal when delete button is clicked', () => {
    renderDecksPage();

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockModalConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Удалить колоду?',
        okText: 'Удалить',
      })
    );
  });

  it('calls deleteDeck and refetch when delete is confirmed', async () => {
    mockModalConfirm.mockImplementation(({ onOk }) => onOk());
    mockDeleteDeck.mockResolvedValue(undefined);

    renderDecksPage();

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteDeck).toHaveBeenCalledWith('1');
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('sets up intersection observer for cards', () => {
    const observeMock = vi.fn();
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: observeMock,
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    renderDecksPage();

    expect(observeMock).toHaveBeenCalled();
  });
});