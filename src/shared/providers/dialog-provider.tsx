"use client";

import Dialog from "@/shared/ui/dialog";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type DialogContextType = {
  openDialog: (content: ReactNode) => void
  closeDialog: () => void
};

const DialogContext = createContext<DialogContextType | null>(null);

export function DialogProvider({
  children,
}: {
  children: ReactNode
}) {
  const [content, setContent] = useState<ReactNode | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const openDialog = (content: ReactNode) => {
    if (document.activeElement instanceof HTMLElement) opener.current = document.activeElement;
    setContent(content);
  };

  const closeDialog = () => {
    setContent(null);
  };

  useEffect(() => {
    if (content === null && opener.current) {
      opener.current.focus();
      opener.current = null;
    }
  }, [content]);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      <div inert={content !== null}>{children}</div>

      <Dialog isActive={content !== null} onClose={closeDialog}>
        {content}
      </Dialog>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used inside DialogProvider");
  }

  return context;
}
