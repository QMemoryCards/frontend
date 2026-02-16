import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

export function renderWithRouter(ui: React.ReactElement, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => <MemoryRouter future={routerFutureConfig}>{children}</MemoryRouter>,
    ...options,
  });
}

export * from '@testing-library/react';
export { customRender as render };
