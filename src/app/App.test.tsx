import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./routes', () => ({
  AppRouter: () => <div>AppRouter</div>,
}));

vi.mock('./providers', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('App', () => {
  it('should render App component', () => {
    render(<App />);
    expect(screen.getByText('AppRouter')).toBeInTheDocument();
  });
});
