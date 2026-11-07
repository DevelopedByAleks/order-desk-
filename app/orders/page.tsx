import { connection } from "next/server";
import { listOrders } from "@/lib/orders";
import { OrderForm } from "./order-form";

export default async function OrdersPage() {
  await connection();
  const orders = await listOrders().catch((error: unknown) => {
    console.error(error);
    return null;
  });

  return (
    <main>
      <h1>Заказы</h1>
      <h2>Новый заказ</h2>
      <OrderForm />
      <h2>Список заказов</h2>
      {orders === null && (
        <p role="alert">Не удалось загрузить заказы. Проверьте подключение к базе данных.</p>
      )}
      {orders?.length === 0 && <p>Заказов пока нет.</p>}
      {orders && orders.length > 0 && (
        <ul>
          {orders.map(({ id, status, createdAt }) => (
            <li key={id}>
              <h3>Заказ №{id}</h3>
              <p>Создан: <time dateTime={createdAt.toISOString()}>{createdAt.toLocaleString("ru-RU")}</time></p>
              <p>Текущий статус: <strong>{status}</strong></p>
              <OrderForm orderId={id} status={status} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
