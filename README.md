# QMemoryCards Frontend 🧠

QMemoryCards — это SPA-приложение для эффективного изучения информации по методу карточек. Пользователи могут создавать свои колоды, добавлять карточки с вопросами и ответами, изучать их с отслеживанием прогресса и делиться с другими через публичные ссылки.

## 🛠 Стек технологий

| Категория | Технологии |
|-----------|------------|
| Язык | TypeScript 5.0+ |
| Фреймворк | React 18, React Router 6 |
| Сборка | Vite 5.0 |
| Стили | Styled Components, Ant Design |
| Состояние | React Query |
| HTTP | Axios с interceptors |
| Архитектура | Feature-Sliced Design (FSD) |
| Инструменты | ESLint, Prettier |

## 📁 Структура проекта (FSD)
src/
├── app/           # Роутинг, провайдеры
├── entities/      # Бизнес-сущности (User, Deck, Card)
├── features/      # Функциональные блоки, хуки
├── pages/         # Страницы приложения
├── shared/        # Переиспользуемые UI и утилиты
├── widgets/       # Комплексные UI-блоки


### Предварительные требования
- Node.js 18+
- Backend API на http://localhost:8080

### Установка# Клонировать репозиторий
git clone <repository-url>
cd QMemoryCards/frontend

# Установить зависимости
npm install

### Запуск# Development сервер
npm run dev

# Build для продакшена
npm run build

# Lint и форматирование
npm run lint
npm run format

## Интеграционное тестирование в CI

Для интеграционных тестов фронтенда настроен GitHub Actions workflow:
- Файл: `.github/workflows/main.yaml`
- Job: `Frontend Integration Tests`
- Команда запуска: `npm run test:integration`

Триггеры запуска интеграционных тестов:
- `push` (изменения в `src/**`, `package.json`, `package-lock.json`, `vitest.config.ts`, `.github/workflows/main.yaml`)
- `pull_request` в `main` с теми же путями
- `schedule` (ежедневно по cron: `0 3 * * *`)

В тестах используются mock-сервисы через MSW, что изолирует проверки от внешнего окружения и ускоряет прогон.