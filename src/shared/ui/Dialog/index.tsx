"use client";
import { useEffect, useRef, type ReactNode } from "react";

type DialogProps = {
  children: ReactNode
  isActive: boolean
  onClose: () => void
};

export default function Dialog({ children, isActive, onClose }: DialogProps) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isActive) return;
    closeButton.current?.focus();
  }, [isActive]);

  return (
    <div
      className={`fixed inset-0 z-10 bg-black/40 backdrop-blur-2xl ${isActive ? "flex" : "hidden"} items-center justify-center`}
      role="dialog"
      aria-modal="true"
      aria-label="Заказ"
      onKeyDown={event => {
        if (event.key === "Escape") onClose();
      }}
    >
      <div className="box-border flex h-1/2 w-1/2 flex-col items-center overflow-auto bg-white p-6 text-neutral-900 scheme-light relative">
        <button ref={closeButton} type="button" onClick={onClose} className="absolute right-2 top-2">Закрыть</button>
        {children}
      </div>
    </div>
  );
}
