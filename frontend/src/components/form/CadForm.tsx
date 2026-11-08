import Form from "./Form";
import { compose, email, matches, minLength, required } from "./Validators";
import type { FieldConfig, FormValues } from "../../types/form";

const fields: FieldConfig[] = [
  {
    name: "name",
    label: "Nome",
    placeholder: "Digite seu nome...",
    validate: required,
  },
  {
    name: "email",
    label: "E-mail",
    type: "email",
    placeholder: "Digite seu e-mail...",
    validate: compose(required, email),
  },
  {
    name: "password",
    label: "Senha",
    type: "password",
    placeholder: "Digite sua senha...",
    validate: compose(required, minLength(6)),
  },
  {
    name: "confirmPassword",
    label: "Confirmar senha",
    type: "password",
    placeholder: "Repita sua senha...",
    validate: compose(required, matches("password", "As senhas não coincidem*")),
  },
];

type CadFormProps = {
  onSave?: (values: FormValues) => void; // quem usa o form envia para o back
  onClose?: () => void;
};

export default function CadForm({ onSave, onClose }: CadFormProps) {
  return (
    <Form
      title="Cadastrar usuário"
      fields={fields}
      submitLabel="Cadastrar"
      onClose={onClose}
      onSubmit={(values) => {
        onSave?.(values);
      }}
    />
  );
}