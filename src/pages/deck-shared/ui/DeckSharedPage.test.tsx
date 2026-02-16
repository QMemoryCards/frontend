import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SharedDeckPage } from './DeckSharedPage';
import { VALIDATION } from '@shared/config';
import { renderWithRouter } from '@/test/utils.tsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ token: 'test-token-123' }),
  };
});

const mockModalOnOk = vi.fn();
const mockModalOnCancel = vi.fn();

vi.mock('antd', () => ({
  Modal: ({ open, title, onOk, onCancel, children, okButtonProps, confirmLoading }: any) =>
    open ? (
      <div data-testid="import-modal">
        <h3>{title}</h3>
        {children}
        <button
          data-testid="modal-ok"
          onClick={onOk}
          disabled={okButtonProps?.disabled || confirmLoading}
        >
          Импортировать
        </button>
        <button data-testid="modal-cancel" onClick={onCancel}>
          Отмена
        </button>
      </div>
    ) : null,
  Button: ({ children, onClick, disabled, icon, type }: any) => (
    <button onClick={onClick} disabled={disabled} data-type={type} data-testid="button">
      {icon && <span data-testid="button-icon">{icon}</span>}
      {children}
    </button>
  ),
  Input: ({ value, onChange, placeholder, disabled }: any) => (
    <input
      data-testid={`input-${placeholder}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  ),
}));

const mockFetchSharedDeck = vi.fn();
const mockImportDeck = vi.fn();

let mockDeck = null;
let mockIsLoading = false;
let mockError = null;
let mockImportedDeck = null;
let mockIsImporting = false;

vi.mock('@features/decks/model/useDecks.ts', () => ({
  useSharedDeck: () => ({
    deck: mockDeck,
    isLoading: mockIsLoading,
    error: mockError,
    fetchSharedDeck: mockFetchSharedDeck,
  }),
  useImportSharedDeck: () => ({
    importDeck: mockImportDeck,
    isLoading: mockIsImporting,
    importedDeck: mockImportedDeck,
  }),
}));

vi.mock('@shared/ui', () => ({
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

describe('SharedDeckPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeck = {
      id: '1',
      name: 'Test Shared Deck',
      description: 'Test Description',
      cardCount: 15,
    };
    mockIsLoading = false;
    mockError = null;
    mockImportedDeck = null;
    mockIsImporting = false;
    mockImportDeck.mockResolvedValue({ id: 'imported-1', name: 'Imported Deck' });
    mockFetchSharedDeck.mockResolvedValue(undefined);
  });

  const renderSharedDeckPage = () => {
    return renderWithRouter(<SharedDeckPage />);
  };

  it('shows loading spinner when isLoading is true', () => {
    mockIsLoading = true;
    renderSharedDeckPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('fetches shared deck on mount with token', () => {
    renderSharedDeckPage();

    expect(mockFetchSharedDeck).toHaveBeenCalledWith('test-token-123');
  });

  it('shows error message when error occurs', () => {
    mockError = 'Deck not found';
    renderSharedDeckPage();

    expect(screen.getByText(/Ошибка загрузки колоды: Deck not found/)).toBeInTheDocument();
  });

  it('displays deck information when loaded', () => {
    renderSharedDeckPage();

    expect(screen.getByText('Общий доступ к колоде')).toBeInTheDocument();
    expect(screen.getByText('Test Shared Deck')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Импортировать колоду')).toBeInTheDocument();
  });

  it('handles deck without description', () => {
    mockDeck = { ...mockDeck, description: null };
    renderSharedDeckPage();

    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('opens import modal when import button is clicked', () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    expect(screen.getByTestId('import-modal')).toBeInTheDocument();
    expect(screen.getByText('Импорт колоды')).toBeInTheDocument();
  });

  it('sets default import name with "(импорт)" suffix', () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    const nameInput = screen.getByTestId('input-Введите название колоды');
    expect(nameInput).toHaveValue('Test Shared Deck (импорт)');
  });

  it('validates import name', () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    const nameInput = screen.getByTestId('input-Введите название колоды');

    fireEvent.change(nameInput, { target: { value: 'ab' } });
    expect(screen.getByText('Название должно содержать минимум 3 символа')).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Valid Name' } });
    expect(
      screen.queryByText('Название должно содержать минимум 3 символа')
    ).not.toBeInTheDocument();
  });

  it('validates import description', () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    const descInput = screen.getByTestId('input-Введите описание (необязательно)');

    const longDesc = 'a'.repeat(501);
    fireEvent.change(descInput, { target: { value: longDesc } });
    expect(screen.getByText('Описание слишком длинное')).toBeInTheDocument();

    fireEvent.change(descInput, { target: { value: 'Valid Description' } });
    expect(screen.queryByText('Описание слишком длинное')).not.toBeInTheDocument();
  });

  it('disables import button when form is invalid', () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    const nameInput = screen.getByTestId('input-Введите название колоды');
    fireEvent.change(nameInput, { target: { value: 'ab' } }); // невалидное

    const modalOkButton = screen.getByTestId('modal-ok');
    expect(modalOkButton).toBeDisabled();
  });

  it('calls importDeck with form data when submitting', async () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    const nameInput = screen.getByTestId('input-Введите название колоды');
    fireEvent.change(nameInput, { target: { value: 'My Custom Deck Name' } });

    const descInput = screen.getByTestId('input-Введите описание (необязательно)');
    fireEvent.change(descInput, { target: { value: 'My Custom Description' } });

    fireEvent.click(screen.getByTestId('modal-ok'));

    await waitFor(() => {
      expect(mockImportDeck).toHaveBeenCalledWith('test-token-123', {
        newName: 'My Custom Deck Name',
        newDescription: 'My Custom Description',
      });
    });
  });

  it('navigates to edit page after successful import', async () => {
    mockImportDeck.mockResolvedValue({ id: 'imported-123', name: 'Imported Deck' });

    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));
    fireEvent.click(screen.getByTestId('modal-ok'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/decks/imported-123/edit');
    });
  });

  it('shows success message when importedDeck exists', () => {
    mockImportedDeck = { id: 'imported-1', name: 'Imported Deck' };
    renderSharedDeckPage();

    expect(screen.getByText('Колода успешно импортирована!')).toBeInTheDocument();
    expect(screen.getByText('Название: Imported Deck')).toBeInTheDocument();
  });

  it('fetch deck again if already fetched', () => {
    renderSharedDeckPage();

    expect(mockFetchSharedDeck).toHaveBeenCalledTimes(1);

    renderSharedDeckPage();

    expect(mockFetchSharedDeck).toHaveBeenCalledTimes(2);
  });

  it('sets import values only when deck exists', () => {
    mockDeck = null;
    renderSharedDeckPage();

    expect(screen.queryByTestId('import-modal')).not.toBeInTheDocument();
  });

  it('does not submit if validation fails', async () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    const nameInput = screen.getByTestId('input-Введите название колоды');
    fireEvent.change(nameInput, { target: { value: 'ab' } }); // невалидное

    fireEvent.click(screen.getByTestId('modal-ok'));

    await waitFor(() => {
      expect(mockImportDeck).not.toHaveBeenCalled();
    });
  });

  it('validates form correctly with empty fields', () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    const nameInput = screen.getByTestId('input-Введите название колоды');
    fireEvent.change(nameInput, { target: { value: '' } });

    const modalOkButton = screen.getByTestId('modal-ok');
    expect(modalOkButton).toBeDisabled();
  });

  it('renders header and message correctly', () => {
    renderSharedDeckPage();

    expect(screen.getByText('Общий доступ к колоде')).toBeInTheDocument();
    expect(
      screen.getByText('Вы просматриваете колоду, которой поделился другой пользователь.')
    ).toBeInTheDocument();
  });

  it('renders success icon', () => {
    renderSharedDeckPage();

    const successIcon = screen.getByText('✓');
    expect(successIcon).toBeInTheDocument();
  });

  it('renders deck info with correct labels', () => {
    renderSharedDeckPage();

    expect(screen.getByText('Название колоды:')).toBeInTheDocument();
    expect(screen.getByText('Количество карточек:')).toBeInTheDocument();
  });

  it('renders modal with correct fields', () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    expect(screen.getByText('Название колоды')).toBeInTheDocument();
    expect(screen.getByText('Описание')).toBeInTheDocument();
    expect(screen.getByText(/Вы можете изменить название/)).toBeInTheDocument();
  });

  it('disables inputs when importing', () => {
    mockIsImporting = true;
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    const nameInput = screen.getByTestId('input-Введите название колоды');
    expect(nameInput).toBeDisabled();
  });

  it('handles fetch error with console.error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetchSharedDeck.mockRejectedValueOnce(new Error('Fetch failed'));

    renderSharedDeckPage();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('shows character counter for name', () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    const nameInput = screen.getByTestId('input-Введите название колоды');
    fireEvent.change(nameInput, { target: { value: 'Valid Name' } });

    expect(screen.getByText(`10/${VALIDATION.DECK.NAME_MAX}`)).toBeInTheDocument();
  });

  it('shows character counter for description', () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    const descInput = screen.getByTestId('input-Введите описание (необязательно)');
    fireEvent.change(descInput, { target: { value: 'Valid Description' } });

    const counterElement = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element?.className.includes('sc-dNdcvo') &&
        content.includes('17') &&
        content.includes('200')
      );
    });
    expect(counterElement).toBeInTheDocument();
  });

  it('handles empty description correctly', () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));

    const descInput = screen.getByTestId('input-Введите описание (необязательно)');
    fireEvent.change(descInput, { target: { value: '' } });

    const counterElement = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element?.className.includes('sc-dNdcvo') &&
        content.includes('0') &&
        content.includes('200')
      );
    });
    expect(counterElement).toBeInTheDocument();
  });

  it('closes modal on cancel', () => {
    renderSharedDeckPage();

    fireEvent.click(screen.getByText('Импортировать колоду'));
    expect(screen.getByTestId('import-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('modal-cancel'));
    expect(screen.queryByTestId('import-modal')).not.toBeInTheDocument();
  });
});
