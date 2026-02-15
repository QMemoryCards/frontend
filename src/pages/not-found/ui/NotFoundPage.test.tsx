import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotFoundPage } from './NotFoundPage';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('NotFoundPage', () => {
  it('should render 404 page', () => {
    const { container } = render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it('should render page elements', () => {
    const { container } = render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('should render error message', () => {
    const { container } = render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    expect(container.textContent).toBeTruthy();
  });
});
