import type { FieldError, Validator } from "../../types/form";

// valida os campos -> tirei dos loginform la de cima, e agora aqui

export const required: Validator = (v) =>
    v.trim() ? undefined : "Este campo é obrigatório";

export const email: Validator = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : "Digite um e-mail válido";

export const minLength =
    (n: number): Validator =>
        (v) =>
            v.length < n ? `Mínimo de ${n} caracteres` : undefined;

export const matches =
    (otherField: string, error: FieldError): Validator =>
        (v, values) =>
            v === values[otherField] ? undefined : error;

// Roda os validadores em ordem e retorna o primeiro erro
export const compose =
    (...validators: Validator[]): Validator =>
        (v, values) => {
            for (const validate of validators) {
                const error = validate(v, values);
                if (error) return error;
            }
            return undefined;
        };

// Só valida se o campo foi preenchido (campos opcionais)
export const optional =
    (validator: Validator): Validator =>
        (v, values) =>
            v ? validator(v, values) : undefined;

// Converte qualquer erro para { title, message } (usado pelo Form no toast)
export const toToast = (e: string | FieldError): FieldError =>
    typeof e === "string" ? { title: "Dados inválidos", message: e } : e;
