import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:8080/api/v1';

export const handlers = [
  // Регистрация
  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as any;
    if (body.email === 'test@example.com') {
      return HttpResponse.json(
        { code: 'conflict', message: 'Данный email уже занят' },
        { status: 409 }
      );
    }
    return HttpResponse.json(
      { id: 'new-uuid', email: body.email, login: body.login },
      { status: 200 }
    );
  }),

  // Вход
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json(
      { token: 'fake-jwt', user: { id: 'user-id', login: body.login } },
      { status: 200 }
    );
  }),

  // Получение списка колод (после входа)
  http.get(`${API_BASE}/decks`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '0';
    const size = url.searchParams.get('size') || '30';
    return HttpResponse.json({
      content: [
        { id: '1', name: 'Мои колоды', description: 'Описание', cardsCount: 5 },
      ],
      page: Number(page),
      size: Number(size),
      totalElements: 1,
      totalPages: 1,
    });
  }),

  // OPTIONS preflight для всех эндпоинтов
  http.options(`${API_BASE}/auth/register`, () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }),

  http.options(`${API_BASE}/auth/login`, () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }),

  http.options(`${API_BASE}/decks`, () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }),
];