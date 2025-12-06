/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, type ReactElement } from 'react';
import { render, screen, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit';

import { toaster } from '../toaster';
import { AuthProvider, useAuth, type UserInfo } from '../contexts/AuthContext';
import { AuthUIProvider } from '../contexts/AuthUIContext';

type RenderOptions = {
  route?: string;
  authUser?: UserInfo | null;
  initialEntries?: string[];
};

const AuthInitializer: React.FC<{ user?: UserInfo | null }> = ({ user }) => {
  const { setUser } = useAuth();

  useEffect(() => {
    if (user !== undefined) {
      setUser(user);
    }
  }, [setUser, user]);

  return null;
};

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', authUser, initialEntries }: RenderOptions = {},
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider theme="light">
      <ToasterProvider toaster={toaster}>
        <MemoryRouter initialEntries={initialEntries ?? [route]}>
          <AuthProvider>
            <AuthUIProvider>
              <AuthInitializer user={authUser} />
              {children}
              <ToasterComponent />
            </AuthUIProvider>
          </AuthProvider>
        </MemoryRouter>
      </ToasterProvider>
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper });
}

export { render, screen, within, waitFor, act, userEvent };
