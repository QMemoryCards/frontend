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

## CI/CD

Для проверок и публикации фронтенда настроен GitHub Actions workflow:

- Файл: `.github/workflows/ci.yml`
- Jobs: `Frontend Quality`, `Docker Image`, `GitHub Release`
- `Frontend Quality`: `npm ci`, `npm run lint`, `npm run format:check`,
  `npm run type-check:app`, `npm run test:ci`

Триггеры:

- `push` в `main`;
- `pull_request` в `main`;
- теги `v*` — сборка версионного образа и GitHub Release.

На `main` workflow публикует образы
`ghcr.io/qmemorycards/frontend:sha-<commit>` и `:latest` и запускает
system-testing через `repository_dispatch`.

В тестах используются mock-сервисы через MSW, что изолирует проверки от внешнего окружения и ускоряет прогон.
