import { describe, expect, it, vi } from 'vitest';
import { RegisterForm } from './RegisterForm';
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

describe('RegisterForm', () => {
  it('should render register form', () => {
    const { container } = renderWithRouter(<RegisterForm />);
    expect(container.querySelector('form')).toBeTruthy();
  });

  it('should render input fields', () => {
    const { container } = renderWithRouter(<RegisterForm />);
    expect(container.querySelectorAll('input').length).toBeGreaterThan(0);
  });

  it('should render submit button', () => {
    const { container } = renderWithRouter(<RegisterForm />);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('should render form element', () => {
    const { container } = renderWithRouter(<RegisterForm />);
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
  });
});
