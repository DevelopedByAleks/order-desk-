
"use client";

import { OrderForm } from "@/features/orders/components/order-form";
import { useDialog } from "@/shared/providers/Modal/modal.provider";


export default function OrdersNavigation () {
    const { openDialog } = useDialog();

    return (
        <>
            <button type="button" onClick={() => openDialog(<OrderForm key="create" mode="create" />)}>
                    Создать заказ
            </button>
        </>
    )
}
