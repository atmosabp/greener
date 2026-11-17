import { createContext } from "react";
import type { ToastIcon } from "../types/toast";

export type ShowToast = (
  icon: ToastIcon,
  title: string,
  message?: string,
) => void;

export const ToastContext = createContext<{ showToast: ShowToast } | null>(
  null,
);
