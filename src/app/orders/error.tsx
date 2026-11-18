"use client";

// retry (Next 16.4) заново запрашивает данные сегмента; reset только сбрасывает состояние.
export default function OrdersError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <>
      <h1>Не удалось загрузить заказы</h1>
      <p>Сервис временно недоступен. Попробуйте ещё раз.</p>
      <button type="button" onClick={() => retry()}>Повторить</button>
    </>
  );
}
