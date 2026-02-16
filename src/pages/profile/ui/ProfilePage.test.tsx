import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfilePage } from './ProfilePage';
import { BrowserRouter } from 'react-router-dom';
import { VALIDATION } from '@shared/config';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockMessageSuccess = vi.fn();
const mockMessageError = vi.fn();
const mockModalConfirm = vi.fn();

vi.mock('antd', () => ({
  App: {
    useApp: () => ({
      message: {
        success: mockMessageSuccess,
        error: mockMessageError,
      },
      modal: {
        confirm: mockModalConfirm,
      },
    }),
  },
}));

const mockFetchUser = vi.fn();
const mockSetUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockChangePassword = vi.fn();
const mockDeleteUser = vi.fn();

let mockUser = {
  id: '1',
  email: 'test@example.com',
  login: 'testuser',
};

let mockUserLoading = false;

vi.mock('@features/profile', () => ({
  useGetUser: () => ({
    user: mockUser,
    setUser: mockSetUser,
    loading: mockUserLoading,
    fetchUser: mockFetchUser,
  }),
  useUpdateUser: () => ({
    updateUser: mockUpdateUser,
    loading: false,
  }),
  useChangePassword: () => ({
    changePassword: mockChangePassword,
    loading: false,
  }),
  useDeleteUser: () => ({
    deleteUser: mockDeleteUser,
    loading: false,
  }),
}));

const mockLogoutUser = vi.fn();
vi.mock('@entities/user', () => ({
  logoutUser: () => mockLogoutUser(),
}));

