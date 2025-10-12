"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type SpinnerVariant = "inline" | "overlay";
type Opacity = 40 | 50 | 60 | 70 | 80 | 90;

type SpinnerProps = {
  /** inline | overlay (pantalla completa) */
  variant?: SpinnerVariant;
  /** Mostrar/ocultar (solo aplica en overlay) */
  open?: boolean;
  /** sm | md | lg */
  size?: "sm" | "md" | "lg";
  /** Color del aro */
  color?: string;
  /** Texto opcional debajo del spinner */
  text?: string;
  /** Opacidad del backdrop (overlay) */
  backdropOpacity?: Opacity;
  /** Desenfoque del fondo (overlay) */
  blur?: boolean;
  /** Clases extra */
  className?: string;          // contenedor inline o card overlay
  backdropClassName?: string;  // overlay
};

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-4",
  lg: "h-12 w-12 border-[6px]",
} as const;

const opacityClass = (n?: Opacity) =>
  ({
    40: "bg-black/40",
    50: "bg-black/50",
    60: "bg-black/60",
    70: "bg-black/70",
    80: "bg-black/80",
    90: "bg-black/90",
  }[n ?? 40]);

export const Spinner: React.FC<SpinnerProps> = ({
  variant = "inline",
  open = true,
  size = "md",
  color = "var(--color-brand)",
  text,
  backdropOpacity = 40,
  blur = false,
  className,
  backdropClassName,
}) => {
  // Bloquear scroll cuando el overlay está abierto
  useEffect(() => {
    if (variant !== "overlay" || !open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [variant, open]);

  // UI del aro
  const Ring = (
    <div
      className={clsx(
        "animate-spin rounded-full border-t-transparent",
        sizeMap[size]
      )}
      style={{ borderColor: color, borderTopColor: "transparent" }}
      aria-hidden
    />
  );

  // Variante inline
  if (variant === "inline") {
    return (
      <div className={clsx("inline-flex flex-col items-center gap-3", className)}>
        {Ring}
        {text ? <p className="text-sm text-neutral-700">{text}</p> : null}
      </div>
    );
  }

  // Variante overlay
  if (!open) return null;

  return createPortal(
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center",
        opacityClass(backdropOpacity),
        blur && "backdrop-blur-sm",
        backdropClassName
      )}
      role="alertdialog"
      aria-live="assertive"
      aria-busy="true"
      aria-modal="true"
    >
      <div
        className={clsx(
          "bg-white rounded-xl shadow-md px-6 py-4 flex flex-col items-center gap-3",
          className
        )}
      >
        <span className="sr-only">Cargando…</span>
        {Ring}
        {text ? <p className="text-sm text-neutral-800 text-center">{text}</p> : null}
      </div>
    </div>,
    document.body
  );
};

export default Spinner;
