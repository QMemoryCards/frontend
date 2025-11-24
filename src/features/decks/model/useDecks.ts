import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDeck, getDeck, updateDeck, deleteDeck } from '@entities/deck';
import type { CreateDeckRequest, UpdateDeckRequest, DeckDetails } from '@entities/deck';
import { ROUTES } from '@shared/config';

interface UseCreateDeckReturn {
  createDeck: (data: CreateDeckRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useCreateDeck = (): UseCreateDeckReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createDeckHandler = async (data: CreateDeckRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await createDeck(data);
      navigate(ROUTES.DECKS);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания колоды';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createDeck: createDeckHandler, isLoading, error };
};

interface UseGetDeckReturn {
  deck: DeckDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchDeck: (deckId: string) => Promise<void>;
}

export const useGetDeck = (): UseGetDeckReturn => {
  const [deck, setDeck] = useState<DeckDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeck = async (deckId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const deckData = await getDeck(deckId);
      setDeck(deckData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки колоды';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deck, isLoading, error, fetchDeck };
};

interface UseUpdateDeckReturn {
  updateDeck: (deckId: string, data: UpdateDeckRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useUpdateDeck = (): UseUpdateDeckReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const updateDeckHandler = async (deckId: string, data: UpdateDeckRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateDeck(deckId, data);
      navigate(ROUTES.DECKS);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления колоды';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateDeck: updateDeckHandler, isLoading, error };
};

interface UseDeleteDeckReturn {
  deleteDeck: (deckId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useDeleteDeck = (): UseDeleteDeckReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDeckHandler = async (deckId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteDeck(deckId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления колоды';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteDeck: deleteDeckHandler, isLoading, error };
};