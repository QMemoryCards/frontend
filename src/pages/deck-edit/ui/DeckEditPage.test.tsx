import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeckEditPage } from './DeckEditPage';
import { VALIDATION } from '@shared/config';
import { renderWithRouter } from '@/test/utils.tsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'test-deck-id' }),
  };
});

const mockMessageSuccess = vi.fn();
const mockMessageWarning = vi.fn();
const mockMessageError = vi.fn();
const mockModalConfirm = vi.fn();

vi.mock('antd', () => ({
  App: {
    useApp: () => ({
      message: {
        success: mockMessageSuccess,
        warning: mockMessageWarning,
        error: mockMessageError,
      },
      modal: {
        confirm: mockModalConfirm,
      },
    }),
  },
  Button: ({ children, onClick, disabled, icon, type }: any) => (
    <button onClick={onClick} disabled={disabled} data-type={type}>
      {icon && <span data-testid="button-icon">{icon}</span>}
      {children}
    </button>
  ),
  Modal: ({ open, title, onCancel, footer, children }: any) =>
    open ? (
      <div data-testid="share-modal">
        <h3>{title}</h3>
        {children}
        <button onClick={onCancel}>Close</button>
        {footer}
      </div>
    ) : null,
}));

const mockFetchDeck = vi.fn();
const mockUpdateDeck = vi.fn();
const mockShareDeck = vi.fn();

let mockDeck = null;
let mockDeckLoading = false;
let mockUpdateLoading = false;
let mockIsGeneratingShare = false;

vi.mock('@features/decks', () => ({
  useGetDeck: () => ({
    deck: mockDeck,
    isLoading: mockDeckLoading,
    fetchDeck: mockFetchDeck,
  }),
  useUpdateDeck: () => ({
    updateDeck: mockUpdateDeck,
    loading: mockUpdateLoading,
  }),
}));

vi.mock('@features/decks/model/useDecks.ts', () => ({
  useShareDeck: () => ({
    shareDeck: mockShareDeck,
    isLoading: mockIsGeneratingShare,
  }),
}));

const mockFetchCards = vi.fn();
const mockSetCards = vi.fn();
const mockCreateCard = vi.fn();
const mockUpdateCard = vi.fn();
const mockDeleteCard = vi.fn();

let mockCards: any[] = [];
let mockCardsLoading = false;
let mockCreateLoading = false;
let mockUpdateCardLoading = false;

