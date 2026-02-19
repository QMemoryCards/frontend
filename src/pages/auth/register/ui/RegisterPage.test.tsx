import { describe, expect, it, vi } from 'vitest';
import { RegisterPage } from './RegisterPage';
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

describe('RegisterPage', () => {
  it('should render register page', () => {
    const { container } = renderWithRouter(<RegisterPage />);
    expect(container).toBeTruthy();
  });

  it('should render register form', () => {
    const { container } = renderWithRouter(<RegisterPage />);
    expect(container.querySelector('form')).toBeTruthy();
  });

  it('should render page content', () => {
    const { container } = renderWithRouter(<RegisterPage />);
    expect(container.textContent).toBeTruthy();
  });
});
