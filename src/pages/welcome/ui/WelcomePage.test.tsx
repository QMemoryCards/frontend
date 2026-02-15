import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WelcomePage } from './WelcomePage';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('WelcomePage', () => {
  it('should render welcome page', () => {
    const { container } = render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it('should render without errors', () => {
    const { container } = render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('should render all buttons', () => {
    const { container } = render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
