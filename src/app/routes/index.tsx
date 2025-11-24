import React, { useEffect, lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from 'antd';
import { Spinner } from '@shared/ui';
import { WelcomePage } from '@pages/welcome';
import { ROUTES } from '@shared/config';
import { setGlobalMessage } from '@shared/lib/toast';

// Lazy load страниц для оптимизации производительности
const LoginPage = lazy(() => import('@pages/auth').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@pages/auth').then(m => ({ default: m.RegisterPage })));
const DecksPage = lazy(() => import('@pages/decks').then(m => ({ default: m.DecksPage })));
const DeckEditPage = lazy(() =>
  import('@pages/deck-edit').then(m => ({ default: m.DeckEditPage }))
);
const ProfilePage = lazy(() => import('@pages/profile').then(m => ({ default: m.ProfilePage })));
const StudyPage = lazy(() => import('@pages/study').then(m => ({ default: m.StudyPage })));

// Компонент загрузки для lazy-loaded роутов
const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}
  >
    <Spinner size={48} color="#ffffff" />
  </div>
);

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <WelcomePage />,
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <Suspense fallback={<PageLoader />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.DECKS,
    element: (
      <Suspense fallback={<PageLoader />}>
        <DecksPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.DECK_EDIT,
    element: (
      <Suspense fallback={<PageLoader />}>
        <DeckEditPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.STUDY,
    element: (
      <Suspense fallback={<PageLoader />}>
        <StudyPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.PROFILE,
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProfilePage />
      </Suspense>
    ),
  },
  // Временная заглушка для других маршрутов
  {
    path: '*',
    element: <WelcomePage />,
  },
]);

export const AppRouter: React.FC = () => {
  const { message } = App.useApp();

  // Инициализируем глобальный message API
  useEffect(() => {
    setGlobalMessage(message);
  }, [message]);

  return <RouterProvider router={router} />;
};
