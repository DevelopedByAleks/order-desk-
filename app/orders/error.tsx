"use client"

export default function OrdersError({ retry }: { retry: () => void }) {
  return (
    <>
      <h1>Не удалось загрузить заказы</h1>
      <button type="button" onClick={retry}>Повторить</button>
    </>
  )
}
