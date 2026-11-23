import type { ReactNode } from "react";

export type FormValues = Record<string, string>;

// Erro com título próprio para o toast (ex.: "Senhas diferentes")
export type FieldError = { title: string; message: string };
export type ValidationResult = string | FieldError | undefined;

export type FormErrors = Record<string, ValidationResult>;

// Recebe o valor do campo e todos os valores (útil p/ "confirmar senha")
export type Validator = (
  value: string,
  values: FormValues,
) => ValidationResult;

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