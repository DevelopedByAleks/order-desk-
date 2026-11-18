import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { DialogProvider } from "@/shared/providers/dialog-provider";

export const metadata: Metadata = {
  title: "Order Desk",
  description: "Создание заказов и управление их статусами",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className="scheme-light-dark font-sans text-base/6">
      <body>
        <DialogProvider>
          {children}
        </DialogProvider>
      </body>
    </html>
  );
}
