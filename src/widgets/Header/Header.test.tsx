import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from './Header';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  };
});

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHeader = (props = {}) => {
    return render(
      <BrowserRouter>
        <Header {...props} />
      </BrowserRouter>
    );
  };

  it('renders logo and navigation buttons', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' });
    renderHeader();

    expect(screen.getByText('Учебные карточки')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Колоды' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Профиль' })).toBeInTheDocument();
  });

  describe('active state for Decks button', () => {
    it('sets active when pathname is exactly /decks', () => {
      mockUseLocation.mockReturnValue({ pathname: '/decks' });
      renderHeader();

      const decksButton = screen.getByRole('button', { name: 'Колоды' });
      expect(decksButton).toHaveStyle('color: #1890ff');
      expect(decksButton).toBeInTheDocument();
    });

    it('sets active when pathname starts with /decks/', () => {
      mockUseLocation.mockReturnValue({ pathname: '/decks/123' });
      renderHeader();
      expect(screen.getByRole('button', { name: 'Колоды' })).toBeInTheDocument();
    });

    it('does not set active on other paths', () => {
      mockUseLocation.mockReturnValue({ pathname: '/profile' });
      renderHeader();
      expect(screen.getByRole('button', { name: 'Колоды' })).toBeInTheDocument();
    });
  });

  describe('navigation without onNavigate', () => {
    it('calls navigate when logo is clicked', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' });
      renderHeader();

      fireEvent.click(screen.getByText('Учебные карточки'));
      expect(mockNavigate).toHaveBeenCalledWith('/decks');
    });

    it('calls navigate when Decks button is clicked', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' });
      renderHeader();

      fireEvent.click(screen.getByRole('button', { name: 'Колоды' }));
      expect(mockNavigate).toHaveBeenCalledWith('/decks');
    });

    it('calls navigate when Profile button is clicked', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' });
      renderHeader();

      fireEvent.click(screen.getByRole('button', { name: 'Профиль' }));
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  describe('navigation with onNavigate prop', () => {
    it('calls onNavigate with path when logo clicked', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' });
      const onNavigate = vi.fn();
      renderHeader({ onNavigate });

      fireEvent.click(screen.getByText('Учебные карточки'));
      expect(onNavigate).toHaveBeenCalledWith('/decks');
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('calls onNavigate when Decks button clicked', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' });
      const onNavigate = vi.fn();
      renderHeader({ onNavigate });

      fireEvent.click(screen.getByRole('button', { name: 'Колоды' }));
      expect(onNavigate).toHaveBeenCalledWith('/decks');
    });

    it('calls onNavigate when Profile button clicked', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' });
      const onNavigate = vi.fn();
      renderHeader({ onNavigate });

      fireEvent.click(screen.getByRole('button', { name: 'Профиль' }));
      expect(onNavigate).toHaveBeenCalledWith('/profile');
    });
  });

});