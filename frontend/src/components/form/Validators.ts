import type { Validator } from "../../types/form";

// valida os campos -> tirei dos loginform la de cima, e agora aqui

export const required: Validator = (v) =>
    v.trim() ? undefined : "Este campo é obrigatório*";

export const email: Validator = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : "Digite um e-mail válido*";

export const minLength =
    (n: number): Validator =>
        (v) =>
            v.length < n ? `Mínimo de ${n} caracteres*` : undefined;

export const matches =
    (otherField: string, message: string): Validator =>
        (v, values) =>
            v === values[otherField] ? undefined : message;

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