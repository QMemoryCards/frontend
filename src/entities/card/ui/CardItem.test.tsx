import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardItem } from './CardItem';
import type { Card } from '../model/types';

describe('CardItem', () => {
  const mockCard: Card = {
    id: '1',
    question: 'What is React?',
    answer: 'A JavaScript library for building user interfaces',
    isLearned: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render card with question and answer', () => {
    render(<CardItem card={mockCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('What is React?')).toBeInTheDocument();
    expect(
      screen.getByText('A JavaScript library for building user interfaces')
    ).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<CardItem card={mockCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButton = screen.getByRole('button', { name: /редактировать/i });
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockCard);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<CardItem card={mockCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /удалить/i });
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('should render with long question and answer text', () => {
    const longCard: Card = {
      ...mockCard,
      question:
        'This is a very long question that should be properly wrapped and displayed in the card component',
      answer:
        'This is a very long answer that should also be properly wrapped and displayed in the card component',
    };

    render(<CardItem card={longCard} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText(longCard.question)).toBeInTheDocument();
    expect(screen.getByText(longCard.answer)).toBeInTheDocument();
  });
});
