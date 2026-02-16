import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StudyPage } from './StudyPage';
import { BrowserRouter } from 'react-router-dom';
import { ROUTES } from '@shared/config';

const mockNavigate = vi.fn();
const mockParams = { id: '1' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

const mockConfirm = vi.fn();
vi.mock('antd', () => ({
  App: {
    useApp: () => ({
      modal: {
        confirm: mockConfirm,
      },
    }),
  },
  Progress: ({ percent, showInfo, strokeColor }: any) => (
    <div
      data-testid="progress"
      data-percent={percent}
      data-showinfo={showInfo}
      data-color={strokeColor}
    >
      Progress: {percent}%
    </div>
  ),
}));

const mockFetchStudyCards = vi.fn();
const mockSubmitAnswer = vi.fn();
const mockToggleAnswer = vi.fn();

vi.mock('@features/study', () => ({
  useStudy: (deckId: string) => ({
    cards: mockStudyCards,
    loading: mockLoading,
    currentCardIndex: mockCurrentCardIndex,
    showAnswer: mockShowAnswer,
    rememberedCount: mockRememberedCount,
    forgottenCount: mockForgottenCount,
    isCompleted: mockIsCompleted,
    progress: mockProgress,
    fetchStudyCards: mockFetchStudyCards,
    submitAnswer: mockSubmitAnswer,
    toggleAnswer: mockToggleAnswer,
  }),
  StudyCard: ({ question, answer, showAnswer, onToggleAnswer }: any) => (
    <div data-testid="study-card">
      <div data-testid="question">{question}</div>
      {showAnswer && <div data-testid="answer">{answer}</div>}
      <button onClick={onToggleAnswer}>Toggle</button>
    </div>
  ),
}));

const mockFetchDeck = vi.fn();
vi.mock('@features/decks', () => ({
  useGetDeck: () => ({
    deck: mockDeck,
    fetchDeck: mockFetchDeck,
  }),
}));

vi.mock('@widgets/Header', () => ({
  Header: ({ onNavigate }: any) => (
    <div data-testid="header">
      <button onClick={() => onNavigate('/test')}>Navigate</button>
    </div>
  ),
}));

vi.mock('@shared/ui', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

let mockStudyCards: any[] = [];
let mockLoading = false;
let mockCurrentCardIndex = 0;
let mockShowAnswer = false;
let mockRememberedCount = 0;
let mockForgottenCount = 0;
let mockIsCompleted = false;
let mockProgress = 0;
let mockDeck = { id: '1', name: 'Test Deck', cardCount: 2 };

describe('StudyPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStudyCards = [
      { id: '1', question: 'Question 1', answer: 'Answer 1' },
      { id: '2', question: 'Question 2', answer: 'Answer 2' },
    ];
    mockLoading = false;
    mockCurrentCardIndex = 0;
    mockShowAnswer = false;
    mockRememberedCount = 0;
    mockForgottenCount = 0;
    mockIsCompleted = false;
    mockProgress = 50;
    mockDeck = { id: '1', name: 'Test Deck', cardCount: 2 };
  });

  const renderStudyPage = () => {
    return render(
      <BrowserRouter>
        <StudyPage />
      </BrowserRouter>
    );
  };

  it('renders loading spinner when loading and no cards', () => {
    mockLoading = true;
    mockStudyCards = [];
    renderStudyPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows empty state when no cards and not loading', () => {
    mockLoading = false;
    mockStudyCards = [];
    renderStudyPage();

    expect(screen.getByText('В этой колоде пока нет карточек')).toBeInTheDocument();
    expect(screen.getByText('Вернуться к колодам')).toBeInTheDocument();
  });

  it('navigates to decks page when clicking "Вернуться к колодам" in empty state', () => {
    mockLoading = false;
    mockStudyCards = [];
    renderStudyPage();

    fireEvent.click(screen.getByText('Вернуться к колодам'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DECKS);
  });

  it('renders study interface with cards', () => {
    renderStudyPage();

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Test Deck')).toBeInTheDocument();
    expect(screen.getByText('Карточка 1 из 2')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByTestId('progress')).toHaveAttribute('data-percent', '50');
    expect(screen.getByTestId('question')).toHaveTextContent('Question 1');
    expect(screen.getByText('Показать ответ')).toBeInTheDocument();
  });

  it('toggles answer when "Показать ответ" is clicked', () => {
    renderStudyPage();

    fireEvent.click(screen.getByText('Показать ответ'));
    expect(mockToggleAnswer).toHaveBeenCalled();
  });

  it('shows answer buttons when answer is visible', () => {
    mockShowAnswer = true;
    renderStudyPage();

    expect(screen.getByText('Помню')).toBeInTheDocument();
    expect(screen.getByText('Не помню')).toBeInTheDocument();
    expect(screen.queryByText('Показать ответ')).not.toBeInTheDocument();
  });

  it('calls submitAnswer with "remembered" when "Помню" is clicked', () => {
    mockShowAnswer = true;
    renderStudyPage();

    fireEvent.click(screen.getByText('Помню'));
    expect(mockSubmitAnswer).toHaveBeenCalledWith('remembered');
  });

  it('calls submitAnswer with "forgotten" when "Не помню" is clicked', () => {
    mockShowAnswer = true;
    renderStudyPage();

    fireEvent.click(screen.getByText('Не помню'));
    expect(mockSubmitAnswer).toHaveBeenCalledWith('forgotten');
  });

  it('shows results page when completed', () => {
    mockIsCompleted = true;
    mockRememberedCount = 5;
    mockForgottenCount = 3;
    renderStudyPage();

    expect(screen.getByText('Отличная работа!')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('63%')).toBeInTheDocument();
    expect(screen.getByText('Повторить снова')).toBeInTheDocument();
    expect(screen.getByText('Вернуться к колодам')).toBeInTheDocument();
  });

  it('calls fetchStudyCards when "Повторить снова" is clicked', () => {
    mockIsCompleted = true;
    renderStudyPage();

    fireEvent.click(screen.getByText('Повторить снова'));
    expect(mockFetchStudyCards).toHaveBeenCalled();
  });

  it('navigates to decks when "Вернуться к колодам" is clicked in results', () => {
    mockIsCompleted = true;
    renderStudyPage();

    fireEvent.click(screen.getByText('Вернуться к колодам'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DECKS);
  });

  describe('navigation with confirmation', () => {
    it('shows confirmation modal when back button is clicked and not completed', () => {
      renderStudyPage();

      fireEvent.click(screen.getByTestId('header').querySelector('button')!);
      expect(mockConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Завершить обучение?',
          okText: 'Завершить',
        })
      );
    });

    it('navigates when confirmation is confirmed', () => {
      mockConfirm.mockImplementation(({ onOk }) => {
        onOk();
      });
      renderStudyPage();

      fireEvent.click(screen.getByTestId('header').querySelector('button')!);
      expect(mockNavigate).toHaveBeenCalled();
    });

    it('navigates without confirmation when completed', () => {
      mockIsCompleted = true;
      renderStudyPage();

      fireEvent.click(screen.getByTestId('header').querySelector('button')!);
      expect(mockConfirm).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });

    it('shows confirmation when back icon is clicked', () => {
      renderStudyPage();

      fireEvent.click(screen.getByTestId('header').querySelector('button')!);
      expect(mockConfirm).toHaveBeenCalled();
    });
  });

  it('calls fetchDeck and fetchStudyCards on mount with deckId', () => {
    renderStudyPage();

    expect(mockFetchDeck).toHaveBeenCalledWith('1');
    expect(mockFetchStudyCards).toHaveBeenCalled();
  });

  it('handles case when deck name is not available', () => {
    mockDeck = null;
    renderStudyPage();

    expect(screen.getByText('Обучение')).toBeInTheDocument();
  });
});
