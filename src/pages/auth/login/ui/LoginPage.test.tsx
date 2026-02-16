import { describe, expect, it, vi } from 'vitest';
import { LoginPage } from './LoginPage';
import { renderWithRouter } from '@/test/utils.tsx';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('antd', () => ({
  App: {
    useApp: () => ({
      message: {
        success: vi.fn(),
        error: vi.fn(),
      },
    }),
  },
}));

describe('LoginPage', () => {
  it('should render login page', () => {
    const { container } = renderWithRouter(<LoginPage />);
    expect(container).toBeTruthy();
  });

  it('should render login form', () => {
    const { container } = renderWithRouter(<LoginPage />);
    expect(container.querySelector('form')).toBeTruthy();
  });

  it('should render page content', () => {
    const { container } = renderWithRouter(<LoginPage />);
    expect(container.textContent).toBeTruthy();
  });
});
