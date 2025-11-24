import { apiClient } from '@shared/api';
import type { GetStudyCardsResponse, StudyAnswerRequest, StudyAnswerResponse } from '../model/types';

export const studyApi = {
  getStudyCards: (deckId: string) => apiClient.get<GetStudyCardsResponse>(`/study/${deckId}/cards`),

  submitAnswer: (deckId: string, data: StudyAnswerRequest) =>
    apiClient.post<StudyAnswerResponse>(`/study/${deckId}/answer`, data),
};
