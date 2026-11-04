export type ToastIcon = "success" | "error";

export interface ToastProps {
  icon: ToastIcon;
  title: string;
  message?: string;
  onClose?: () => void;
}