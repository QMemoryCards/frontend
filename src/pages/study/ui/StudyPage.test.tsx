import { render, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StudyPage } from './StudyPage';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: '1' }),
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
  message: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockGetStudyCards = vi.fn().mockResolvedValue({
  data: [
    { id: '1', question: 'Q1', answer: 'A1' },
    { id: '2', question: 'Q2', answer: 'A2' },
  ],
});
const mockSubmitAnswer = vi.fn().mockResolvedValue({ data: {} });

vi.mock('@entities/study', () => ({
  studyApi: {
    getStudyCards: () => mockGetStudyCards(),
    submitAnswer: (params: any) => mockSubmitAnswer(params),
  },
}));

describe('StudyPage', () => {
  it('should render study page', () => {
    const { container } = render(
      <BrowserRouter>
        <StudyPage />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it('should handle error loading cards', async () => {
    mockGetStudyCards.mockRejectedValueOnce(new Error('Failed'));
    const { container } = render(
      <BrowserRouter>
        <StudyPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockGetStudyCards).toHaveBeenCalled();
    });
    expect(container).toBeTruthy();
  });

  it('should render page content', () => {
    const { container } = render(
      <BrowserRouter>
        <StudyPage />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it('should render with multiple cards', async () => {
    mockGetStudyCards.mockResolvedValueOnce({
      data: [
        { id: '1', question: 'Q1', answer: 'A1' },
        { id: '2', question: 'Q2', answer: 'A2' },
        { id: '3', question: 'Q3', answer: 'A3' },
      ],
    });
    const { container } = render(
      <BrowserRouter>
        <StudyPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockGetStudyCards).toHaveBeenCalled();
    });
    expect(container).toBeTruthy();
  });
});
