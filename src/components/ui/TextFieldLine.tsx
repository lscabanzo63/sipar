import { ReactNode, useState, useEffect } from "react";

interface TextFieldLineProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  icon?: ReactNode;
  readOnly?: boolean;
  onChange?: (val: string) => void;
  placeholder?: string;
  pattern?: RegExp;
  allowedPattern?: RegExp; // restringe entrada
  errorMessage?: string;
  required?: boolean;
  validateOnBlur?: boolean; // <-- NUEVO
}

export default function TextFieldLine({
  label,
  name,
  type = "text",
  value,
  icon,
  readOnly = false,
  onChange,
  placeholder,
  pattern,
  allowedPattern,
  errorMessage,
  required = false,
  validateOnBlur = false,
}: TextFieldLineProps) {
  const [error, setError] = useState<string | null>(null);

  const validate = (val: string) => {
    if (pattern && !pattern.test(val)) {
      setError(errorMessage ?? "Formato inválido");
    } else if (required && val.trim() === "") {
      setError("Este campo es obligatorio");
    } else {
      setError(null);
    }
  };

  const handleChange = (val: string) => {
    if (allowedPattern && val !== "" && !allowedPattern.test(val)) {
      return; // bloquea caracteres no permitidos
    }
    onChange?.(val);

    // validación solo si validateOnBlur = false (en vivo)
    if (!validateOnBlur) {
      validate(val);
    }
  };

  const handleBlur = () => {
    if (validateOnBlur) {
      validate(String(value));
    }
  };

  // Validar inmediatamente al montar si está activado
  useEffect(() => {
    if (validateOnBlur) {
      validate(String(value));
    }
  }, [validateOnBlur]);

  return (
    <div className="space-y-1 w-full">
      <label
        htmlFor={name}
        className="block text-sm text-[var(--color-brand-600)] font-medium"
      >
        {label}
      </label>

      <div
        className={`
          flex items-center gap-2 border-b py-2 transition-colors group
          ${error
            ? "border-red-500"
            : "border-[var(--color-brand-600)] hover:border-[var(--color-brand)] focus-within:border-[var(--color-brand)]"}
        `}
      >
        {icon && (
          <span
            className={`
              transition-colors
              ${error
                ? "text-red-500"
                : "text-[var(--color-brand-600)] group-hover:text-[var(--color-brand)] group-focus-within:text-[var(--color-brand)]"}
            `}
          >
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          required={required}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-transparent outline-none text-neutral-900 placeholder-neutral-400"
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
