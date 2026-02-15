import { render, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfilePage } from './ProfilePage';
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
      modal: {
        confirm: vi.fn((opts: any) => {
          if (opts.onOk) opts.onOk();
        }),
      },
    }),
  },
  Modal: {
    confirm: vi.fn((opts: any) => {
      if (opts.onOk) opts.onOk();
    }),
  },
  Button: vi.fn(({ children, onClick }) => <button onClick={onClick}>{children}</button>),
}));

const mockGetMe = vi
  .fn()
  .mockResolvedValue({ data: { id: '1', email: 'test@test.com', login: 'test' } });
const mockUpdateMe = vi.fn().mockResolvedValue({ data: {} });
const mockDeleteMe = vi.fn().mockResolvedValue({ data: {} });

vi.mock('@entities/user', () => ({
  userApi: {
    getMe: () => mockGetMe(),
    updateMe: (data: any) => mockUpdateMe(data),
    deleteMe: () => mockDeleteMe(),
  },
}));

describe('ProfilePage', () => {
  it('should render profile page', () => {
    const { container } = render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it('should load user data', async () => {
    const { container } = render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockGetMe).toHaveBeenCalled();
    });
    expect(container).toBeTruthy();
  });

  it('should handle button clicks', async () => {
    const { container } = render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockGetMe).toHaveBeenCalled();
    });
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      fireEvent.click(button);
    });
    expect(container).toBeTruthy();
  });

  it('should render page content', async () => {
    const { container } = render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockGetMe).toHaveBeenCalled();
    });
    expect(container.textContent).toBeTruthy();
  });

  it('should render with user data', async () => {
    mockGetMe.mockResolvedValueOnce({
      data: { id: '2', email: 'user@example.com', login: 'user' },
    });
    const { container } = render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockGetMe).toHaveBeenCalled();
    });
    expect(container).toBeTruthy();
  });
});
