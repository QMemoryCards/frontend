import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';
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

describe('LoginForm', () => {
  it('should render login form', () => {
    const { container } = renderWithRouter(<LoginForm />);
    expect(container.querySelector('form')).toBeTruthy();
  });

  it('should render input fields', () => {
    const { container } = renderWithRouter(<LoginForm />);
    expect(container.querySelectorAll('input').length).toBeGreaterThan(0);
  });

  it('should render submit button', () => {
    const { container } = renderWithRouter(<LoginForm />);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('should render form element', () => {
    const { container } = renderWithRouter(<LoginForm />);
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
  });
});
