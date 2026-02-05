# Updating Space Portal - Microservices

Репозиторий содержит набор Django сервисов (Ninja) и React/Vite фронтенд. Легаси-монолит удален; актуальная структура - `services/` и `infra/`.

## Быстрый старт (dev)
- Полный dev-режим с локальным ID через GHCR images:
  `docker compose -f infra/docker-compose/docker-compose.dev.yml up --build`
- Prod-like режим с удаленным ID (`id.updspace.com`):
  `docker compose -f infra/docker-compose/docker-compose.remote.yml up --build`
- Фронт: `http://aef.localhost`
- BFF API: `http://aef.localhost/api/v1`
- IdP (local mode): `http://id.localhost`

## Сервисы
- `services/bff` (8080) - API gateway / session layer
- `services/access` (8002) - RBAC
- `services/portal` (8003) - Portal core
- `services/voting` (8004) - Voting
- `services/events` (8005) - Events
- `services/activity` (8006) - Activity feed
- `web/portal-frontend` (5173) - Frontend

## OAuth / OIDC параметры
- Все параметры интеграции с ID вынесены в env:
  - `BFF_OIDC_CLIENT_ID`
  - `BFF_OIDC_CLIENT_SECRET`
  - `BFF_UPSTREAM_ID_URL`
  - `ID_BASE_URL`
  - `ID_PUBLIC_BASE_URL`
- Local mode:
  - `scripts/dev-up.sh --id-mode local` автоматически выполняет bootstrap клиента в локальном ID.
- Remote mode:
  - клиент должен быть заранее зарегистрирован в `id.updspace.com`,
  - секрет передаётся только через env (`BFF_OIDC_CLIENT_SECRET`).

## Инфраструктура и доки
- Dev compose: `infra/docker-compose/docker-compose.dev.yml`
- Remote compose: `infra/docker-compose/docker-compose.remote.yml`
- Convenience wrapper: `infra/docker-compose/docker-compose.yml`
