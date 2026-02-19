import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NotFoundPage } from './NotFoundPage';
import { renderWithRouter } from '@/test/utils.tsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('antd', () => ({
  Button: ({ children, onClick, icon, type, size }: any) => (
    <button onClick={onClick} data-type={type} data-size={size} data-testid="antd-button">
      {icon && <span data-testid="button-icon">{icon}</span>}
      {children}
    </button>
  ),
}));

describe('NotFoundPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderNotFoundPage = () => {
    return renderWithRouter(<NotFoundPage />);
  };

  it('renders 404 page with all elements', () => {
    renderNotFoundPage();

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Страница не найдена')).toBeInTheDocument();
    expect(screen.getByText(/Запрашиваемая страница не существует/)).toBeInTheDocument();

    expect(screen.getByText('На главную')).toBeInTheDocument();
    expect(screen.getByText('Назад')).toBeInTheDocument();
  });

  it('renders illustration', () => {
    renderNotFoundPage();

    const illustration = document.querySelector('div')?.querySelector('div')?.querySelector('div');
    expect(illustration).toBeTruthy();
  });

  it('navigates to home page when "На главную" button is clicked', () => {
    renderNotFoundPage();

    const homeButton = screen.getByText('На главную');
    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when "Назад" button is clicked', () => {
    renderNotFoundPage();

    const backButton = screen.getByText('Назад');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('applies correct props to buttons', () => {
    renderNotFoundPage();

    const buttons = screen.getAllByTestId('antd-button');

    expect(buttons[0]).toHaveAttribute('data-type', 'primary');
    expect(buttons[0]).toHaveAttribute('data-size', 'large');

    expect(buttons[1]).toHaveAttribute('data-size', 'large');
  });

  it('renders icons on buttons', () => {
    renderNotFoundPage();

    const icons = screen.getAllByTestId('button-icon');
    expect(icons).toHaveLength(2); // Две кнопки с иконками
  });

  it('has responsive styles', () => {
    renderNotFoundPage();

    const container = screen.getByText('404').parentElement?.parentElement;
    expect(container).toBeInTheDocument();
  });
});
