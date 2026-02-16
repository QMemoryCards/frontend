import { fireEvent, render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import { describe, expect, it } from 'vitest';

const ThrowError = () => {
  throw new Error('Test error');
};

const NormalChild = () => <div>Normal child</div>;

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(container).toBeTruthy();
  });

  it('should catch error and show fallback', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(await screen.findByText(/Что-то пошло не так/i)).toBeInTheDocument();
    expect(screen.getByText(/Произошла непредвиденная ошибка/i)).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  const originalEnv = process.env.NODE_ENV;
  const originalLocation = window.location;

  beforeEach(() => {
    vi.resetAllMocks();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, href: '' },
    });
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <NormalChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal child')).toBeInTheDocument();
    expect(screen.queryByText(/Что-то пошло не так/i)).not.toBeInTheDocument();
  });

  it('catches error and displays fallback UI', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(await screen.findByText(/Что-то пошло не так/i)).toBeInTheDocument();
    expect(screen.getByText(/Произошла непредвиденная ошибка/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Перезагрузить страницу/i })).toBeInTheDocument();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Uncaught error:',
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    );

    consoleErrorSpy.mockRestore();
  });

  it('reloads page when reload button is clicked', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const reloadButton = await screen.findByRole('button', { name: /Перезагрузить страницу/i });
    fireEvent.click(reloadButton);

    expect(window.location.href).toBe('/');

    consoleErrorSpy.mockRestore();
  });

  describe('in development mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('shows error details when error occurs', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      await screen.findByRole('button', { name: /Перезагрузить страницу/i });

      expect(screen.getByText(/Детали ошибки \(только в режиме разработки\)/i)).toBeInTheDocument();

      expect(screen.getByText(/Error: Test error/i)).toBeInTheDocument();
      expect(screen.getByText(/Component Stack:/i)).toBeInTheDocument();
      expect(screen.getByText(/ThrowError/i)).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('in production mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('does not show error details', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      await screen.findByRole('button', { name: /Перезагрузить страницу/i });

      expect(
        screen.queryByText(/Детали ошибки \(только в режиме разработки\)/i)
      ).not.toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });
  });
});
