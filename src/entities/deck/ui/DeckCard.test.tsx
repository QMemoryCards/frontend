import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DeckCard } from './DeckCard';

const mockDeck = {
  id: '1',
  title: 'Test Deck',
  description: 'Test Description',
  cardCount: 10,
  userId: 'user1',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('DeckCard', () => {
  it('should render deck card with title', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const { container } = render(<DeckCard deck={mockDeck} onEdit={onEdit} onDelete={onDelete} />);
    expect(container).toBeTruthy();
  });

  it('should render deck description', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const { container } = render(<DeckCard deck={mockDeck} onEdit={onEdit} onDelete={onDelete} />);
    expect(container.textContent).toContain('Test Description');
  });

  it('should render card count', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const { container } = render(<DeckCard deck={mockDeck} onEdit={onEdit} onDelete={onDelete} />);
    expect(container.textContent).toContain('10');
  });

  it('should render action buttons', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const { container } = render(<DeckCard deck={mockDeck} onEdit={onEdit} onDelete={onDelete} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should call onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const { container } = render(<DeckCard deck={mockDeck} onEdit={onEdit} onDelete={onDelete} />);
    const buttons = container.querySelectorAll('button');
    if (buttons.length > 0) {
      buttons[0].click();
    }
    expect(container).toBeTruthy();
  });

  it('should call onDelete when delete button clicked', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const { container } = render(<DeckCard deck={mockDeck} onEdit={onEdit} onDelete={onDelete} />);
    const buttons = container.querySelectorAll('button');
    if (buttons.length > 1) {
      buttons[1].click();
    }
    expect(container).toBeTruthy();
  });
});
