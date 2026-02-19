import { useState } from 'react';
import { message } from 'antd';
import { AxiosError } from 'axios';
import type { CardForStudy, StudyAnswerRequest } from '@entities/study';
import { studyApi } from '@entities/study';
import { handleApiError } from '@shared/api';

export const useStudy = (deckId: string) => {
  const [cards, setCards] = useState<CardForStudy[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [rememberedCount, setRememberedCount] = useState(0);
  const [forgottenCount, setForgottenCount] = useState(0);

  const fetchStudyCards = async () => {
    setLoading(true);
    try {
      const response = await studyApi.getStudyCards(deckId);
      const cardsData = Array.isArray(response.data) ? response.data : response.data.content || [];
      setCards(cardsData);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setRememberedCount(0);
      setForgottenCount(0);
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (status: 'remembered' | 'forgotten') => {
    if (!cards[currentCardIndex]) return;

    const answerData: StudyAnswerRequest = {
      cardId: cards[currentCardIndex].id,
      status,
    };

    try {
      await studyApi.submitAnswer(deckId, answerData);

      if (status === 'remembered') {
        setRememberedCount(prev => prev + 1);
      } else {
        setForgottenCount(prev => prev + 1);
      }

      setShowAnswer(false);

      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        setCurrentCardIndex(prev => prev + 1);
      }
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      message.error(apiError.message);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(prev => !prev);
  };

  const isLastCard = currentCardIndex === cards.length - 1;
  const isCompleted = currentCardIndex >= cards.length && cards.length > 0;
  const progress =
    cards.length > 0 ? Math.round(((rememberedCount + forgottenCount) / cards.length) * 100) : 0;

  return {
    cards,
    loading,
    currentCardIndex,
    showAnswer,
    rememberedCount,
    forgottenCount,
    isLastCard,
    isCompleted,
    progress,
    fetchStudyCards,
    submitAnswer,
    toggleAnswer,
  };
};
