import { useCallback, useMemo, useState, type ReactNode } from "react";
import Toast from "../components/toast/Toast";
import { ToastContext, type ShowToast } from "../contexts/ToastContext";
import type { ToastIcon } from "../types/toast";

type ToastState = {
  id: number;
  icon: ToastIcon;
  title: string;
  message?: string;
};

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast: ShowToast = useCallback(
    (icon, title, message) =>
      setToast({ id: Date.now(), icon, title, message }),
    [],
  );

  // Evita que o Toast reinicie o timer a cada render.
  const closeToast = useCallback(() => setToast(null), []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Toast
          key={toast.id} // novo id = timer reinicia
          icon={toast.icon}
          title={toast.title}
          message={toast.message}
          onClose={closeToast}
        />
      )}
    </ToastContext.Provider>
  );
}
