# Order Desk

Учебный проект: эталон чистой структуры небольшого приложения. Заказы — список, создание и редактирование (в модалке и на странице заказа), загрузка картинки.

Next.js (App Router), TypeScript, PostgreSQL 17, Prisma 7, Zod 4, Tailwind 4.

## Требования

- Node.js `^22.12` или `>=24`
- Docker (для PostgreSQL)

## Запуск

```bash
npm ci
cp .env.example .env     # при необходимости поправьте значения
docker compose up -d --wait
npm run db:migrate
npm run db:generate
npm run dev
```

Приложение: [http://localhost:3000/orders](http://localhost:3000/orders).

## Сборка

```bash
npm run build
npm start
```

## Прочее

- `npm run lint` — проверка кода и стиля.
- Загруженные картинки лежат в `uploads/`, в БД хранится только имя файла.
- `docker compose down` останавливает базу, `docker compose down -v` — вместе с данными.
