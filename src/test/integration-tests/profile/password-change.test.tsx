import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { ProfilePage } from '@/pages/profile';
import { server } from '@/test/setup';
import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:8080/api/v1';

describe('Смена пароля в профиле', () => {
  let putPasswordCalled = 0;
  let lastRequestBody: any = null;

  beforeEach(() => {
    putPasswordCalled = 0;
    lastRequestBody = null;

    server.use(
      http.get(`${API_BASE}/users/me`, () => {
        return HttpResponse.json({
          id: 'user-1',
          email: 'test@example.com',
          login: 'testuser',
        });
      }),

      http.put(`${API_BASE}/users/me/password`, async ({ request }) => {
        putPasswordCalled++;
        const body = (await request.json()) as any;
        lastRequestBody = body;

        if (body.currentPassword === 'WrongPass1!') {
          return HttpResponse.json(
            { code: 'invalid_password', message: 'Неверный текущий пароль' },
            { status: 403 }
          );
        }
        if (body.newPassword === 'Password123') { // без спецсимвола, но с цифрой
          return HttpResponse.json(
            { code: 'weak_password', message: 'Пароль должен содержать минимум один спецсимвол' },
            { status: 422 }
          );
        }
        if (body.newPassword === 'short') {
          return HttpResponse.json(
            { code: 'weak_password', message: 'Пароль должен содержать минимум 8 символов' },
            { status: 422 }
          );
        }
        if (body.newPassword === body.currentPassword) {
          return HttpResponse.json(
            { code: 'password_same', message: 'Новый пароль не должен совпадать со старым' },
            { status: 400 }
          );
        }
        return HttpResponse.json({}, { status: 200 });
      }),

      http.options(`${API_BASE}/users/me/password`, () => {
        return new HttpResponse(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      })
    );
  });

  it('должен проверять валидацию и успешно менять пароль', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AntApp>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </AntApp>
      </MemoryRouter>
    );

    // Дожидаемся загрузки данных пользователя
    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    // Переходим в режим смены пароля
    const changePasswordButton = screen.getByRole('button', { name: /изменить пароль/i });
    await user.click(changePasswordButton);

    const currentPasswordInput = screen.getByPlaceholderText(/введите текущий пароль/i);
    const newPasswordInput = screen.getByPlaceholderText(/введите новый пароль/i);
    const submitButton = screen.getByRole('button', { name: /изменить пароль/i });

    // --- Негативный сценарий 1: неверный текущий пароль ---
    await user.type(currentPasswordInput, 'WrongPass1!');
    await user.type(newPasswordInput, 'NewStrongP@ss1');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
    await user.click(submitButton);

    const serverError = await screen.findByText(/неверный текущий пароль/i);
    expect(serverError).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    await user.clear(currentPasswordInput);
    await user.clear(newPasswordInput);

    // --- Негативный сценарий 2: новый пароль без спецсимвола ---
    await user.type(currentPasswordInput, 'OldPass123!');
    await user.type(newPasswordInput, 'Password123'); // содержит цифры, но нет спецсимвола

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    const specCharError = await screen.findByText(/минимум один спецсимвол/i);
    expect(specCharError).toBeInTheDocument();

    await user.clear(newPasswordInput);

    // --- Негативный сценарий 3: новый пароль слишком короткий ---
    await user.type(newPasswordInput, 'short');

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    const lengthError = await screen.findByText(/минимум 8 символов/i);
    expect(lengthError).toBeInTheDocument();

    await user.clear(newPasswordInput);

    // --- Негативный сценарий 4: новый пароль совпадает со старым ---
    await user.type(newPasswordInput, 'OldPass123!');

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    const samePasswordError = await screen.findByText(/не должен совпадать со старым/i);
    expect(samePasswordError).toBeInTheDocument();

    await user.clear(newPasswordInput);

    // --- Позитивный сценарий: валидный новый пароль ---
    await user.type(newPasswordInput, 'NewStrongP@ss1');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
    await user.click(submitButton);

    const successToast = await screen.findByText(/пароль успешно изменен/i);
    expect(successToast).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('••••••••')).toBeInTheDocument();
    });

    expect(putPasswordCalled).toBe(2);
    expect(lastRequestBody).toEqual({
      currentPassword: 'OldPass123!',
      newPassword: 'NewStrongP@ss1',
    });
  });
});