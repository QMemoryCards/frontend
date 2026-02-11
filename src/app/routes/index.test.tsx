import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppRouter } from './index';

vi.mock('react-router-dom', () => ({
  createBrowserRouter: vi.fn(),
  RouterProvider: vi.fn(() => null),
}));

vi.mock('antd', () => ({
  App: {
    useApp: () => ({
      message: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
      },
    }),
  },
  Button: vi.fn(({ children }) => <button>{children}</button>),
}));

vi.mock('@shared/lib/toast', () => ({
  setGlobalMessage: vi.fn(),
}));

describe('AppRouter', () => {
  it('should render AppRouter component', () => {
    const { container } = render(<AppRouter />);
    expect(container).toBeTruthy();
  });
});
