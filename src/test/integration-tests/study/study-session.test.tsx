import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App as AntdApp } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { StudyPage } from '@pages/study';
import { server } from '@/test/setup';

const API_BASE = 'http://localhost:8080/api/v1';

describe('IT-F-03.1 Прохождение сессии обучения с подсчетом результатов', () => {
  it('проходит 3 карточки и отправляет результаты remembered/forgotten/remembered', async () => {
    const user = userEvent.setup();

    const deckId = 'deck-1';
    const submittedResults: boolean[] = [];
    const submitStudySessionSpy = vi.fn();

    server.use(
      http.get(`${API_BASE}/decks/${deckId}`, () => {
        return HttpResponse.json({
          id: deckId,
          name: 'Animals',
          description: 'Basic animals',
          cardCount: 3,
          learnedPercent: 0,
          lastStudied: null,
          createdAt: '2026-03-18T00:00:00.000Z',
          updatedAt: '2026-03-18T00:00:00.000Z',
        });
      }),
      http.get(`${API_BASE}/study/${deckId}/cards`, () => {
        return HttpResponse.json([
          { id: 'card-1', question: 'Cat', answer: 'Кошка' },
          { id: 'card-2', question: 'Dog', answer: 'Собака' },
          { id: 'card-3', question: 'Bird', answer: 'Птица' },
        ]);
      }),
      http.post(`${API_BASE}/study/${deckId}/answer`, async ({ request }: { request: Request }) => {
        const body = (await request.json()) as { cardId: string; status: 'remembered' | 'forgotten' };
        submittedResults.push(body.status === 'remembered');
          if (submittedResults.length === 3) {
            submitStudySessionSpy([...submittedResults]);
          }
        return HttpResponse.json({ success: true }, { status: 200 });
      })
    );

    render(
      <AntdApp>
        <MemoryRouter initialEntries={[`/decks/${deckId}/study`]}>
          <Routes>
            <Route path="/decks/:id/study" element={<StudyPage />} />
          </Routes>
        </MemoryRouter>
      </AntdApp>
    );

    expect(await screen.findByText('Cat')).toBeInTheDocument();
    expect(screen.getByText('Карточка 1 из 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Показать ответ' }));

    expect(await screen.findByText('Кошка')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^check Помню$/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /^close Не помню$/i })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: /^check Помню$/i }));

    expect(await screen.findByText('Dog')).toBeInTheDocument();
    expect(screen.getByText('Карточка 2 из 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Показать ответ' }));
    await user.click(screen.getByRole('button', { name: /^close Не помню$/i }));

    expect(await screen.findByText('Bird')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Показать ответ' }));
    await user.click(screen.getByRole('button', { name: /^check Помню$/i }));

    expect(await screen.findByText('Отличная работа!')).toBeInTheDocument();
    expect(screen.getByText('Помню')).toBeInTheDocument();
    expect(screen.getByText('Не помню')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    await waitFor(() => {
      expect(submittedResults).toEqual([true, false, true]);
    });

    expect(submitStudySessionSpy).toHaveBeenCalledWith([true, false, true]);
  });
});
