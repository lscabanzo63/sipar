import { ReactNode, useState, useEffect, useCallback } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface SelectFieldLineProps {
  label: string;
  name: string;
  value: string;
  options: { label: string; value: string }[];
  icon?: ReactNode;
  readOnly?: boolean;               // si true => disabled visual
  onChange?: (val: string) => void;
  required?: boolean;
  errorMessage?: string;
  pattern?: RegExp;
  validateOnBlur?: boolean;
  placeholder?: string;             // placeholder visible como opción oculta
}

export default function SelectFieldLine({
  label,
  name,
  value,
  options,
  icon,
  readOnly = false,
  onChange,
  required = false,
  errorMessage,
  pattern,
  validateOnBlur = false,
  placeholder,
}: SelectFieldLineProps) {
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (val: string) => {
      if (required && val.trim() === "") {
        setError("Este campo es obligatorio");
      } else if (pattern && !pattern.test(val)) {
        setError(errorMessage ?? "Selección inválida");
      } else {
        setError(null);
      }
    },
    [required, pattern, errorMessage]
  );

  const handleChange = (val: string) => {
    onChange?.(val);
    if (!validateOnBlur) validate(val);
  };

  const handleBlur = () => {
    if (validateOnBlur) validate(value);
  };

  useEffect(() => {
    if (validateOnBlur) validate(value);
  }, [validateOnBlur, value, validate]);

  return (
    <div className="space-y-1 w-full">
      <label
        htmlFor={name}
        className="block text-sm text-[var(--color-brand-600)] font-medium"
      >
        {label}
      </label>

      <div
        className={[
          "relative flex items-center gap-2 border-b py-2 transition-colors group",
          error
            ? "border-red-500"
            : "border-[var(--color-brand-600)] hover:border-[var(--color-brand)] focus-within:border-[var(--color-brand)]",
          readOnly && "opacity-60 cursor-not-allowed",
        ].join(" ")}
      >
        {icon && (
          <span
            className={[
              "shrink-0 transition-colors",
              error
                ? "text-red-500"
                : "text-[var(--color-brand-600)] group-hover:text-[var(--color-brand)] group-focus-within:text-[var(--color-brand)]",
            ].join(" ")}
          >
            {icon}
          </span>
        )}

        {/* Select estilizado */}
        <select
          id={name}
          name={name}
          value={value}
          disabled={readOnly}
          required={required}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={[
            "peer w-full bg-transparent outline-none",
            "text-neutral-900 placeholder-neutral-400",
            "appearance-none",               // oculta flecha nativa
            "pr-8",                           // espacio para la chevron custom
            "py-1",                           // un poco de aire
            "cursor-pointer",                 // UX
          ].join(" ")}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron custom */}
        <ChevronDownIcon
          className={[
            "pointer-events-none absolute right-0 top-1/2 -translate-y-1/2",
            "h-5 w-5",
            error
              ? "text-red-500"
              : "text-[var(--color-brand-600)] peer-focus:text-[var(--color-brand)] group-hover:text-[var(--color-brand)]",
          ].join(" ")}
          aria-hidden
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
