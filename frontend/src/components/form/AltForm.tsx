import Form from "./Form";
import { compose, email, matches, minLength, optional, required } from "./Validators";
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
    // Opcional: só valida se a pessoa quiser trocar a senha
    name: "password",
    label: "Nova senha",
    type: "password",
    placeholder: "Deixe vazio para manter a atual...",
    required: false,
    validate: optional(minLength(6)),
  },
  {
    name: "confirmPassword",
    label: "Confirmar nova senha",
    type: "password",
    placeholder: "Repita a nova senha...",
    required: false,
    validate: (v, values) =>
      values.password
        ? matches("password", "As senhas não coincidem*")(v, values)
        : undefined,
  },
];

type AltFormProps = {
  user: { name: string; email: string }; // dados atuais do usuário
  onSave?: (values: FormValues) => void;
  onClose?: () => void;
};

export default function AltForm({ user, onSave, onClose }: AltFormProps) {
  return (
    <Form
      title="Alterar dados"
      fields={fields}
      submitLabel="Salvar"
      onClose={onClose}
      initialValues={{ name: user.name, email: user.email }}
      onSubmit={(values) => {
        // Depois enviar values parao back, banco etc
        onSave?.(values);
      }}
    />
  );
}