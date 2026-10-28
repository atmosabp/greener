import type { ToastProps } from "../../types/toast";
import { X, Check } from "lucide-react";
import "./Toast.css";

export default function Toast({ icon, title, message, onClose }: ToastProps) {
  return (
    <div
      className={`toast toast--${icon}`}
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
        onClick={onClose}
      >
        <X size={20} />
      </button>

      <div className="toast-progress" />
    </div>
  );
}