vi.mock('@features/cards', () => ({
  useCards: () => ({
    cards: mockCards,
    loading: mockCardsLoading,
    fetchCards: mockFetchCards,
    setCards: mockSetCards,
  }),
  useCreateCard: () => ({
    createCard: mockCreateCard,
    loading: mockCreateLoading,
  }),
  useUpdateCard: () => ({
    updateCard: mockUpdateCard,
    loading: mockUpdateCardLoading,
  }),
  useDeleteCard: () => ({
    deleteCard: mockDeleteCard,
  }),
  CreateCardModal: ({ isOpen, onClose, onSubmit, isLoading }: any) =>
    isOpen ? (
      <div data-testid="create-card-modal">
        <button onClick={() => onSubmit({ question: 'Q', answer: 'A' })}>Submit</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
  EditCardModal: ({ isOpen, card, onClose, onSubmit, isLoading }: any) =>
    isOpen ? (
      <div data-testid="edit-card-modal">
        <button onClick={() => onSubmit(card?.id, { question: 'Updated Q', answer: 'Updated A' })}>
          Submit
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock('@entities/card', () => ({
  CardItem: ({ card, onEdit, onDelete }: any) => (
    <div data-testid={`card-${card.id}`}>
      <h3>{card.question}</h3>
      <p>{card.answer}</p>
      <button onClick={() => onEdit(card)}>Edit</button>
      <button onClick={() => onDelete(card.id)}>Delete</button>
    </div>
  ),
}));

vi.mock('@widgets/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

vi.mock('@shared/ui', () => ({
  Input: ({ value, onChange, placeholder, disabled, readOnly }: any) => (
    <input
      data-testid={`input-${placeholder}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
    />
  ),
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('@shared/lib/validation', () => ({
  validateDeckName: (name: string) => ({
    isValid: name.length >= 3 && name.length <= 100,
    error:
      name.length < 3
        ? 'Название должно содержать минимум 3 символа'
        : name.length > 100
          ? 'Название слишком длинное'
          : '',
  }),
  validateDeckDescription: (desc: string) => ({
    isValid: desc.length <= 500,
    error: desc.length > 500 ? 'Описание слишком длинное' : '',
  }),
}));

describe('DeckEditPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeck = {
      id: 'test-deck-id',
      name: 'Test Deck',
      description: 'Test Description',
      cardCount: 2,
    };
    mockCards = [
      { id: 'card-1', question: 'Question 1', answer: 'Answer 1' },
      { id: 'card-2', question: 'Question 2', answer: 'Answer 2' },
    ];
    mockDeckLoading = false;
    mockCardsLoading = false;
    mockUpdateLoading = false;
    mockIsGeneratingShare = false;
    mockUpdateDeck.mockResolvedValue(undefined);
    mockShareDeck.mockResolvedValue({ token: 'share-token-123' });
    mockCreateCard.mockResolvedValue({ id: 'new-card', question: 'Q', answer: 'A' });
    mockUpdateCard.mockResolvedValue({ id: 'card-1', question: 'Updated Q', answer: 'Updated A' });
    mockDeleteCard.mockResolvedValue(true);

    // Мок clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  const renderDeckEditPage = () => {
    return renderWithRouter(<DeckEditPage />);
  };

  it('shows loading spinner when deck is loading', () => {
    mockDeckLoading = true;
    mockDeck = null;
    renderDeckEditPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('fetches deck and cards on mount', () => {
    renderDeckEditPage();

    expect(mockFetchDeck).toHaveBeenCalledWith('test-deck-id');
    expect(mockFetchCards).toHaveBeenCalled();
  });

  it('renders deck edit form with deck data', () => {
    renderDeckEditPage();

    expect(screen.getByText('Редактирование колоды')).toBeInTheDocument();
    expect(screen.getByTestId('input-Введите название колоды')).toHaveValue('Test Deck');
    expect(screen.getByTestId('input-Введите описание (необязательно)')).toHaveValue(
      'Test Description'
    );
  });

  it('navigates back when back button is clicked', () => {
    renderDeckEditPage();

    fireEvent.click(screen.getByText('Назад'));
    expect(mockNavigate).toHaveBeenCalledWith('/decks');
  });

  it('validates deck name', () => {
    renderDeckEditPage();

    const nameInput = screen.getByTestId('input-Введите название колоды');

    fireEvent.change(nameInput, { target: { value: 'ab' } });
    expect(screen.getByText('Название должно содержать минимум 3 символа')).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Valid Name' } });
    expect(
      screen.queryByText('Название должно содержать минимум 3 символа')
    ).not.toBeInTheDocument();
  });

  it('validates deck description', () => {
    renderDeckEditPage();

    const descInput = screen.getByTestId('input-Введите описание (необязательно)');

    const longDesc = 'a'.repeat(501);
    fireEvent.change(descInput, { target: { value: longDesc } });
    expect(screen.getByText('Описание слишком длинное')).toBeInTheDocument();

    fireEvent.change(descInput, { target: { value: 'Valid Description' } });
    expect(screen.queryByText('Описание слишком длинное')).not.toBeInTheDocument();
  });

  it('calls updateDeck when save button is clicked', async () => {
    renderDeckEditPage();

    const saveButton = screen.getByText('Сохранить');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateDeck).toHaveBeenCalledWith('test-deck-id', {
        name: 'Test Deck',
        description: 'Test Description',
      });
      expect(mockFetchDeck).toHaveBeenCalledWith('test-deck-id');
    });
  });

  it('does not save if validation fails', async () => {
    renderDeckEditPage();

    const nameInput = screen.getByTestId('input-Введите название колоды');
    fireEvent.change(nameInput, { target: { value: 'ab' } });

    const saveButton = screen.getByText('Сохранить');
    expect(saveButton).toBeDisabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateDeck).not.toHaveBeenCalled();
    });
  });

  it('disables save button when form is invalid', () => {
    renderDeckEditPage();

    const nameInput = screen.getByTestId('input-Введите название колоды');
    fireEvent.change(nameInput, { target: { value: '' } });

    const saveButton = screen.getByText('Сохранить');
    expect(saveButton).toBeDisabled();
  });

  it('renders form fields correctly', () => {
    renderDeckEditPage();

    expect(screen.getByText('Название')).toBeInTheDocument();
    expect(screen.getByText('Описание')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите название колоды')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите описание (необязательно)')).toBeInTheDocument();
  });

  it('renders character counters', () => {
    renderDeckEditPage();

    // Используем функцию для поиска текста
    const nameCounter = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element?.className.includes('sc-kcLKEh') &&
        content.includes('9') &&
        content.includes('90')
      );
    });
    expect(nameCounter).toBeInTheDocument();

    const descCounter = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element?.className.includes('sc-kcLKEh') &&
        content.includes('16') &&
        content.includes('200')
      );
    });
    expect(descCounter).toBeInTheDocument();
  });
  it('renders character counters', () => {
    renderDeckEditPage();

    const nameCounter = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element?.className.includes('sc-kcLKEh') &&
        content.includes('9') &&
        content.includes('90')
      );
    });
    expect(nameCounter).toBeInTheDocument();

    const descCounter = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element?.className.includes('sc-kcLKEh') &&
        content.includes('16') &&
        content.includes('200')
      );
    });
    expect(descCounter).toBeInTheDocument();
  });

  it('generates share link when share button is clicked', async () => {
    renderDeckEditPage();

    fireEvent.click(screen.getByText('Поделиться'));

    await waitFor(() => {
      expect(mockShareDeck).toHaveBeenCalledWith('test-deck-id');
    });
  });

  it('opens share modal with generated link', async () => {
    renderDeckEditPage();

    fireEvent.click(screen.getByText('Поделиться'));

    await waitFor(() => {
      expect(screen.getByTestId('share-modal')).toBeInTheDocument();
      expect(screen.getByDisplayValue(/shared-deck\/share-token-123/)).toBeInTheDocument();
    });
  });

  it('copies share link to clipboard', async () => {
    renderDeckEditPage();

    fireEvent.click(screen.getByText('Поделиться'));

    await waitFor(() => {
      expect(screen.getByTestId('share-modal')).toBeInTheDocument();
    });

    const copyButton = screen.getByText('Копировать ссылку');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(mockMessageSuccess).toHaveBeenCalledWith('Ссылка скопирована в буфер обмена');
    });
  });

  it('renders cards list', () => {
    renderDeckEditPage();

    expect(screen.getByText(`Карточки (2/${VALIDATION.CARD.MAX_CARDS})`)).toBeInTheDocument();
    expect(screen.getByTestId('card-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-card-2')).toBeInTheDocument();
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Question 2')).toBeInTheDocument();
  });

  it('shows empty state when no cards', () => {
    mockCards = [];
    renderDeckEditPage();

    expect(
      screen.getByText('Карточек пока нет. Создайте первую карточку для начала обучения.')
    ).toBeInTheDocument();
  });

  it('opens create card modal when add button is clicked', () => {
    renderDeckEditPage();

    fireEvent.click(screen.getByText('Добавить карточку'));

    expect(screen.getByTestId('create-card-modal')).toBeInTheDocument();
  });

  it('creates new card and refreshes data', async () => {
    renderDeckEditPage();

    fireEvent.click(screen.getByText('Добавить карточку'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateCard).toHaveBeenCalledWith({ question: 'Q', answer: 'A' });
      expect(mockSetCards).toHaveBeenCalled();
      expect(mockFetchDeck).toHaveBeenCalledWith('test-deck-id');
      expect(mockFetchCards).toHaveBeenCalled();
    });
  });

  it('opens edit modal when edit button is clicked on card', () => {
    renderDeckEditPage();

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(screen.getByTestId('edit-card-modal')).toBeInTheDocument();
  });

  it('updates card when edit form is submitted', async () => {
    renderDeckEditPage();

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockUpdateCard).toHaveBeenCalledWith('card-1', {
        question: 'Updated Q',
        answer: 'Updated A',
      });
    });
  });

  it('shows confirmation modal when delete button is clicked', () => {
    renderDeckEditPage();

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockModalConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Удалить карточку?',
        okText: 'Удалить',
      })
    );
  });

  it('deletes card when confirmed', async () => {
    mockModalConfirm.mockImplementation(({ onOk }) => onOk());

    renderDeckEditPage();

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteCard).toHaveBeenCalledWith('card-1');
      expect(mockSetCards).toHaveBeenCalled();
      expect(mockFetchDeck).toHaveBeenCalledWith('test-deck-id');
      expect(mockFetchCards).toHaveBeenCalled();
    });
  });
});
