import { Eye, EyeClosed, X } from "lucide-react";
import "./Form.css";
import { useEffect, useState, type FormEvent } from "react";
import type { FormErrors, FormProps, FormValues } from "../../types/form";

export default function Form({
  title,
  fields,
  submitLabel,
  onSubmit,
  initialValues = {},
  onClose,
  children,
}: FormProps) {
  // Começa com "" em todos os campos, sobrescrevendo com initialValues
  const [values, setValues] = useState<FormValues>(() =>
    Object.fromEntries(fields.map((f) => [f.name, initialValues[f.name] ?? ""])),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  // Qual campo de senha está com o olho pressionado
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const setVisibility = (name: string, value: boolean) =>
    setVisible((p) => ({ ...p, [name]: value }));

  // Fecha o modal com a tecla Esc
  useEffect(() => {
    if (!onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (name: string, value: string) => {
    setValues((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleBlur = (name: string) => {
    const field = fields.find((f) => f.name === name);
    setErrors((p) => ({
      ...p,
      [name]: field?.validate?.(values[name], values),
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    for (const f of fields) {
      newErrors[f.name] = f.validate?.(values[f.name], values);
    }
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    onSubmit(values);
  };

  return (
    <div
      className="form"
      // mousedown (e não click) evita fechar ao selecionar texto e soltar fora
      // target === currentTarget: só fecha se clicou no fundo, não dentro do form
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <form
        className="form-login"
        onSubmit={handleSubmit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {onClose && (
          <button
            type="button"
            className="btn-close"
            aria-label="Fechar"
            onClick={onClose}
          >
            <X className="close" size={28} />
          </button>
        )}
        <h4>{title}</h4>

        {fields.map((f) => {
          const error = errors[f.name];
          const isPassword = f.type === "password";
          const isRequired = f.required ?? true;
          const showStar = isRequired && !error;

          const input = (
            <input
              type={isPassword && visible[f.name] ? "text" : (f.type ?? "text")}
              id={f.name}
              placeholder={f.placeholder}
              value={values[f.name]}
              onChange={(e) => handleChange(f.name, e.target.value)}
              onBlur={() => handleBlur(f.name)}
              className={error ? "input-error" : ""}
              aria-invalid={!!error}
              aria-describedby={error ? `${f.name}-error` : undefined}
            />
          );

          return (
            <div className="form-field" key={f.name}>
              <div className="label-row">
                <label htmlFor={f.name} title={isRequired ? "Campo obrigatório" : undefined}>
                  {f.label}
                  {showStar && "*"}
                </label>
                {error && (
                  <span id={`${f.name}-error`} className="error-msg">
                    {error}
                  </span>
                )}
              </div>

              {isPassword ? (
                <div className="password-input">
                  {input}
                  <button
                    type="button"
                    className="btn-eye"
                    aria-label="Segure para mostrar a senha"
                    onMouseDown={() => setVisibility(f.name, true)}
                    onMouseUp={() => setVisibility(f.name, false)}
                    onMouseLeave={() => setVisibility(f.name, false)}
                    onTouchStart={() => setVisibility(f.name, true)}
                    onTouchEnd={() => setVisibility(f.name, false)}
                  >
                    {visible[f.name] ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
              ) : (
                input
              )}
            </div>
          );
        })}

        {children}

        <div className="form-link">
          <button type="submit" className="btn-login">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}