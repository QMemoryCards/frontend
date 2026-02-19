import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DeckCard } from './DeckCard';
import type { DeckDetails } from '../model/types';

vi.mock('@ant-design/icons', () => ({
  EditOutlined: () => <span data-testid="edit-icon">Edit</span>,
  DeleteOutlined: () => <span data-testid="delete-icon">Delete</span>,
  PlayCircleOutlined: () => <span data-testid="play-icon">Play</span>,
}));

describe('DeckCard', () => {
  const baseDeck: DeckDetails = {
    id: '1',
    name: 'Test Deck',
    description: 'Test Description',
    cardCount: 10,
    learnedPercent: 30,
    lastStudied: '2025-02-15T10:00:00Z',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  it('renders deck name and description', () => {
    render(<DeckCard deck={baseDeck} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Test Deck')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('does not render description if not provided', () => {
    const deckWithoutDesc = { ...baseDeck, description: undefined };
    render(<DeckCard deck={deckWithoutDesc} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('displays card count and learned percent', () => {
    render(<DeckCard deck={baseDeck} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('shows 0 card count and learned percent if values are missing', () => {
    const deckMissingStats = {
      ...baseDeck,
      cardCount: undefined,
      learnedPercent: undefined,
    } as unknown as DeckDetails;
    render(<DeckCard deck={deckMissingStats} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<DeckCard deck={baseDeck} onEdit={onEdit} onDelete={vi.fn()} />);

    const editButton = screen.getByLabelText('Редактировать');
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(baseDeck);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<DeckCard deck={baseDeck} onEdit={vi.fn()} onDelete={onDelete} />);

    const deleteButton = screen.getByLabelText('Удалить');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(baseDeck.id);
  });

  it('calls onClick when card is clicked', () => {
    const onClick = vi.fn();
    render(<DeckCard deck={baseDeck} onEdit={vi.fn()} onDelete={vi.fn()} onClick={onClick} />);

    fireEvent.click(screen.getByText('Test Deck'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(baseDeck.id);
  });

  it('does not call onClick if not provided', () => {
    const onClick = vi.fn();
    render(<DeckCard deck={baseDeck} onEdit={vi.fn()} onDelete={vi.fn()} />);

    fireEvent.click(screen.getByText('Test Deck'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls onStudy when study button is clicked and onStudy is provided', () => {
    const onStudy = vi.fn();
    render(<DeckCard deck={baseDeck} onEdit={vi.fn()} onDelete={vi.fn()} onStudy={onStudy} />);

    const studyButton = screen.getByRole('button', { name: /изучить/i });
    fireEvent.click(studyButton);

    expect(onStudy).toHaveBeenCalledTimes(1);
    expect(onStudy).toHaveBeenCalledWith(baseDeck.id);
  });

  it('does not call onStudy when study button is clicked and onStudy is not provided', () => {
    const onStudy = vi.fn();
    render(<DeckCard deck={baseDeck} onEdit={vi.fn()} onDelete={vi.fn()} />);

    const studyButton = screen.getByRole('button', { name: /изучить/i });
    fireEvent.click(studyButton);

    expect(onStudy).not.toHaveBeenCalled();
  });

  it('disables study button and shows "Нет карточек" when cardCount is 0', () => {
    const deckWithNoCards = { ...baseDeck, cardCount: 0 };
    const onStudy = vi.fn();
    render(
      <DeckCard deck={deckWithNoCards} onEdit={vi.fn()} onDelete={vi.fn()} onStudy={onStudy} />
    );

    const studyButton = screen.getByRole('button', { name: /нет карточек/i });
    expect(studyButton).toBeDisabled();

    fireEvent.click(studyButton);
    expect(onStudy).not.toHaveBeenCalled();
  });

  describe('formatDate', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-02-20T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "Никогда" when lastStudied is null', () => {
      const deck = { ...baseDeck, lastStudied: null };
      render(<DeckCard deck={deck} onEdit={vi.fn()} onDelete={vi.fn()} />);

      expect(screen.getByText(/Последнее изучение:/)).toHaveTextContent('Никогда');
    });

    it('returns "Сегодня" for today', () => {
      const deck = { ...baseDeck, lastStudied: '2025-02-20T08:00:00Z' };
      render(<DeckCard deck={deck} onEdit={vi.fn()} onDelete={vi.fn()} />);

      expect(screen.getByText(/Последнее изучение:/)).toHaveTextContent('Сегодня');
    });

    it('returns "Вчера" for yesterday', () => {
      const deck = { ...baseDeck, lastStudied: '2025-02-19T06:00:00Z' };
      render(<DeckCard deck={deck} onEdit={vi.fn()} onDelete={vi.fn()} />);

      expect(screen.getByText(/Последнее изучение:/)).toHaveTextContent('Вчера');
    });

    it('returns "X дн. назад" for less than 7 days', () => {
      const deck = { ...baseDeck, lastStudied: '2025-02-16T10:00:00Z' };
      render(<DeckCard deck={deck} onEdit={vi.fn()} onDelete={vi.fn()} />);

      expect(screen.getByText(/Последнее изучение:/)).toHaveTextContent('4 дн. назад');
    });

    it('returns "X нед. назад" for less than 30 days', () => {
      const deck = { ...baseDeck, lastStudied: '2025-02-01T10:00:00Z' };
      render(<DeckCard deck={deck} onEdit={vi.fn()} onDelete={vi.fn()} />);

      expect(screen.getByText(/Последнее изучение:/)).toHaveTextContent('2 нед. назад');
    });

    it('returns "X мес. назад" for less than 365 days', () => {
      const deck = { ...baseDeck, lastStudied: '2024-12-01T10:00:00Z' };
      render(<DeckCard deck={deck} onEdit={vi.fn()} onDelete={vi.fn()} />);

      expect(screen.getByText(/Последнее изучение:/)).toHaveTextContent('2 мес. назад');
    });

    it('returns formatted date for more than a year', () => {
      const deck = { ...baseDeck, lastStudied: '2023-02-15T10:00:00Z' };
      render(<DeckCard deck={deck} onEdit={vi.fn()} onDelete={vi.fn()} />);

      const expectedDate = new Date('2023-02-15T10:00:00Z').toLocaleDateString('ru-RU');
      expect(screen.getByText(/Последнее изучение:/)).toHaveTextContent(expectedDate);
    });
  });

  it('applies correct progress bar width based on learnedPercent', () => {
    const deck = { ...baseDeck, learnedPercent: 45 };
    render(<DeckCard deck={deck} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('45%')).toBeInTheDocument();
  });
});
