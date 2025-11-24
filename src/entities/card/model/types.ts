export interface Card {
  id: string;
  question: string;
  answer: string;
  isLearned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardRequest {
  question: string;
  answer: string;
}

export interface UpdateCardRequest {
  question?: string;
  answer?: string;
}

export interface GetCardsResponse {
  content: Card[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
