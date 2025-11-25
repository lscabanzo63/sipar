"use client";

type StatusBadgeProps = {
  active: boolean;
};

export default function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
          : "bg-neutral-100 text-neutral-600 border border-neutral-200"
      }`}
    >
      {active ? "Activo" : "Bloqueado"}
    </span>
  );
}
