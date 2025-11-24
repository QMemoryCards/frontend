import { apiClient } from '@shared/api';
import type {
  CreateDeckResponce,
  CreateDeckRequest,
  GetDecksResponse,
  UpdateDeckRequest,
  UpdateDeckResponse,
  DeckDetails,
} from '../model/types';

export const createDeck = async (data: CreateDeckRequest): Promise<CreateDeckResponce> => {
  const response = await apiClient.post<CreateDeckResponce>('/decks', data);
  return response.data;
};

export const getDecks = async (page: number = 0, size: number = 20): Promise<GetDecksResponse> => {
  const response = await apiClient.get<GetDecksResponse>('/decks', {
    params: { page, size },
  });
  return response.data;
};

export const updateDeck = async (deckId: string, data: UpdateDeckRequest): Promise<UpdateDeckResponse> => {
  const response = await apiClient.put<UpdateDeckResponse>(`/decks/${deckId}`, data);
  return response.data;
};

export const deleteDeck = async (deckId: string): Promise<void> => {
  await apiClient.delete(`/decks/${deckId}`);
};

export const getDeck = async (deckId: string): Promise<DeckDetails> => {
  const response = await apiClient.options<DeckDetails>(`decks/${deckId}`);
  return response.data
}
