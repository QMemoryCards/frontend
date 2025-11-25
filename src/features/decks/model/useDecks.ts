import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { App } from 'antd';
import { AxiosError } from 'axios';
import { createDeck, getDeck, updateDeck, deleteDeck, getDecks } from '@entities/deck';
import type { CreateDeckRequest, UpdateDeckRequest, DeckDetails } from '@entities/deck';
import { handleApiError } from '@shared/api';
import { ROUTES } from '@shared/config';

interface UseDecksReturn {
  decks: DeckDetails[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalElements: number;
  fetchDecks: (page?: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useDecks = (initialPage: number = 0, pageSize: number = 20): UseDecksReturn => {
  const [decks, setDecks] = useState<DeckDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const { message } = App.useApp();

  const fetchDecks = useCallback(
    async (page: number = currentPage) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getDecks(page, pageSize);
        const mappedDecks = response.content.map(deck => ({
          id: deck.id,
          name: deck.name,
          description: deck.description,
          cardCount: deck.cardCount,
          learnedPercent: deck.learnedPercent,
          lastStudied: deck.lastStudied,
          createdAt: deck.createdAt,
          updatedAt: deck.updatedAt,
        }));

        setDecks(mappedDecks);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (err: unknown) {
        const apiError = handleApiError(err as AxiosError);
        let errorMessage = 'Ошибка загрузки колод';

        if (apiError.statusCode === 0) {
          errorMessage = 'Сервер недоступен. Проверьте подключение к интернету';
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }

        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, pageSize, message]
  );

  const refetch = useCallback(() => fetchDecks(currentPage), [fetchDecks, currentPage]);

  useEffect(() => {
    fetchDecks(initialPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    decks,
    isLoading,
    error,
    totalPages,
    currentPage,
    totalElements,
    fetchDecks,
    refetch,
  };
};

interface UseCreateDeckReturn {
  createDeck: (data: CreateDeckRequest) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const useCreateDeck = (): UseCreateDeckReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const createDeckHandler = async (data: CreateDeckRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await createDeck(data);
      message.success('Колода успешно создана');
      navigate(ROUTES.DECKS);
      return true; // Успех
    } catch (err: unknown) {
      const apiError = handleApiError(err as AxiosError);
      let errorMessage = 'Ошибка создания колоды';

      if (apiError.statusCode === 409) {
        errorMessage = 'Колода с таким названием уже существует';
      } else if (apiError.statusCode === 400) {
        errorMessage = apiError.message || 'Неверные данные для создания колоды';
      } else if (apiError.statusCode === 0) {
        errorMessage = 'Сервер недоступен. Проверьте подключение к интернету';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);
      message.error(errorMessage);
      return false; // Ошибка - модалка не закроется
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
  const { message } = App.useApp();

  const fetchDeck = async (deckId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const deckData = await getDeck(deckId);
      setDeck(deckData);
    } catch (err: unknown) {
      const apiError = handleApiError(err as AxiosError);
      let errorMessage = 'Ошибка загрузки колоды';

      if (apiError.statusCode === 404) {
        errorMessage = 'Колода не найдена';
      } else if (apiError.statusCode === 0) {
        errorMessage = 'Сервер недоступен. Проверьте подключение к интернету';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);
      message.error(errorMessage);
      // НЕ бросаем ошибку дальше
    } finally {
      setIsLoading(false);
    }
  };

  return { deck, isLoading, error, fetchDeck };
};

interface UseUpdateDeckReturn {
  updateDeck: (deckId: string, data: UpdateDeckRequest) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const useUpdateDeck = (): UseUpdateDeckReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const updateDeckHandler = async (deckId: string, data: UpdateDeckRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await updateDeck(deckId, data);
      message.success('Колода успешно обновлена');
      navigate(ROUTES.DECKS);
      return true; // Успех
    } catch (err: unknown) {
      const apiError = handleApiError(err as AxiosError);
      let errorMessage = 'Ошибка обновления колоды';

      if (apiError.statusCode === 409) {
        errorMessage = 'Колода с таким названием уже существует';
      } else if (apiError.statusCode === 404) {
        errorMessage = 'Колода не найдена';
      } else if (apiError.statusCode === 400) {
        errorMessage = apiError.message || 'Неверные данные для обновления колоды';
      } else if (apiError.statusCode === 0) {
        errorMessage = 'Сервер недоступен. Проверьте подключение к интернету';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);
      message.error(errorMessage);
      return false; // Ошибка - модалка не закроется
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
  const { message } = App.useApp();

  const deleteDeckHandler = async (deckId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteDeck(deckId);
      message.success('Колода успешно удалена');
    } catch (err: unknown) {
      const apiError = handleApiError(err as AxiosError);
      let errorMessage = 'Ошибка удаления колоды';

      if (apiError.statusCode === 404) {
        errorMessage = 'Колода не найдена';
      } else if (apiError.statusCode === 0) {
        errorMessage = 'Сервер недоступен. Проверьте подключение к интернету';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteDeck: deleteDeckHandler, isLoading, error };
};

interface UseShareDeckReturn {
  shareDeck: (deckId: string) => Promise<ShareDeckResponse | null>;
  isLoading: boolean;
  error: string | null;
  shareData: ShareDeckResponse | null;
}

export const useShareDeck = (): UseShareDeckReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareData, setShareData] = useState<ShareDeckResponse | null>(null);
  const { message } = App.useApp();

  const shareDeckHandler = async (deckId: string): Promise<ShareDeckResponse | null> => {
    setIsLoading(true);
    setError(null);
    setShareData(null);

    try {
      const data = await shareDeck(deckId);
      setShareData(data);
      message.success('Ссылка для общего доступа создана');
      return data;
    } catch (err: unknown) {
      const apiError = handleApiError(err as AxiosError);
      let errorMessage = 'Ошибка создания общей ссылки';

      if (apiError.statusCode === 401) {
        errorMessage = 'Пользователь не авторизован';
      } else if (apiError.statusCode === 403) {
        errorMessage = 'Доступ запрещен';
      } else if (apiError.statusCode === 404) {
        errorMessage = 'Колода не найдена';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);
      message.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    shareDeck: shareDeckHandler,
    isLoading,
    error,
    shareData,
  };
};

interface UseSharedDeckReturn {
  deck: SharedDeck | null;
  isLoading: boolean;
  error: string | null;
  fetchSharedDeck: (token: string) => Promise<void>;
}

export const useSharedDeck = (): UseSharedDeckReturn => {
  const [deck, setDeck] = useState<SharedDeck | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { message } = App.useApp();

  const fetchSharedDeck = async (token: string) => {
    setIsLoading(true);
    setError(null);
    setDeck(null);

    try {
      const deckData = await getSharedDeck(token);
      setDeck(deckData);
    } catch (err: unknown) {
      const apiError = handleApiError(err as AxiosError);
      let errorMessage = 'Ошибка загрузки колоды';

      if (apiError.statusCode === 404) {
        errorMessage = 'Колода не найдена или ссылка устарела';
      } else if (apiError.statusCode === 0) {
        errorMessage = 'Сервер недоступен. Проверьте подключение к интернету';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { deck, isLoading, error, fetchSharedDeck };
};



interface UseImportSharedDeckReturn {
  importDeck: (token: string, data?: ImportSharedDeckRequest) => Promise<DeckDetails | null>;
  isLoading: boolean;
  error: string | null;
  importedDeck: DeckDetails | null;
}

export const useImportSharedDeck = (): UseImportSharedDeckReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedDeck, setImportedDeck] = useState<DeckDetails | null>(null);
  const { message } = App.useApp();

  const importDeckHandler = async (token: string, data?: ImportSharedDeckRequest): Promise<DeckDetails | null> => {
    setIsLoading(true);
    setError(null);
    setImportedDeck(null);

    try {
      const deckData = await importSharedDeck(token, data);
      setImportedDeck(deckData);
      message.success('Колода успешно импортирована');
      return deckData;
    } catch (err: unknown) {
      const apiError = handleApiError(err as AxiosError);
      let errorMessage = 'Ошибка импорта колоды';

      if (apiError.statusCode === 404) {
        errorMessage = 'Колода не найдена или ссылка устарела';
      } else if (apiError.statusCode === 401) {
        errorMessage = 'Не авторизован';
      } else if (apiError.statusCode === 409) {
        errorMessage = 'Колода с таким названием уже существует';
      } else if (apiError.statusCode === 0) {
        errorMessage = 'Сервер недоступен. Проверьте подключение к интернету';
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);
      message.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    importDeck: importDeckHandler,
    isLoading,
    error,
    importedDeck,
  };
};