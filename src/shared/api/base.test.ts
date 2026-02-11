import { describe, it, expect } from 'vitest';
import { handleApiError } from './base';
import { AxiosError } from 'axios';

describe('handleApiError', () => {
  it('should handle error with response', () => {
    const error = {
      response: {
        status: 400,
        data: {
          message: 'Bad Request',
          code: 'BAD_REQUEST',
          errors: {
            field1: ['Error message 1'],
          },
        },
      },
    } as AxiosError;

    const result = handleApiError(error);

    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('Bad Request');
    expect(result.code).toBe('BAD_REQUEST');
    expect(result.errors).toEqual({ field1: ['Error message 1'] });
  });

  it('should handle error without message in response', () => {
    const error = {
      response: {
        status: 500,
        data: {},
      },
    } as AxiosError;

    const result = handleApiError(error);

    expect(result.statusCode).toBe(500);
    expect(result.message).toBe('Произошла ошибка');
  });

  it('should handle network error', () => {
    const error = {
      request: {},
    } as AxiosError;

    const result = handleApiError(error);

    expect(result.statusCode).toBe(0);
    expect(result.message).toBe('Сервер не отвечает. Проверьте подключение к интернету.');
  });

  it('should handle request setup error', () => {
    const error = {
      message: 'Request setup failed',
    } as AxiosError;

    const result = handleApiError(error);

    expect(result.statusCode).toBe(0);
    expect(result.message).toBe('Request setup failed');
  });

  it('should handle error without message', () => {
    const error = {} as AxiosError;

    const result = handleApiError(error);

    expect(result.statusCode).toBe(0);
    expect(result.message).toBe('Неизвестная ошибка');
  });

  it('should handle 404 error', () => {
    const error = {
      response: {
        status: 404,
        data: {
          message: 'Not Found',
        },
      },
    } as AxiosError;

    const result = handleApiError(error);

    expect(result.statusCode).toBe(404);
    expect(result.message).toBe('Not Found');
  });

  it('should handle 401 unauthorized error', () => {
    const error = {
      response: {
        status: 401,
        data: {
          message: 'Unauthorized',
        },
      },
    } as AxiosError;

    const result = handleApiError(error);

    expect(result.statusCode).toBe(401);
    expect(result.message).toBe('Unauthorized');
  });
});
