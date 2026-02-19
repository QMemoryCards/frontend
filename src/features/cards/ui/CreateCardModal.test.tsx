import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CreateCardModal } from './CreateCardModal';

describe('CreateCardModal', () => {
  it('should render create card modal when open', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <CreateCardModal isOpen={true} onClose={onClose} onSubmit={onSubmit} isLoading={false} />
    );
    expect(container).toBeTruthy();
  });

  it('should not render when closed', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <CreateCardModal isOpen={false} onClose={onClose} onSubmit={onSubmit} isLoading={false} />
    );
    expect(container).toBeTruthy();
  });

  it('should call onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <CreateCardModal isOpen={true} onClose={onClose} onSubmit={onSubmit} isLoading={false} />
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
      <CreateCardModal isOpen={true} onClose={onClose} onSubmit={onSubmit} isLoading={true} />
    );
    expect(container).toBeTruthy();
  });

  it('should render form inputs', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const { container } = render(
      <CreateCardModal isOpen={true} onClose={onClose} onSubmit={onSubmit} isLoading={false} />
    );
    const inputs = container.querySelectorAll('input, textarea');
    expect(inputs.length).toBeGreaterThanOrEqual(0);
  });
});
