import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App as AntdApp } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { DeckEditPage } from '@pages/deck-edit';
import { server } from '@/test/setup';

const API_BASE = 'http://localhost:8080/api/v1';

describe('IT-F-02.1 Добавление и удаление карточек в редакторе колоды', () => {
  it('добавляет две карточки, отменяет и подтверждает удаление, затем сохраняет изменения', async () => {
    const user = userEvent.setup();

    const updateDeckSpy = vi.fn();

    const deckId = 'test-deck-id';
    const deckName = 'Test Deck';
    const deckDescription = 'Deck for integration test';

    let cards: Array<{ id: string; question: string; answer: string }> = [];

    server.use(
      http.get(`${API_BASE}/decks/${deckId}`, () => {
        return HttpResponse.json({
          id: deckId,
          name: deckName,
          description: deckDescription,
          cardCount: cards.length,
          learnedPercent: 0,
          lastStudied: null,
          createdAt: '2026-03-18T00:00:00.000Z',
          updatedAt: '2026-03-18T00:00:00.000Z',
        });
      }),
      http.get(`${API_BASE}/decks/${deckId}/cards`, () => {
        return HttpResponse.json({
          content: cards,
          page: 0,
          size: 100,
          totalElements: cards.length,
          totalPages: 1,
        });
      }),
      http.post(`${API_BASE}/decks/${deckId}/cards`, async ({ request }: { request: Request }) => {
        const body = (await request.json()) as { question: string; answer: string };
        const newCard = {
          id: `card-${cards.length + 1}`,
          question: body.question,
          answer: body.answer,
        };

        cards = [...cards, newCard];
        return HttpResponse.json(newCard, { status: 200 });
      }),
      http.delete(
        `${API_BASE}/decks/${deckId}/cards/:cardId`,
        ({ params }: { params: Record<string, string> }) => {
          cards = cards.filter(card => card.id !== params.cardId);
          return new HttpResponse(null, { status: 204 });
        }
      ),
      http.put(`${API_BASE}/decks/${deckId}`, async ({ request }: { request: Request }) => {
        const body = (await request.json()) as { name: string; description?: string };
        updateDeckSpy(body, cards.length);

        return HttpResponse.json({
          id: deckId,
          name: body.name,
          description: body.description,
          cardCount: cards.length,
          learnedPercent: 0,
          lastStudied: null,
          createdAt: '2026-03-18T00:00:00.000Z',
          updatedAt: '2026-03-18T00:00:00.000Z',
        });
      })
    );

    render(
      <AntdApp>
        <MemoryRouter
          initialEntries={[`/decks/${deckId}/edit`]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/decks/:id/edit" element={<DeckEditPage />} />
          </Routes>
        </MemoryRouter>
      </AntdApp>
    );

    await screen.findByRole('heading', { name: 'Редактирование колоды' });

    await user.click(screen.getByRole('button', { name: /добавить карточку/i }));
    await user.type(screen.getByPlaceholderText('Введите вопрос'), 'Apple');
    await user.type(screen.getByPlaceholderText('Введите ответ'), 'Яблоко');
    await user.click(screen.getByRole('button', { name: 'Создать' }));

    await screen.findByText('Apple');

    await user.click(screen.getByRole('button', { name: /добавить карточку/i }));
    await user.type(screen.getByPlaceholderText('Введите вопрос'), 'Book');
    await user.type(screen.getByPlaceholderText('Введите ответ'), 'Книга');
    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(await screen.findByText('Apple')).toBeInTheDocument();
    expect(await screen.findByText('Book')).toBeInTheDocument();

    const getDeleteButtons = () => screen.getAllByRole('button', { name: 'Удалить' });

    await user.click(getDeleteButtons()[0]);
    await screen.findByText('Это действие нельзя отменить');
    const cancelButtons = screen.getAllByRole('button', { name: 'Отмена' });
    await user.click(cancelButtons[cancelButtons.length - 1]);

    expect(screen.getByText('Apple')).toBeInTheDocument();

    await user.click(getDeleteButtons()[0]);
    await screen.findByText('Это действие нельзя отменить');
    const deleteConfirmButtons = screen.getAllByRole('button', { name: 'Удалить' });
    await user.click(deleteConfirmButtons[deleteConfirmButtons.length - 1]);

    await waitFor(() => {
      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
      expect(screen.getByText('Book')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /сохранить/i }));

    await waitFor(() => {
      expect(updateDeckSpy).toHaveBeenCalledWith(
        {
          name: deckName,
          description: deckDescription,
        },
        1
      );
    });

    expect(
      await screen.findByText(/колода успешно обновлена|изменения сохранены/i)
    ).toBeInTheDocument();
  });
});
