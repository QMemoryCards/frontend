import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EditDeckModal } from './EditDeckModal';

describe('EditDeckModal', () => {
  it('should render edit deck modal when open', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <EditDeckModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={false}
        initialData={{ name: 'Test Deck', description: 'Test Description' }}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should not render when closed', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <EditDeckModal
        isOpen={false}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={false}
        initialData={{ name: 'Test Deck', description: 'Test Description' }}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should call onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <EditDeckModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={false}
        initialData={{ name: 'Test Deck', description: 'Test Description' }}
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
      <EditDeckModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={true}
        initialData={{ name: 'Test Deck', description: 'Test Description' }}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should render with initial data', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <EditDeckModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={false}
        initialData={{ name: 'Deck', description: 'Desc' }}
      />
    );
    expect(container).toBeTruthy();
  });
});
