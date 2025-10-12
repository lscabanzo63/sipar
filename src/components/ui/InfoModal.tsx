"use client";

import * as React from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";

type InfoModalProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  className?: string;
};

export const InfoModal: React.FC<InfoModalProps> = ({
  open,
  title,
  description,
  onClose,
  className,
}) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
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

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* Dialog */}
      <div
        ref={dialogRef}
        className={clsx(
          "relative z-10 mx-auto mt-24 w-full max-w-md rounded-2xl bg-white p-5 shadow-lg",
          className
        )}
      >
        <div className="mb-4">
          <h3 id={titleId} className="text-lg font-semibold text-neutral-900">
            {title}
          </h3>
          <p id={descId} className="mt-1 text-sm text-neutral-700">
            {description}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Entendido</Button>
        </div>
      </div>
    </div>
  );
};
