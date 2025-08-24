import * as React from "react";
import clsx from "clsx";

export type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  id?: string;
};

export const TextField: React.FC<TextFieldProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  id,
  className,
  ...props
}) => {
  // ✅ useId llamado SIEMPRE al inicio
  const autoId = React.useId();
  const inputId = id ?? autoId;

  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;

  // ✅ ids para accesibilidad
  const describedBy = clsx(
    helperText && helpId,
    error && errorId
  );

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
      )}

      {/* Contenedor del input */}
      <div className="relative">
        {/* Icono izquierdo */}
        {leftIcon && (
          <span
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400"
            aria-hidden
          >
            {leftIcon}
          </span>
        )}

        {/* Input */}
        <input
          id={inputId}
          className={clsx(
            "w-full rounded-[var(--radius-ctrl)] border bg-white px-4 py-3 outline-none placeholder:text-neutral-400 transition-shadow",
            "focus:border-transparent focus:ring-2",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-neutral-300 focus:ring-brand",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy || undefined}
          {...props}
        />

        {/* Icono derecho */}
        {rightIcon && (
          <span
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400"
            aria-hidden
          >
            {rightIcon}
          </span>
        )}
      </div>

      {/* Texto auxiliar */}
      {helperText && !error && (
        <p id={helpId} className="mt-1 text-sm text-neutral-500">
          {helperText}
        </p>
      )}

      {/* Texto de error */}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
