import type { ReactNode } from "react";

export type FormValues = Record<string, string>;
export type FormErrors = Record<string, string | undefined>;

// Recebe o valor do campo e todos os valores (útil p/ "confirmar senha")
export type Validator = (
  value: string,
  values: FormValues,
) => string | undefined;

export type FieldConfig = {
  name: string; // chave usada em values/errors
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  validate?: Validator;
  required?: boolean; // controla o "*" no label (padrão: true)
};

export type FormProps = {
  title: string;
  fields: FieldConfig[];
  submitLabel: string;
  onSubmit: (values: FormValues) => void | Promise<void>;
  initialValues?: FormValues;
  onClose?: () => void;
  children?: ReactNode;
  isSubmitting?: boolean;
};