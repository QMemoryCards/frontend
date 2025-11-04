import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WelcomePage } from '@pages/welcome';
import { LoginPage, RegisterPage } from '@pages/auth';
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
  // Временная заглушка для других маршрутов
  {
    path: '*',
    element: <WelcomePage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
