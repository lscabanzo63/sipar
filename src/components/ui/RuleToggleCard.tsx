"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export type RuleToggleCardProps = {
  id?: string;
  mainText: string;
  enabled?: boolean;
  defaultEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  onOpenModal?: () => void;
  actionLabel?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  domEventKey?: string;
};

export default function RuleToggleCard({
  id,
  mainText,
  enabled,
  defaultEnabled = false,
  onToggle,
  onOpenModal,
  actionLabel = "Configurar",
  helperText,
  disabled,
  className,
  domEventKey,
}: RuleToggleCardProps) {
  const isControlled = typeof enabled === "boolean";
  const [internal, setInternal] = React.useState(defaultEnabled);
  const isOn = isControlled ? (enabled as boolean) : internal;

  React.useEffect(() => {
    if (isControlled) setInternal(enabled as boolean);
  }, [enabled, isControlled]);

  const autoId = React.useId();
  const switchId = id ?? autoId;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onToggle?.(next);
  };

  const handleOpen = () => {
    if (disabled) return;
    onOpenModal?.();
    if (domEventKey) {
      const ev = new CustomEvent(domEventKey, {
        detail: { id: switchId, enabled: isOn, mainText },
      });
      window.dispatchEvent(ev);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-2xl border bg-white p-4",
        "transition-all duration-200 ease-out shadow-sm",
        // 🔹 Estilos “brand”
        isOn
          ? "border-[var(--color-brand)] shadow-[0_0_0_3px_rgba(85,35,115,0.08)]"
          : "border-neutral-200 hover:shadow-[0_0_0_2px_rgba(85,35,115,0.15)]",
        disabled && "opacity-70",
        className
      )}
    >
      {/* Texto principal */}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-neutral-800">{mainText}</p>
        {helperText && (
          <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
        )}
      </div>

      {/* Switch + botón */}
      <div className="flex w-[140px] shrink-0 flex-col items-end gap-2">
        {/* Switch accesible */}
        <button
          id={switchId}
          type="button"
          role="switch"
          aria-checked={isOn}
          aria-label={isOn ? "Regla activada" : "Regla desactivada"}
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            "relative inline-flex h-7 w-12 items-center rounded-full border transition-colors",
            isOn
              ? "bg-[var(--color-brand)] border-[var(--color-brand)]"
              : "bg-neutral-200 border-neutral-300 hover:border-[var(--color-brand)]",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
              isOn ? "translate-x-5" : "translate-x-1"
            )}
          />
        </button>

        {/* Botón acción */}
        <Button

          size="sm"
          onClick={handleOpen}
          disabled={disabled}
          fullWidth
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
