export class OrderNotFoundError extends Error {
  constructor() {
    super("Заказ не найден");
    this.name = "OrderNotFoundError";
  }
}

export class InvalidOrderStatusError extends Error {
  constructor() {
    super("Недопустимый переход статуса");
    this.name = "InvalidOrderStatusError";
  }
}