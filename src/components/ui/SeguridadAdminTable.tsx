// components/ui/SeguridadAdminTable.tsx
"use client";

import * as React from "react";
import { PencilSquareIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export type SeguridadRow = {
  codigo: string | number;
  nombre: string;
  turno: string;   // ej. "Diurno", "Nocturno"
  estado: string;  // ej. "Activo", "Inactivo"
};

type Props = {
  data?: SeguridadRow[];
  className?: string;
  onEdit?: (row: SeguridadRow) => void;
  onChangeStatus?: (row: SeguridadRow) => void;
  emptyMessage?: string;
};

export default function SeguridadAdminTable({
  data = [],
  className,
  onEdit,
  onChangeStatus,
  emptyMessage = "¡Busca registros de seguridad!",
}: Props) {
  const hasData = data.length > 0;

  // --- Render helpers ---
  const renderHeader = () => (
    <thead className="bg-[var(--color-brand)] text-white">
      <tr className="text-sm">
        <th scope="col" className="px-4 py-3 font-semibold text-center">Código</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">Nombre</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">Turno</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">Estado</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">Acciones</th>
      </tr>
    </thead>
  );

  const renderEmpty = () => (
    <tbody>
      <tr>
        <td colSpan={5} className="px-4 py-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-600">
            {emptyMessage}
          </div>
        </td>
      </tr>
    </tbody>
  );

  const renderCell = (content: React.ReactNode) => (
    <td className="px-4 py-3 align-middle text-sm text-neutral-800 text-center">
      {content}
    </td>
  );

  const renderRows = () => (
    <tbody className="divide-y divide-neutral-200">
      {data.map((row) => (
        <tr key={`${row.codigo}-${row.nombre}`} className="bg-white hover:bg-neutral-50">
          {renderCell(row.codigo)}
          {renderCell(row.nombre)}
          {renderCell(row.turno)}
          {renderCell(row.estado)}
          <td className="px-4 py-3 align-middle text-center">
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                leftIcon={<PencilSquareIcon className="h-5 w-5" aria-hidden="true" />}
                aria-label={`Modificar ${row.nombre} (${row.codigo})`}
                onClick={() => onEdit?.(row)}
              >
                Modificar
              </Button>
              <Button
                size="sm"
                leftIcon={<ArrowsRightLeftIcon className="h-5 w-5" aria-hidden="true" />}
                aria-label={`Cambiar estado de ${row.nombre} (${row.codigo})`}
                onClick={() => onChangeStatus?.(row)}
              >
                Cambiar estado
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  // --- Render raíz ---
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm",
        className
      )}
    >
      <table className="w-full border-collapse">
        {renderHeader()}
        {hasData ? renderRows() : renderEmpty()}
      </table>
    </div>
  );
}
