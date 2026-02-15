import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RegisterForm } from './RegisterForm';
import { BrowserRouter } from 'react-router-dom';

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
    const { container } = render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );
    expect(container.querySelector('form')).toBeTruthy();
  });

  it('should render input fields', () => {
    const { container } = render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );
    expect(container.querySelectorAll('input').length).toBeGreaterThan(0);
  });

  it('should render submit button', () => {
    const { container } = render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('should render form element', () => {
    const { container } = render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
  });
});
