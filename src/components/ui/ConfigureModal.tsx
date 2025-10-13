"use client";

import * as React from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";

type ConfigureModalProps = {
  open: boolean;
  title: string;
  description: string;      // texto pedagógico (puede contener \n)
  nValue: number | null;
  nOptions: number[];       // opciones válidas según periodicidad
  onChangeN: (n: number | null) => void;
  onClose: () => void;
  onSave: () => void;
  disabled?: boolean;       // deshabilita acciones si no hay periodicidad
  className?: string;
};

export const ConfigureModal: React.FC<ConfigureModalProps> = ({
  open,
  title,
  description,
  nValue,
  nOptions,
  onChangeN,
  onClose,
  onSave,
  disabled,
  className,
}) => {
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const hasOptions = nOptions.length > 0;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Dialog */}
      <div
        className={clsx(
          "relative z-10 mx-auto mt-24 w-full max-w-md rounded-2xl bg-white p-5 shadow-lg",
          className
        )}
      >
        <h3 id={titleId} className="text-lg font-semibold text-neutral-900">
          {title}
        </h3>

        {/* Permite saltos de línea con \n */}
        <p
          id={descId}
          className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-700"
        >
          {description}
        </p>

        {/* Select N */}
        <div className="mt-4">
          <label htmlFor="select-n" className="block text-sm font-medium text-neutral-800">
            Rotación (N)
          </label>
          <select
            id="select-n"
            className="mt-1 w-full rounded-[var(--radius-ctrl)] border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            value={nValue ?? ""}                 // <- siempre placeholder si no hay elección
            onChange={(e) => {
              const v = e.target.value === "" ? null : Number(e.target.value);
              onChangeN(v);
            }}
            disabled={!hasOptions || disabled}
          >
            <option value="">Selecciona un valor</option>
            {nOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {!hasOptions && (
            <p className="mt-2 text-xs text-amber-600">
              Selecciona primero una periodicidad (trimestral, cuatrimestral o semestral) para habilitar los valores de N.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={disabled || !nValue}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};
