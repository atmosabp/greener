import { X } from "lucide-react";
import "./Warning.css";
import { type WarningProps, variants } from "../../types/warning";
import { useState } from "react";

export default function Warning({
  variant = "logout",
  onConfirm,
  onCancel,
}: WarningProps) {
  const [open, setOpen] = useState(true);
  const { Icon, tone, title, message, confirm } =
    variants[variant as keyof typeof variants] ?? variants.logout; // solução achada para o typescript não reclamar

  const handleCancel = () => {
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="warning" onClick={handleCancel}>
      <div className={`warning-modal warning-${tone}`}>
        <button type="button" className="warning-close" onClick={handleCancel}>
          <X size={32} strokeWidth={3} />
        </button>

        <Icon
          className="warning-icon"
          size={88}
          strokeWidth={2}
          aria-hidden="true"
        />

        <h2 id="warning-title" className="warning-title">
          {title}
        </h2>
        <p id="warning-message" className="warning-message">
          {message}
        </p>

        <div className="warning-actions">
          <button
            type="button"
            className="warning-btn warning-btn-cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="warning-btn warning-btn-confirm"
            onClick={onConfirm}
          >
            {confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
