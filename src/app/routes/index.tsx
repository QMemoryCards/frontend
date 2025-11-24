import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WelcomePage } from '@pages/welcome';
import { LoginPage, RegisterPage } from '@pages/auth';
import { DecksPage } from '@pages/decks';
import { DeckEditPage } from '@pages/deck-edit';
import { ProfilePage } from '@pages/profile';
import { StudyPage } from '@pages/study';
import { ROUTES } from '@shared/config';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <WelcomePage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.DECKS,
    element: <DecksPage />,
  },
  {
    path: ROUTES.DECK_EDIT,
    element: <DeckEditPage />,
  },
  {
    path: ROUTES.STUDY,
    element: <StudyPage />,
  },
  {
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
  },
  // Временная заглушка для других маршрутов
  {
    path: '*',
    element: <WelcomePage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
