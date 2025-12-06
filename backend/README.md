# Backend

## Что внутри

- Django 5 + Django-Ninja (Pydantic v2) для REST.
- Номинации/опции хранятся в БД (`Nomination`, `NominationOption`) и подхватываются из `nominations/fixtures/nominations.json`, если база пустая. Идентификаторы (`id`) стабильные — через админку можно переименовывать/переставлять, но не менять ID.
- Голоса пишутся в БД (`NominationVote`), в админке видны связи с номинацией и опцией. Для жёсткой идентификации можно потребовать привязку Telegram (`TELEGRAM_REQUIRE_LINK_FOR_VOTING`).
- Привязка Telegram хранится в `accounts.TelegramProfile`, подпись проверяется по `TELEGRAM_BOT_TOKEN`, а по списку `TELEGRAM_ADMIN_IDS` можно автоматически выдавать staff/superuser.
- Ruff настроен как dev-зависимость (`uv run ruff check .`).

## Быстрый старт (uv)

```bash
cd backend
uv run python manage.py migrate
uv run python manage.py runserver 8000
# API будет на http://127.0.0.1:8000/api/
```

## Окружение

- Цель — свежий стек: `pydantic 2.12.5`, `django-ninja-jwt 5.4.2`, `django-ninja 1.5.1`.
- Рекомендуемая версия Python — 3.12/3.13. С Python 3.14 используйте обновленные зависимости и обязательно пересоберите окружение, чтобы не подхватывался системный Pydantic v1.
- Быстрая установка зависимостей:
  - `python3.12 -m venv .venv && source .venv/bin/activate && pip install -r requirements/dev.txt`
  - или через uv: `uv venv && source .venv/bin/activate && uv pip install -r requirements/dev.txt`

## Роуты

- `GET /api/health` — проверка живости.
- `GET /api/nominations/` — список всех номинаций и опций.
- `GET /api/nominations/{id}` — детальная информация по номинации.
- `POST /api/nominations/{id}/vote` — тело `{ "option_id": "nom-1-opt-1" }`, ответ с актуальными счетчиками голосов по опциям.
- `GET /api/votings/` — список всех конфигураций голосований вместе с описаниями, дедлайнами и списком номинаций (без данных по кандидатам/вариантам).
- `POST /api/auth/register` — регистрация сессии через email/ник/пароль.
- `POST /api/auth/login` / `POST /api/auth/logout` — вход и выход (сессионные куки).
- `POST /api/auth/telegram` — вход или привязка через Telegram Login Widget (передавайте payload с полями `id`, `hash`, `auth_date`, `first_name` и т.п.).
- `GET /api/auth/me` — профиль + активные сессии; `DELETE /api/auth/sessions/{key}` — завершить сессию.
- `DELETE /api/auth/me` — удалить аккаунт, привязку Telegram и все голоса пользователя (остальные данные остаются нетронутыми).

Все поля в ответах в `snake_case`:

```json
{
  "id": "1",
  "title": "Номинация 1",
  "description": "Краткое описание номинации. Текст-заглушка.",
  "options": [{"id": "nom-1-opt-1", "title": "Игра 1", "image_url": null}]
}
```

## Админка

- `python manage.py createsuperuser` и заходите на `/admin/`.
- Номинации редактируются в списке `Номинации`; опции можно править прямо во вкладке номинации (inline) или отдельным списком `Опции номинаций`.
- Поля `id` автогенерируются из названия при создании и становятся read-only после сохранения, чтобы не ломать связи в API/голосах.
- Дедлайн/статус голосования — в разделе `Настройки голосования`.

## Идея интеграции с фронтом

- На странице списка — загрузить `GET /api/nominations/` и отрисовать по существующим ID (они совпадают с `Link to="/nominations/{id}"`).
- На детальной странице — `GET /api/nominations/{id}` для карточек опций; при клике отправлять `POST /api/nominations/{id}/vote` и использовать `counts` из ответа для подсветки/статистики.
- Если фронт ходит с Vite на 5173, проще всего настроить proxy в dev-сервере или добавить CORS middleware (например, `django-cors-headers`) — пока не подключал, чтобы не тянуть лишние зависимости.

## Telegram-настройки

- `TELEGRAM_BOT_TOKEN` — токен бота для проверки подписи Telegram Login Widget.
- `TELEGRAM_LOGIN_MAX_AGE` — сколько секунд считать подпись валидной (по умолчанию сутки).
- `TELEGRAM_REQUIRE_LINK_FOR_VOTING` — если `true`, голосовать могут только пользователи с привязанным Telegram.
- `TELEGRAM_ADMIN_IDS` — список Telegram ID через запятую; таким пользователям автоматически выставляются `is_staff` и `is_superuser` при входе через Telegram.
