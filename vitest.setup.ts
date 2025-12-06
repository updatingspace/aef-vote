import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

import {
  adminVotingsApiMock,
  gamesApiMock,
  nominationsApiMock,
  resetAllApiMocks,
  serviceApiMock,
  votingsApiMock,
} from './src/test/mocks/api';

vi.mock('./src/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    critical: vi.fn(),
  },
}));

vi.mock('./src/api/votings', () => votingsApiMock);
vi.mock('./src/api/nominations', () => nominationsApiMock);
vi.mock('./src/services/api', () => serviceApiMock);
vi.mock('./src/api/adminVotings', () => adminVotingsApiMock);
vi.mock('./src/api/games', () => gamesApiMock);

const noop = () => {};

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe = noop;
    unobserve = noop;
    disconnect = noop;
  };
}

if (!globalThis.matchMedia) {
  globalThis.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: noop,
    removeListener: noop,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => false,
  });
}

if (!HTMLElement.prototype.scrollTo) {
  HTMLElement.prototype.scrollTo = noop;
}

if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = noop as typeof HTMLElement.prototype.scrollIntoView;
}

beforeEach(() => {
  resetAllApiMocks();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
