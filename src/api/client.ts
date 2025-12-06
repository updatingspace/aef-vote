import { getSessionToken } from './sessionToken';
import { logger } from '../utils/logger';

export type ApiErrorKind =
  | 'network'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'server'
  | 'unknown';

const DEFAULT_API_BASE_URL = 'http://localhost:8000/api';
const rawBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '__VITE_API_BASE_URL__';
const normalizedEnvBase =
  rawBaseUrl === '__VITE_API_BASE_URL__' ? undefined : rawBaseUrl?.replace(/\/$/, '');
const baseUrl = (normalizedEnvBase ?? rawBaseUrl ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
export const apiBaseUrl = baseUrl;

const withLeadingSlash = (path: string) =>
  path.startsWith('/') ? path : `/${path}`;

const nowMs = () =>
  typeof performance !== 'undefined' && performance.now
    ? performance.now()
    : Date.now();

export class ApiError extends Error {
  public status?: number;
  public kind: ApiErrorKind;
  public details?: unknown;

  constructor(message: string, options: { status?: number; kind: ApiErrorKind; details?: unknown; cause?: unknown }) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.kind = options.kind;
    this.details = options.details;
    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError;

const statusToKind = (status: number): ApiErrorKind => {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status >= 500) return 'server';
  return 'unknown';
};

type ErrorPayload = {
  detail?: unknown;
  message?: unknown;
  errors?: Record<string, unknown>;
  fields?: Record<string, unknown>;
};

export const extractApiErrorMessage = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null;
  const data = payload as ErrorPayload;

  if (data.fields && typeof data.fields === 'object') {
    for (const value of Object.values(data.fields)) {
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
  }

  if (data.errors && typeof data.errors === 'object') {
    for (const entry of Object.values(data.errors)) {
      if (!Array.isArray(entry)) continue;
      for (const item of entry) {
        if (typeof item === 'string' && item.trim()) return item.trim();
        if (
          item &&
          typeof item === 'object' &&
          'message' in item &&
          typeof (item as { message?: unknown }).message === 'string'
        ) {
          const msg = (item as { message?: string }).message;
          if (msg?.trim()) return msg.trim();
        }
      }
    }
  }

  if (typeof data.detail === 'string' && data.detail.trim()) return data.detail.trim();
  if (typeof data.message === 'string' && data.message.trim()) return data.message.trim();
  return null;
};

const parseErrorMessage = async (
  response: Response,
): Promise<{ message: string | null; details: ErrorPayload | null }> => {
  try {
    const data = await response.clone().json();
    return { message: extractApiErrorMessage(data), details: data as ErrorPayload };
  } catch {
    /* ignore */
  }
  return { message: null, details: null };
};

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const normalizedPath = withLeadingSlash(path);
  const url = `${baseUrl}${normalizedPath}`;
  const sessionToken = getSessionToken();
  const method = (options.method ?? 'GET').toUpperCase();
  const startedAt = nowMs();

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(sessionToken ? { 'X-Session-Token': sessionToken } : {}),
        ...(options.headers ?? {}),
      },
      credentials: 'include',
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    logger.error('API request failed: network error', {
      area: 'api',
      event: 'request_failed',
      data: { url: normalizedPath, method },
      error,
    });
    throw new ApiError('Не удалось подключиться к API', {
      kind: 'network',
      cause: error,
    });
  }

  if (!response.ok) {
    const durationMs = Math.round(nowMs() - startedAt);
    const { message: messageFromBody, details } = await parseErrorMessage(response);
    const message = messageFromBody ?? `Запрос завершился с ошибкой (${response.status})`;
    const level =
      response.status >= 500
        ? 'critical'
        : response.status === 400
          ? 'info'
          : 'warn';
    logger[level]('API request returned error', {
      area: 'api',
      event: 'response_failed',
      data: {
        url: normalizedPath,
        method,
        status: response.status,
        duration_ms: durationMs,
      },
      error: messageFromBody ?? message,
    });

    throw new ApiError(message, {
      status: response.status,
      kind: statusToKind(response.status),
      details,
    });
  }

  logger.debug('API request completed', {
    area: 'api',
    event: 'response_ok',
    data: {
      url: normalizedPath,
      method,
      status: response.status,
      duration_ms: Math.round(nowMs() - startedAt),
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