vi.mock('@widgets/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

vi.mock('@shared/ui', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Input: ({ value, onChange, placeholder, disabled, type }: any) => (
    <input
      data-testid={`input-${placeholder}`}
      type={type || 'text'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  ),
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = {
      id: '1',
      email: 'test@example.com',
      login: 'testuser',
    };
    mockUserLoading = false;
  });

  const renderProfilePage = () => {
    return render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );
  };

  it('shows loading spinner when loading user data', () => {
    mockUserLoading = true;
    mockUser = null as any;
    renderProfilePage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('fetches user data on mount', () => {
    renderProfilePage();
    expect(mockFetchUser).toHaveBeenCalled();
  });

  it('displays user data in read-only mode', async () => {
    renderProfilePage();

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('••••••••')).toBeInTheDocument();

    expect(screen.getByText('Изменить данные')).toBeInTheDocument();
    expect(screen.getByText('Изменить пароль')).toBeInTheDocument();
    expect(screen.getByText('Выйти из аккаунта')).toBeInTheDocument();
    expect(screen.getByText('Удалить аккаунт')).toBeInTheDocument();
  });

  it('navigates back to decks when clicking back button', () => {
    renderProfilePage();

    fireEvent.click(screen.getByText('Назад'));
    expect(mockNavigate).toHaveBeenCalledWith('/decks');
  });

  describe('edit profile mode', () => {
    it('switches to edit mode when clicking "Изменить данные"', () => {
      renderProfilePage();

      fireEvent.click(screen.getByText('Изменить данные'));

      expect(screen.getByPlaceholderText('example@email.com')).toHaveValue('test@example.com');
      expect(screen.getByPlaceholderText('username')).toHaveValue('testuser');
      expect(screen.getByText('Сохранить изменения')).toBeInTheDocument();
      expect(screen.getByText('Отмена')).toBeInTheDocument();
    });

    it('validates email on change', () => {
      renderProfilePage();
      fireEvent.click(screen.getByText('Изменить данные'));

      const emailInput = screen.getByPlaceholderText('example@email.com');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      expect(screen.getByText('Введите корректный email адрес')).toBeInTheDocument();
    });

    it('validates login on change', () => {
      renderProfilePage();
      fireEvent.click(screen.getByText('Изменить данные'));

      const loginInput = screen.getByPlaceholderText('username');
      fireEvent.change(loginInput, { target: { value: 'ab' } });

      expect(screen.getByText('Логин должен содержать минимум 3 символа')).toBeInTheDocument();
    });

    it('shows character counter for email', () => {
      renderProfilePage();
      fireEvent.click(screen.getByText('Изменить данные'));

      const emailInput = screen.getByPlaceholderText('example@email.com');
      const longEmail = 'a'.repeat(VALIDATION.USER.EMAIL_MAX + 1) + '@test.com';
      fireEvent.change(emailInput, { target: { value: longEmail } });

      expect(screen.getByText('Email слишком длинный (максимум 254 символа)')).toBeInTheDocument();
    });

    it('calls updateUser with new data when form is valid', async () => {
      mockUpdateUser.mockResolvedValue({ user: { ...mockUser, email: 'new@example.com', login: 'newlogin' } });


      renderProfilePage();
      fireEvent.click(screen.getByText('Изменить данные'));

      fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
        target: { value: 'new@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('username'), {
        target: { value: 'newlogin' },
      });

      fireEvent.click(screen.getByText('Сохранить изменения'));

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith({ email: 'new@example.com', login: 'newlogin' });
        expect(mockSetUser).toHaveBeenCalledWith({ ...mockUser, email: 'new@example.com', login: 'newlogin' });
        expect(mockMessageSuccess).toHaveBeenCalledWith('Данные успешно обновлены');
      });

      expect(screen.queryByText('Сохранить изменения')).not.toBeInTheDocument();
    });

    it('shows error when email is already taken', async () => {
      mockUpdateUser.mockResolvedValue({ statusCode: 409, code: 'email_conflict' });

      renderProfilePage();
      fireEvent.click(screen.getByText('Изменить данные'));

      fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
        target: { value: 'taken@example.com' },
      });

      fireEvent.click(screen.getByText('Сохранить изменения'));

      await waitFor(() => {
        expect(screen.getByText('Данный email уже занят')).toBeInTheDocument();
      });
    });

    it('shows error when login is already taken', async () => {
      mockUpdateUser.mockResolvedValue({ statusCode: 409, code: 'login_conflict' });

      renderProfilePage();
      fireEvent.click(screen.getByText('Изменить данные'));

      fireEvent.change(screen.getByPlaceholderText('username'), {
        target: { value: 'takenlogin' },
      });

      fireEvent.click(screen.getByText('Сохранить изменения'));

      await waitFor(() => {
        expect(screen.getByText('Данный логин уже занят')).toBeInTheDocument();
      });
    });

    it('cancels edit mode and resets form', () => {
      renderProfilePage();
      fireEvent.click(screen.getByText('Изменить данные'));

      fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
        target: { value: 'changed@example.com' },
      });

      fireEvent.click(screen.getByText('Отмена'));

      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('example@email.com')).not.toBeInTheDocument();
    });
  });

  describe('change password mode', () => {
    it('switches to password mode when clicking "Изменить пароль"', () => {
      renderProfilePage();

      fireEvent.click(screen.getByText('Изменить пароль'));

      expect(screen.getByPlaceholderText('Введите текущий пароль')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Введите новый пароль')).toBeInTheDocument();
      expect(screen.getByText('Изменить пароль')).toBeInTheDocument();
      expect(screen.getByText('Отмена')).toBeInTheDocument();
    });

    it('validates current password', () => {
      renderProfilePage();
      fireEvent.click(screen.getByText('Изменить пароль'));

      const currentInput = screen.getByPlaceholderText('Введите текущий пароль');
      fireEvent.change(currentInput, { target: { value: '123' } });

      expect(screen.getByText('Пароль должен содержать минимум 8 символов')).toBeInTheDocument();
    });

    it('shows error when current password is incorrect', async () => {
      mockChangePassword.mockResolvedValue({ statusCode: 403 });

      renderProfilePage();
      fireEvent.click(screen.getByText('Изменить пароль'));

      fireEvent.change(screen.getByPlaceholderText('Введите текущий пароль'), {
        target: { value: 'wrongpass' },
      });
      fireEvent.change(screen.getByPlaceholderText('Введите новый пароль'), {
        target: { value: 'Newpass123' },
      });

      fireEvent.click(screen.getByText('Изменить пароль'));

      await waitFor(() => {
        expect(screen.getByText('Пароль должен содержать минимум одну заглавную букву')).toBeInTheDocument();
      });
    });

    it('cancels password mode and resets form', () => {
      renderProfilePage();
      fireEvent.click(screen.getByText('Изменить пароль'));

      fireEvent.change(screen.getByPlaceholderText('Введите текущий пароль'), {
        target: { value: 'somepass' },
      });

      fireEvent.click(screen.getByText('Отмена'));

      expect(screen.queryByPlaceholderText('Введите текущий пароль')).not.toBeInTheDocument();
    });
  });

  describe('logout', () => {
    it('shows confirmation modal when clicking logout', () => {
      renderProfilePage();

      fireEvent.click(screen.getByText('Выйти из аккаунта'));

      expect(mockModalConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Выйти из аккаунта?',
          okText: 'Выйти',
        })
      );
    });

    it('logs out and navigates to home when confirmed', async () => {
      mockModalConfirm.mockImplementation(({ onOk }) => onOk());
      mockLogoutUser.mockResolvedValue(undefined);

      renderProfilePage();
      fireEvent.click(screen.getByText('Выйти из аккаунта'));

      await waitFor(() => {
        expect(mockLogoutUser).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('shows error message if logout fails', async () => {
      mockModalConfirm.mockImplementation(({ onOk }) => onOk());
      mockLogoutUser.mockRejectedValue(new Error('Logout failed'));

      renderProfilePage();
      fireEvent.click(screen.getByText('Выйти из аккаунта'));

      await waitFor(() => {
        expect(mockMessageError).toHaveBeenCalledWith('Ошибка при выходе');
      });
    });
  });

  describe('delete account', () => {
    it('shows confirmation modal when clicking delete account', () => {
      renderProfilePage();

      fireEvent.click(screen.getByText('Удалить аккаунт'));

      expect(mockModalConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Удалить аккаунт?',
          okText: 'Удалить',
          okButtonProps: { danger: true },
        })
      );
    });

    it('deletes account and navigates to home when confirmed', async () => {
      mockModalConfirm.mockImplementation(({ onOk }) => onOk());
      mockDeleteUser.mockResolvedValue(true);

      renderProfilePage();
      fireEvent.click(screen.getByText('Удалить аккаунт'));

      await waitFor(() => {
        expect(mockDeleteUser).toHaveBeenCalled();
        expect(mockMessageSuccess).toHaveBeenCalledWith('Аккаунт успешно удален');
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });
});