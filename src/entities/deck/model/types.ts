export interface Deck {
  id: string;
  name: string;
  description: string;
}

export interface CreateDeckRequest {
  name: string;
  description?: string;
}

export interface CreateDeckResponce {
  id: string;
  name: string;
  description: string;
  cardCount: string;
  learnedPercent: string;
  lastStudied: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetDecksResponse {
  content: Array<{
    id: string;
    name: string;
    description: string;
    cardCount: number;
    learnedPercent: number;
    lastStudied: string;
    createdAt: string;
    updatedAt: string;
  }>;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface DeckDetails {
  id: string;
  name: string;
  description: string | null;
  cardCount: number;
  learnedPercent: number;
  lastStudied: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDeckRequest {
  name?: string;
  description?: string;
}

export interface UpdateDeckResponse {
  id: string;
  name: string;
  description: string;
  cardcount: number;
  learnedPercent: number;
  lastStudied: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShareDeckResponse {
  token: string;
  url: string;
}

export interface SharedDeck {
  name: string;
  description: string;
  cardCount: number;
}

export interface ImportSharedDeckRequest {
  newName?: string;
  newDescription?: string;
}

