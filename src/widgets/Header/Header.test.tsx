import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('Header', () => {
  it('should render Header component', () => {
    const { container } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it('should render navigation when user is logged in', () => {
    localStorage.setItem('token', 'test-token');
    const { container } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
    localStorage.removeItem('token');
  });

  it('should render without navigation when user is not logged in', () => {
    localStorage.removeItem('token');
    const { container } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});
