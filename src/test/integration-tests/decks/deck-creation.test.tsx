import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App as AntdApp } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { DecksPage } from '@pages/decks';
import { server } from '@/test/setup';

const API_BASE = 'http://localhost:8080/api/v1';

describe('IT-F-01.1 Создание колоды с валидацией и отображением в списке', () => {
  it('показывает ошибку валидации, создает колоду и отображает ее в списке', async () => {
    const user = userEvent.setup();
    const createDeckSpy = vi.fn();

    let decks: Array<{
      id: string;
      name: string;
      description?: string;
      cardCount: number;
      learnedPercent: number;
      lastStudied: string | null;
      createdAt: string;
      updatedAt: string;
    }> = [];

    server.use(
      http.get(`${API_BASE}/decks`, () => {
        return HttpResponse.json({
          content: decks,
          page: 0,
          size: 30,
          totalElements: decks.length,
          totalPages: 1,
        });
      }),
      http.post(`${API_BASE}/decks`, async ({ request }: { request: Request }) => {
        const body = (await request.json()) as { name: string; description?: string };
        createDeckSpy(body);

        const createdDeck = {
          id: 'deck-1',
          name: body.name,
          description: body.description,
          cardCount: 0,
          learnedPercent: 0,
          lastStudied: null,
          createdAt: '2026-03-18T00:00:00.000Z',
          updatedAt: '2026-03-18T00:00:00.000Z',
        };

        decks = [createdDeck];
        return HttpResponse.json(createdDeck, { status: 200 });
      })
    );

    render(
      <AntdApp>
        <MemoryRouter initialEntries={['/decks']}>
          <Routes>
            <Route path="/decks" element={<DecksPage />} />
          </Routes>
        </MemoryRouter>
      </AntdApp>
    );

    await screen.findByRole('heading', { name: 'Мои колоды' });

    await user.click(screen.getByRole('button', { name: /создать колоду/i }));

    const dialog = await screen.findByRole('dialog', { name: /создать новую колоду/i });
    const nameInput = within(dialog).getByPlaceholderText('Введите название колоды');
    const descriptionInput = within(dialog).getByPlaceholderText(
      'Добавьте описание колоды (необязательно)'
    );

    fireEvent.change(nameInput, { target: { value: 'a'.repeat(91) } });
    fireEvent.blur(nameInput);

    expect(await within(dialog).findByText('Название не должно превышать 90 символов')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Создать' })).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: 'English Vocabulary' } });
    await user.type(descriptionInput, 'Common words');

    await waitFor(() => {
      expect(within(dialog).getByRole('button', { name: 'Создать' })).toBeEnabled();
    });

    await user.click(within(dialog).getByRole('button', { name: 'Создать' }));

    expect(await screen.findByText('Колода успешно создана')).toBeInTheDocument();

    await waitFor(() => {
      expect(createDeckSpy).toHaveBeenCalledWith({
        name: 'English Vocabulary',
        description: 'Common words',
      });
    });

    const deckTitle = await screen.findByRole('heading', { name: 'English Vocabulary' });
    const deckContainer = deckTitle.closest('[data-deck-id]');

    expect(deckContainer).not.toBeNull();

    if (!deckContainer) {
      return;
    }

    expect(within(deckContainer as HTMLElement).getByText('Карточек')).toBeInTheDocument();
    expect(within(deckContainer as HTMLElement).getByText('0')).toBeInTheDocument();
  });
});
