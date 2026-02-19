import { apiClient } from '@shared/api';
import type {
  CreateDeckRequest,
  CreateDeckResponce,
  DeckDetails,
  GetDecksResponse,
  ImportSharedDeckRequest,
  SharedDeck,
  ShareDeckResponse,
  UpdateDeckRequest,
  UpdateDeckResponse,
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

export const updateDeck = async (
  deckId: string,
  data: UpdateDeckRequest
): Promise<UpdateDeckResponse> => {
  const response = await apiClient.put<UpdateDeckResponse>(`/decks/${deckId}`, data);
  return response.data;
};

export const deleteDeck = async (deckId: string): Promise<void> => {
  await apiClient.delete(`/decks/${deckId}`);
};

export const getDeck = async (deckId: string): Promise<DeckDetails> => {
  const response = await apiClient.get<DeckDetails>(`/decks/${deckId}`);
  return response.data;
};

export const shareDeck = async (deckId: string): Promise<ShareDeckResponse> => {
  const response = await apiClient.post<ShareDeckResponse>(`decks/${deckId}/share`);
  return response.data;
};

export const getSharedDeck = async (token: string): Promise<SharedDeck> => {
  const response = await apiClient.get<SharedDeck>(`share/${token}`);
  return response.data;
};

export const importSharedDeck = async (
  token: string,
  data?: ImportSharedDeckRequest
): Promise<DeckDetails> => {
  const response = await apiClient.post<DeckDetails>(`share/${token}/import`, data);
  return response.data;
};
