import React from 'react';

import App from './App';
import { ApiError } from './api/client';
import { serviceApiMock } from './test/mocks/api';
import { renderWithProviders, screen } from './test/test-utils';

describe('App integration', () => {
  test('opens auth modal when guest visits a protected route', async () => {
    serviceApiMock.me.mockRejectedValueOnce(
      new ApiError('unauthorized', { kind: 'unauthorized', status: 401 }),
    );

    renderWithProviders(<App />, { route: '/profile' });

    expect(await screen.findByText('Вход')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('renders admin page for superuser', async () => {
    renderWithProviders(<App />, { route: '/admin' });

    expect(await screen.findByText('Панель модерации')).toBeInTheDocument();
    expect(screen.getAllByText('AEF Game Jam · основной поток')[0]).toBeInTheDocument();
  });
});
