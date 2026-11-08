import type { ToastProps } from "../../types/toast";
import { X, Check } from "lucide-react";
import "./Toast.css";
import { useEffect, useState } from "react";

export default function Toast({ icon, title, message, onClose }: ToastProps) {
  const [open, setOpen] = useState(true);

  // fecha sozinho quando a barra de progresso acaba (5s, igual ao Toast.css)
  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // espera a animação de saída (1s) terminar antes de avisar quem abriu o toast
  useEffect(() => {
    if (open || !onClose) return;
    const timer = setTimeout(onClose, 1000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div
      className={`toast toast--${icon} ${!open ? "close" : ""}`}
      role={icon === "error" ? "alert" : "status"}
    >
      <div className={`toast-icon toast-icon--${icon}`}>
        {icon === "success" ? (
          <Check size={20} strokeWidth={3} />
        ) : (
          <X size={20} strokeWidth={3} />
        )}
      </div>

      <div className="toast-content">
        <div className="toast-title">{title}</div>
        {message && <div className="toast-message">{message}</div>}
      </div>

      <button
        type="button"
        className="toast-close"
        aria-label="Fechar"
        onClick={handleCancel}
      >
        <X size={20} />
      </button>

      <div className="toast-progress" />
    </div>
  );
}
