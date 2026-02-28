# Hackathon Template

React-приложение с авторизацией, ролевой маршрутизацией и административной панелью управления пользователями.

---

## Стек технологий

| Категория | Технологии |
|-----------|-----------|
| Фреймворк | React 19 |
| Сборщик | Vite 8 |
| Маршрутизация | React Router 7 |
| Стили | Tailwind CSS 4 |
| UI-компоненты | shadcn/ui, Radix UI, Lucide React |
| HTTP-клиент | Axios |
| Формы | React Hook Form |
| Уведомления | Sonner |
| Утилиты | clsx, tailwind-merge, date-fns |

---

## Структура страниц

| Маршрут | Страница | Доступ |
|---------|----------|--------|
| `/` | Главная | Все |
| `/login` | Вход | Гости |
| `/registration` | Регистрация | Гости |
| `/admin` | Административная панель | Только `ADMIN` |

---

## API-эндпоинты

Базовый URL задаётся через переменную окружения `VITE_API_URL`.
Авторизация: `Authorization: Bearer <token>` (токен хранится в `localStorage`).

### Аутентификация

| Метод | Путь | Описание |
|-------|------|----------|
| `POST` | `/api/auth/login` | Вход. Тело: `{ email, password }` |
| `POST` | `/api/registration` | Регистрация. Тело: `{ username, email, password }` |
| `GET` | `/api/auth/me` | Получить текущего пользователя |
| `POST` | `/api/logout` | Выход |

### Администрирование пользователей

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/admin/users` | Список всех пользователей |
| `GET` | `/api/admin/users/{id}` | Получить пользователя по ID |
| `PATCH` | `/api/admin/users/{id}` | Обновить данные пользователя |
| `POST` | `/api/admin/users/{id}/block` | Заблокировать пользователя |
| `POST` | `/api/admin/users/{id}/unblock` | Разблокировать пользователя |
| `DELETE` | `/api/admin/users/{id}` | Удалить пользователя |

#### Тело PATCH `/api/admin/users/{id}`

```json
{
  "email": "new@example.com",
  "name": "Пётр",
  "surname": "Петров",
  "patronymic": null,
  "age": 13,
  "parentFullName": "Петров Пётр Петрович",
  "parentPhone": "+79991234567",
  "role": "USER"
}
```

> Если `age < 14`, поля `parentFullName` и `parentPhone` обязательны (иначе сервер вернёт `400`).

#### Ответ DELETE

```json
{ "code": "200", "message": "OK" }
```

---

## Как запустить

### 1. Установить зависимости

```bash
npm install
```

### 2. Настроить окружение

Создать файл `.env` в корне проекта:

```env
VITE_API_URL=http://your-api-host
```

### 3. Запустить в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:5173](http://localhost:5173).

### 4. Собрать для production

```bash
npm run build
```

### 5. Запустить preview-сборки

```bash
npm run preview
```

---

## Переменные окружения

| Переменная | Описание | Пример |
|------------|----------|--------|
| `VITE_API_URL` | Базовый URL бэкенда | `http://91.197.99.119` |
