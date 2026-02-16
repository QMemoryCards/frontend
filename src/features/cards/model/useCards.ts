import { useCallback, useState } from 'react';
import { message } from 'antd';
import { AxiosError } from 'axios';
import type { Card, CreateCardRequest, UpdateCardRequest } from '@entities/card';
import { cardApi } from '@entities/card';
import { handleApiError } from '@shared/api';
import { VALIDATION } from '@shared/config';

export const useCards = (deckId: string) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cardApi.getCards(deckId);
      setCards(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  return { cards, loading, totalElements, fetchCards, setCards, setTotalElements };
};

export const useCreateCard = (deckId: string) => {
  const [loading, setLoading] = useState(false);

  const createCard = async (data: CreateCardRequest): Promise<Card | null> => {
    setLoading(true);
    try {
      const response = await cardApi.createCard(deckId, data);
      message.success('Карточка создана');
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      if (apiError.statusCode === 422) {
        message.error(`Достигнут лимит карточек (${VALIDATION.CARD.MAX_CARDS})`);
      } else {
        message.error(apiError.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createCard, loading };
};

export const useUpdateCard = (deckId: string) => {
  const [loading, setLoading] = useState(false);

  const updateCard = async (cardId: string, data: UpdateCardRequest): Promise<Card | null> => {
    setLoading(true);
    try {
      const response = await cardApi.updateCard(deckId, cardId, data);
      message.success('Карточка обновлена');
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      message.error(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateCard, loading };
};

export const useDeleteCard = (deckId: string) => {
  const [loading, setLoading] = useState(false);

  const deleteCard = async (cardId: string): Promise<boolean> => {
    setLoading(true);
    try {
      await cardApi.deleteCard(deckId, cardId);
      message.success('Карточка удалена');
      return true;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      message.error(apiError.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCard, loading };
};
