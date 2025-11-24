import { apiClient } from '@shared/api';
import type { Card, CreateCardRequest, UpdateCardRequest, GetCardsResponse } from '../model/types';

export const cardApi = {
  getCards: (deckId: string, page = 0, size = 100) =>
    apiClient.get<GetCardsResponse>(`/decks/${deckId}/cards`, {
      params: { page, size },
    }),

  createCard: (deckId: string, data: CreateCardRequest) =>
    apiClient.post<Card>(`/decks/${deckId}/cards`, data),

  updateCard: (deckId: string, cardId: string, data: UpdateCardRequest) =>
    apiClient.put<Card>(`/decks/${deckId}/cards/${cardId}`, data),

  deleteCard: (deckId: string, cardId: string) =>
    apiClient.delete(`/decks/${deckId}/cards/${cardId}`),
};
