export interface CardForStudy {
  id: string;
  question: string;
  answer: string;
  isLearned: boolean;
}

export interface GetStudyCardsResponse {
  content: CardForStudy[];
}

export interface StudyAnswerRequest {
  cardId: string;
  status: 'remembered' | 'forgotten';
}

export interface StudyAnswerResponse {
  learnedPercent: number;
}
