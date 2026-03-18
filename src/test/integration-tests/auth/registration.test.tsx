import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DecksPage, LoginPage, RegisterPage } from '@/pages';

describe('Регистрация нового пользователя', () => {
  it('должен показывать ошибку при существующем email и успешно регистрировать нового, затем выполнять вход', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={['/register']}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/decks" element={<DecksPage />} />
        </Routes>
      </MemoryRouter>
    );

    // --- Негативный сценарий: попытка регистрации с существующим email ---
    await user.type(screen.getByPlaceholderText('example@mail.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('username'), 'existing_user');
    await user.type(screen.getByPlaceholderText('Введите пароль'), 'Pass1234!');

    // Активация кнопки после прохождения клиентской валидации
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    // Появление toast-уведомления об ошибке
    const errorToast = await screen.findByText(/Данный email уже занят/i);
    expect(errorToast).toBeInTheDocument();

    // Активация кнопки
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeEnabled();
    });

    // Очистка поля для ввода новых данных
    await user.clear(screen.getByPlaceholderText('example@mail.com'));
    await user.clear(screen.getByPlaceholderText('username'));
    await user.clear(screen.getByPlaceholderText('Введите пароль'));

    // --- Позитивный сценарий: успешная регистрация нового пользователя ---
    await user.type(screen.getByPlaceholderText('example@mail.com'), 'newuser@example.com');
    await user.type(screen.getByPlaceholderText('username'), 'newbie');
    await user.type(screen.getByPlaceholderText('Введите пароль'), 'StrongP@ss1');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    // Редирект на страницу входа
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /вход/i })).toBeInTheDocument();
    });

    // Вводим логин и пароль
    await user.type(screen.getByPlaceholderText('Введите логин'), 'newbie');
    await user.type(screen.getByPlaceholderText('Введите пароль'), 'StrongP@ss1');

    await user.click(screen.getByRole('button', { name: /войти/i }));

    // Редирект на главную страницу с колодами
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /колоды/i })).toBeInTheDocument();
    });
  });
});
