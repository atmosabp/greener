import { TriangleAlert, CircleAlert } from "lucide-react";
export type WarningVariant = "logout" | "alter" | "delete";

export const variants = {
  logout: {
    Icon: CircleAlert,
    tone: "danger",
    title: "Sair da conta?",
    message: "Tem certeza que deseja sair da sua conta?",
    confirm: "Sair",
  },
//   alter: {
//     Icon: TriangleAlert,
//     tone: "attention",
//     title: "Alterar usuário",
//     message: "Tem certeza que deseja alterar dados do usuário?", -> ATUALMENTE DESABILITADO
//     confirm: "Alterar",
//   },
  delete: {
    Icon: TriangleAlert,
    tone: "danger",
    title: "Deletar usuário",
    message: "Tem certeza que deseja deletar usuário(s)?",
    confirm: "Deletar",
  },
} as const;

export interface WarningProps {
  variant?: WarningVariant;
  onConfirm?: () => void;
  onCancel?: () => void;
}
