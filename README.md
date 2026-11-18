# Order Desk

Учебное приложение: список заказов, создание и редактирование (модалка и детальная страница), независимая загрузка картинки. Next.js (App Router), TypeScript, PostgreSQL 17, Prisma 7, Zod 4.

## Запуск

```bash
npm ci
cp .env.example .env
docker compose up -d --wait
npm run db:migrate
npm run db:generate
npm run dev
```

[http://localhost:3000/orders](http://localhost:3000/orders). Загруженные файлы лежат в `uploads/` (в `.gitignore`), в БД — только имя файла.

## Структура

```
src/
  app/                  контракт Next.js: роуты, Server Actions, Route Handler
    orders/             page.tsx (тонкий), [id]/page.tsx, actions.ts, error.tsx
    files/actions.ts    uploadImageAction (не привязан к сущности)
    api/orders/[id]/image/route.ts   GET картинки для <img>
  modules/<entity>/     всё про сущность; новая сущность = новая папка
    components/         UI заказов (orders-view, order-form, order-details, order-info)
    service.ts          бизнес-логика: валидация, порядок операций, проверка fileId
    repository.ts       единственное место с Prisma
    schema.ts           Zod-схема входа (клиент + сервер)
    dto.ts / mapper.ts  тип для UI / Prisma → DTO (только сервер)
  shared/
    errors.ts           AppError, ActionResult, normalizeError (единственное логирование)
    action.ts           runAction: ошибка → ActionResult (единственное место)
    action-client.ts    callAction: исключение (нет сети) → ActionResult
    validation.ts       parseInput: Zod → AppError("validation")
    db/                 клиент Prisma + prisma-errors.ts (единственное место распознавания ошибок Prisma)
    files/              storage.ts (единственное место с fs), upload-image.ts (проверка + сохранение), image-signature.ts, file-name.ts
    ui/, providers/     generic UI: ImageUpload (action приходит пропом), модальное окно
prisma/  prisma.config.ts  next.config.ts  uploads/
```

Каждый слой знает только о слое ниже: `page / actions → service → repository / storage`.

## Ключевые решения

- Загрузка файла отдельно от формы: `uploadImageAction(FormData)` (`app/files`) → `fileId` (UUID + расширение по реальной сигнатуре). Сохранение заказа — `{ status, comment, fileId? }`, без FormData.
- Два action'а (`create` / `update`): разный контракт (`update` требует существующий заказ → `not_found`).
- Старый файл удаляется после успешной записи в БД; ошибка удаления только в лог.
- Известное ограничение: загруженный, но не привязанный к заказу файл остаётся на диске (в production — TTL-очистка сирот).
- `bodySizeLimit: 3mb` в `next.config.ts`: файл 2–3 МБ доходит до серверной валидации; более крупный отсекает клиент.
- `error.tsx` получает `retry` (Next 16.4) — перезапрашивает данные сегмента.

## Проверка

- `npm run lint`, `npm run build`.
- Файл: текстовый `.png`, файл > 2 МБ, пустой — понятные сообщения; во время загрузки блокируются инпут и «Сохранить».
- Комментарий < 3 символов или > 250 байт (130 русских букв) — ошибка под полем сразу.
- `docker compose stop`: `/orders` → error.tsx, сохранение → «Сервис временно недоступен», картинка → 503; `docker compose start` + «Повторить» восстанавливает работу.
