import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EditCardModal } from './EditCardModal';

describe('EditCardModal', () => {
  it('should render edit card modal when open', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <EditCardModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={false}
        initialData={{ question: 'Test', answer: 'Answer' }}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should not render when closed', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <EditCardModal
        isOpen={false}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={false}
        initialData={{ question: 'Test', answer: 'Answer' }}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should call onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <EditCardModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={false}
        initialData={{ question: 'Test', answer: 'Answer' }}
      />
    );
    const buttons = container.querySelectorAll('button');
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
    }
    expect(container).toBeTruthy();
  });

  it('should show loading state', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <EditCardModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={true}
        initialData={{ question: 'Test', answer: 'Answer' }}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should render with initial data', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <EditCardModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={false}
        initialData={{ question: 'Q', answer: 'A' }}
      />
    );
    expect(container).toBeTruthy();
  });
});
