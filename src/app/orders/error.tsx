"use client";

// Props — из docs/01-app/03-api-reference/03-file-conventions/error.md: `error` и `retry`
// (retry заново запрашивает данные сегмента; reset только сбрасывает состояние без перезапроса).
export default function OrdersError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <>
      <h1>Не удалось загрузить заказы</h1>
      <p>Сервис временно недоступен. Попробуйте ещё раз.</p>
      <button type="button" onClick={() => retry()}>Повторить</button>
    </>
  );
}
