# Бизнес-Помощник - Frontend

Frontend приложение для Бизнес-Помощника на React + TypeScript.

## Требования

- Node.js 16+ и npm
- Бекенд должен быть запущен на `http://localhost:8000` (или настроить через переменную окружения)

## Установка

```bash
npm install
```

## Настройка

Создайте файл `.env` в корне проекта (опционально):

```env
REACT_APP_API_URL=http://localhost:8000
```

По умолчанию используется `http://localhost:8000`.

## Запуск

```bash
npm start
```

Приложение откроется на `http://localhost:3000`.

## Структура проекта

Проект использует архитектуру Feature-Sliced Design (FSD):

- `src/app/` - Инициализация приложения, глобальные стили
- `src/pages/` - Страницы приложения
- `src/widgets/` - Крупные составные компоненты (Header, Chat, Layout)
- `src/features/` - Функциональные возможности (send-message, auth)
- `src/entities/` - Бизнес-сущности (message, user)
- `src/shared/` - Переиспользуемые компоненты, утилиты, API

## API

API клиент находится в `src/shared/api/`:

- `httpClient.ts` - HTTP клиент на основе axios
- `businessAssistantApi.ts` - Методы для работы с API бекенда
- `types.ts` - TypeScript типы для API

## Технологии

- React 19
- TypeScript
- Tailwind CSS
- Axios
- Feature-Sliced Design
