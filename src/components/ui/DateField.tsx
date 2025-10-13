"use client";

import * as React from "react";
import { cn } from "../../lib/utils/cn";

export type DateFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "size"
> & {
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
  value?: string;                   // YYYY-MM-DD
  onChange?: (value: string) => void;

  /** Si true, usa la fecha de hoy (local) como 'min' por defecto.
   *  Si además pasas 'min' manualmente, tiene prioridad tu 'min'.
   */
  minToday?: boolean;
};

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M7 3v2M17 3v2M3 9h18M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** YYYY-MM-DD local (para min/max en <input type="date" />) */
function todayISOLocal(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
  (
    {
      id,
      name,
      label = "Fecha",
      required,
      value,
      onChange,
      helperText,
      error,
      className,
      minToday = false,
      ...rest // disabled, min, max, etc.
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const describedById = React.useId();
    const uid = React.useId();
    const controlId = id ?? uid;

    const hasError = Boolean(error);
    const isDisabled = Boolean(rest.disabled);

    // Si no viene 'min' y el consumidor pide minToday, usamos hoy local
    const computedMin = rest.min ?? (minToday ? todayISOLocal() : undefined);

    return (
      <div className={cn("w-full", className)}>
        {/* Label */}
        <label
          htmlFor={controlId}
          className="mb-1 block text-sm font-medium text-neutral-900"
        >
          {label} {required ? <span className="text-red-500">*</span> : null}
        </label>

        {/* Container */}
        <div
          className={cn(
            "relative flex h-11 w-full items-center rounded-lg border bg-white px-3 transition-colors",
            isDisabled && "bg-neutral-100 text-neutral-400 cursor-not-allowed",
            hasError
              ? "border-red-500 focus-within:border-red-600"
              : "border-neutral-300 hover:border-violet-300 focus-within:border-violet-700"
          )}
          onClick={() => {
            if (!isDisabled) internalRef.current?.showPicker?.();
          }}
        >
          {/* Icono */}
          <CalendarIcon
            className={cn(
              "mr-2 h-5 w-5 shrink-0",
              isDisabled ? "text-neutral-400" : hasError ? "text-red-500" : "text-neutral-500"
            )}
          />

          {/* Input date */}
          <input
            ref={internalRef}
            id={controlId}
            name={name}
            type="date"
            value={value ?? ""}
            aria-invalid={hasError || undefined}
            aria-describedby={describedById}
            onChange={(e) => onChange?.(e.target.value)}
            min={computedMin}
            // max: si el consumidor pasa 'max' en rest, React lo aplica igual
            className={cn(
              "peer h-full w-full border-0 bg-transparent p-0 text-sm text-neutral-900 focus:outline-none focus:ring-0",
              // Oculta el ícono nativo de WebKit y deja el nuestro
              "[&::-webkit-calendar-picker-indicator]:opacity-0",
              isDisabled && "cursor-not-allowed"
            )}
            {...rest}
          />
        </div>

        {/* Helper / Error */}
        {(helperText || error) && (
          <p
            id={describedById}
            className={cn("mt-1 text-xs", hasError ? "text-red-600" : "text-neutral-500")}
          >
            {hasError ? error : helperText}
          </p>
        )}
      </div>
    );
  }
);

DateField.displayName = "DateField";
