import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WelcomePage } from './WelcomePage';
import { BrowserRouter } from 'react-router-dom';
import { ROUTES } from '@shared/config';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@shared/ui', () => ({
  Button: ({ children, variant, fullWidth, onClick }: any) => (
    <button
      data-testid={`button-${variant}`}
      data-fullwidth={fullWidth}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

describe('WelcomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWelcomePage = () => {
    return render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );
  };

  it('renders welcome page with all elements', () => {
    renderWelcomePage();

    expect(screen.getByText('Flashcards')).toBeInTheDocument();

    expect(screen.getByText(/Создавайте колоды карточек/)).toBeInTheDocument();

    const logo = screen.getByAltText('Flashcards logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.svg');
  });

  it('renders both buttons with correct text', () => {
    renderWelcomePage();

    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
  });

  it('applies correct props to buttons', () => {
    renderWelcomePage();

    const loginButton = screen.getByTestId('button-primary');
    const registerButton = screen.getByTestId('button-secondary');

    expect(loginButton).toHaveAttribute('data-fullwidth', 'true');
    expect(registerButton).toHaveAttribute('data-fullwidth', 'true');
  });

  it('navigates to login page when login button is clicked', () => {
    renderWelcomePage();

    const loginButton = screen.getByText('Войти');
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
  });

  it('navigates to register page when register button is clicked', () => {
    renderWelcomePage();

    const registerButton = screen.getByText('Зарегистрироваться');
    fireEvent.click(registerButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.REGISTER);
  });

  it('applies correct styles to logo', () => {
    renderWelcomePage();

    const logo = screen.getByAltText('Flashcards logo');
    expect(logo).toHaveStyle({
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      display: 'block',
    });
  });

  it('handles login click correctly', () => {
    renderWelcomePage();

    const loginButton = screen.getByText('Войти');
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
  });

  it('handles register click correctly', () => {
    renderWelcomePage();

    const registerButton = screen.getByText('Зарегистрироваться');
    fireEvent.click(registerButton);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.REGISTER);
  });

  it('renders primary button for login and secondary for register', () => {
    renderWelcomePage();

    expect(screen.getByTestId('button-primary')).toHaveTextContent('Войти');
    expect(screen.getByTestId('button-secondary')).toHaveTextContent('Зарегистрироваться');
  });
});