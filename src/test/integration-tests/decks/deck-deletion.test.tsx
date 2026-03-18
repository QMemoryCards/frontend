import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { DecksPage } from '@/pages/decks';
import { server } from '@/test/setup';
import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:8080/api/v1';

describe('Удаление колоды с подтверждением', () => {
  const mockDecks = [
    {
      id: '1',
      name: 'Французский',
      description: 'Базовые слова',
      cardsCount: 10,
      learnedPercent: 0,
    },
    { id: '2', name: 'Немецкий', description: 'Путешествия', cardsCount: 5, learnedPercent: 0 },
  ];

  let deleteCalledWithId: string | null = null;

  beforeEach(() => {
    deleteCalledWithId = null;

    server.use(
      http.get(`${API_BASE}/decks`, () => {
        return HttpResponse.json({
          content: mockDecks,
          page: 0,
          size: 30,
          totalElements: mockDecks.length,
          totalPages: 1,
        });
      }),

      http.delete(`${API_BASE}/decks/:id`, async ({ params }) => {
        const { id } = params;
        deleteCalledWithId = id as string;
        const index = mockDecks.findIndex(deck => deck.id === id);
        if (index !== -1) {
          mockDecks.splice(index, 1);
        }
        return HttpResponse.json({}, { status: 200 });
      }),

      http.options(`${API_BASE}/decks`, () => {
        return new HttpResponse(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      }),

      http.options(`${API_BASE}/decks/:id`, () => {
        return new HttpResponse(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      })
    );
  });

  afterEach(() => {
    mockDecks.length = 0;
    mockDecks.push(
      {
        id: '1',
        name: 'Французский',
        description: 'Базовые слова',
        cardsCount: 10,
        learnedPercent: 0,
      },
      { id: '2', name: 'Немецкий', description: 'Путешествия', cardsCount: 5, learnedPercent: 0 }
    );
  });

  it('должен удалять колоду только после подтверждения, отмена не влияет', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={['/decks']}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AntApp>
          <Routes>
            <Route path="/decks" element={<DecksPage />} />
          </Routes>
        </AntApp>
      </MemoryRouter>
    );

    // Ждём загрузки списка колод
    await waitFor(() => {
      expect(screen.getByText('Французский')).toBeInTheDocument();
      expect(screen.getByText('Немецкий')).toBeInTheDocument();
    });

    // Находим карточку колоды "Французский" и кнопку удаления внутри неё
    const frenchTitle = screen.getByText('Французский');
    const frenchCard =
      frenchTitle.closest('div[class*="Card"]') || frenchTitle.parentElement?.parentElement;
    expect(frenchCard).toBeDefined();
    const deleteButton = within(frenchCard as HTMLElement).getByRole('button', { name: /удалить/i });

    // --- Шаг 1: Нажать "Удалить", затем "Отмена" ---
    await user.click(deleteButton);

    // Ждём появления модального окна подтверждения
    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();

    // В модальном окне нажимаем "Отмена"
    const cancelButton = within(modal).getByRole('button', { name: /отмена/i });
    await user.click(cancelButton);

    // Проверяем, что DELETE-запрос не отправлялся
    expect(deleteCalledWithId).toBeNull();

    // Проверяем, что колода "Французский" всё ещё отображается
    expect(screen.getByText('Французский')).toBeInTheDocument();

    // --- Шаг 2: Снова нажать "Удалить" и подтвердить ---
    await user.click(deleteButton);

    const modal2 = await screen.findByRole('dialog');
    const confirmButton = within(modal2).getByRole('button', { name: /удалить/i });
    await user.click(confirmButton);

    // Проверяем, что DELETE был вызван с правильным ID
    expect(deleteCalledWithId).toBe('1');

    // Проверяем, что колода "Французский" исчезла, а "Немецкий" осталась
    await waitFor(() => {
      expect(screen.queryByText('Французский')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Немецкий')).toBeInTheDocument();

    // Проверяем появление toast-уведомления об успешном удалении
    const toast = await screen.findByText(/Колода успешно удалена/i);
    expect(toast).toBeInTheDocument();
  });
});
