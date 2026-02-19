import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateDeckModal } from './CreateDeckModal';

vi.mock('antd', () => ({
  Modal: ({ open, title, onOk, onCancel, children, okButtonProps, confirmLoading }: any) =>
    open ? (
      <div data-testid="create-deck-modal">
        <h3>{title}</h3>
        {children}
        <button
          data-testid="modal-ok"
          onClick={onOk}
          disabled={okButtonProps?.disabled || confirmLoading}
        >
          Создать
        </button>
        <button data-testid="modal-cancel" onClick={onCancel}>
          Отмена
        </button>
      </div>
    ) : null,
}));

vi.mock('@shared/ui', () => ({
  Input: ({
    value,
    onChange,
    onBlur,
    placeholder,
    disabled,
    label,
    error,
    helperText,
    maxLength,
    type,
  }: any) => {
    const inputId = `input-${label?.replace(/[^a-zA-Z]/g, '')}`;
    return (
      <div data-testid="input-container">
        {label && <label htmlFor={inputId}>{label}</label>}
        <input
          id={inputId}
          data-testid="input-field"
          type={type || 'text'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
        />
        {helperText && <span data-testid="helper-text">{helperText}</span>}
        {error && <span data-testid="error-text">{error}</span>}
      </div>
    );
  },
}));

vi.mock('@shared/lib/validation', () => ({
  validateDeckName: (name: string) => ({
    isValid: name.length >= 3 && name.length <= 90,
    error:
      name.length < 3
        ? 'Название должно содержать минимум 3 символа'
        : name.length > 90
          ? 'Название слишком длинное'
          : '',
  }),
  validateDeckDescription: (desc: string) => ({
    isValid: desc.length <= 200,
    error: desc.length > 200 ? 'Описание слишком длинное' : '',
  }),
}));

describe('CreateDeckModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockResolvedValue(true);
  });

  const renderCreateDeckModal = (props = {}) => {
    return render(
      <CreateDeckModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
        {...props}
      />
    );
  };

  it('renders modal when open', () => {
    renderCreateDeckModal();

    expect(screen.getByTestId('create-deck-modal')).toBeInTheDocument();
    expect(screen.getByText('Создать новую колоду')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <CreateDeckModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('create-deck-modal')).not.toBeInTheDocument();
  });

  it('resets form when modal closes', () => {
    const { rerender } = renderCreateDeckModal();

    const inputField = screen.getByTestId('input-field');
    fireEvent.change(inputField, { target: { value: 'Test Deck' } });
    fireEvent.blur(inputField);

    expect(inputField).toHaveValue('Test Deck');

    rerender(
      <CreateDeckModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    rerender(
      <CreateDeckModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.getByTestId('input-field')).toHaveValue('');
    expect(screen.getByPlaceholderText('Добавьте описание колоды (необязательно)')).toHaveValue('');
  });

  it('shows name validation error only after field is touched', () => {
    renderCreateDeckModal();

    const inputField = screen.getByTestId('input-field');

    fireEvent.change(inputField, { target: { value: 'a' } });
    expect(screen.queryByTestId('error-text')).not.toBeInTheDocument();

    fireEvent.blur(inputField);
    expect(screen.getByText('Название должно содержать минимум 3 символа')).toBeInTheDocument();
  });

  it('calls onSubmit with form data when valid', async () => {
    renderCreateDeckModal();

    const inputField = screen.getByTestId('input-field');
    fireEvent.change(inputField, { target: { value: 'New Deck' } });
    fireEvent.blur(inputField);

    const okButton = screen.getByTestId('modal-ok');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Deck',
        description: undefined,
      });
    });
  });

  it('calls onSubmit with description when provided', async () => {
    renderCreateDeckModal();

    const inputField = screen.getByTestId('input-field');
    fireEvent.change(inputField, { target: { value: 'New Deck' } });
    fireEvent.blur(inputField);

    const textarea = screen.getByPlaceholderText('Добавьте описание колоды (необязательно)');
    fireEvent.change(textarea, { target: { value: 'Test Description' } });

    const okButton = screen.getByTestId('modal-ok');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Deck',
        description: 'Test Description',
      });
    });
  });

  it('does not submit if name is invalid', async () => {
    renderCreateDeckModal();

    const inputField = screen.getByTestId('input-field');
    fireEvent.change(inputField, { target: { value: 'a' } });
    fireEvent.blur(inputField);

    const okButton = screen.getByTestId('modal-ok');
    expect(okButton).toBeDisabled();

    fireEvent.click(okButton);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('does not submit if description is invalid', async () => {
    renderCreateDeckModal();

    const inputField = screen.getByTestId('input-field');
    fireEvent.change(inputField, { target: { value: 'Valid Name' } });
    fireEvent.blur(inputField);

    const textarea = screen.getByPlaceholderText('Добавьте описание колоды (необязательно)');
    fireEvent.change(textarea, { target: { value: 'a'.repeat(201) } });

    const okButton = screen.getByTestId('modal-ok');
    expect(okButton).toBeDisabled();

    fireEvent.click(okButton);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('handles empty description as undefined', async () => {
    renderCreateDeckModal();

    const inputField = screen.getByTestId('input-field');
    fireEvent.change(inputField, { target: { value: 'New Deck' } });
    fireEvent.blur(inputField);

    const textarea = screen.getByPlaceholderText('Добавьте описание колоды (необязательно)');
    fireEvent.change(textarea, { target: { value: '   ' } });

    const okButton = screen.getByTestId('modal-ok');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Deck',
        description: undefined,
      });
    });
  });

  it('disables submit button when form is invalid', () => {
    renderCreateDeckModal();

    const okButton = screen.getByTestId('modal-ok');
    expect(okButton).toBeDisabled();

    const inputField = screen.getByTestId('input-field');
    fireEvent.change(inputField, { target: { value: 'Valid Name' } });
    fireEvent.blur(inputField);

    expect(okButton).not.toBeDisabled();
  });

  it('closes modal only on successful submit', async () => {
    mockOnSubmit.mockResolvedValue(true);
    renderCreateDeckModal();

    const inputField = screen.getByTestId('input-field');
    fireEvent.change(inputField, { target: { value: 'New Deck' } });
    fireEvent.blur(inputField);

    const okButton = screen.getByTestId('modal-ok');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('does not close modal if submit fails', async () => {
    mockOnSubmit.mockResolvedValue(false);
    renderCreateDeckModal();

    const inputField = screen.getByTestId('input-field');
    fireEvent.change(inputField, { target: { value: 'New Deck' } });
    fireEvent.blur(inputField);

    const okButton = screen.getByTestId('modal-ok');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('closes modal when cancel button is clicked', () => {
    renderCreateDeckModal();

    const cancelButton = screen.getByTestId('modal-cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    renderCreateDeckModal({ isLoading: true });

    const okButton = screen.getByTestId('modal-ok');
    expect(okButton).toBeDisabled();

    const inputField = screen.getByTestId('input-field');
    expect(inputField).toBeDisabled();

    const textarea = screen.getByPlaceholderText('Добавьте описание колоды (необязательно)');
    expect(textarea).toBeDisabled();
  });

  it('displays character counters', () => {
    renderCreateDeckModal();

    const nameCounter = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element?.getAttribute('data-testid') === 'helper-text' &&
        content.includes('0') &&
        content.includes('90')
      );
    });
    expect(nameCounter).toBeInTheDocument();

    const descCounter = screen.getByText((content, element) => {
      return (
        element?.className.includes('sc-jwTyAe') && content.includes('0') && content.includes('200')
      );
    });
    expect(descCounter).toBeInTheDocument();

    const inputField = screen.getByTestId('input-field');
    fireEvent.change(inputField, { target: { value: 'Test Deck' } });

    const updatedNameCounter = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element?.getAttribute('data-testid') === 'helper-text' &&
        content.includes('9') &&
        content.includes('90')
      );
    });
    expect(updatedNameCounter).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText('Добавьте описание колоды (необязательно)');
    fireEvent.change(textarea, { target: { value: 'Test Description' } });

    const updatedDescCounter = screen.getByText((content, element) => {
      return (
        element?.className.includes('sc-jwTyAe') &&
        content.includes('16') &&
        content.includes('200')
      );
    });
    expect(updatedDescCounter).toBeInTheDocument();
  });

  it('renders form inputs', () => {
    renderCreateDeckModal();

    expect(screen.getByText('Название *')).toBeInTheDocument();
    expect(screen.getByText('Описание')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите название колоды')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Добавьте описание колоды (необязательно)')
    ).toBeInTheDocument();
  });
});
