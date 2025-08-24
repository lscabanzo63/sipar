// components/ui/ResidentesTable.tsx
"use client";

import * as React from "react";
import { PencilSquareIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export type ResidenteRow = {
  numeroApartamento: string | number;
  nombreResidente: string;
  tipoResidente: string;       // p.ej. "Propietario" | "Arrendatario"
  estadoParqueadero: string;   // p.ej. "Activo" | "Inactivo"
};

type Props = {
  data?: ResidenteRow[];
  className?: string;
  onEdit?: (row: ResidenteRow) => void;
  onChangeStatus?: (row: ResidenteRow) => void;
  emptyMessage?: string;
};

export default function ResidentesTable({
  data = [],
  className,
  onEdit,
  onChangeStatus,
  emptyMessage = "¡Busca residentes!",
}: Props) {
  const hasData = data.length > 0;

  // ---- Render helpers ----
  const renderHeader = () => (
    <thead className="text-white bg-[var(--color-brand)]">
      <tr className="text-sm">
        <th scope="col" className="px-4 py-3 font-semibold text-center">N.º de Apartamento</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">Nombre del Residente</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">Tipo Residente</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">Estado Parqueadero</th>
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
        <tr key={`${row.numeroApartamento}-${row.nombreResidente}`} className="bg-white hover:bg-neutral-50">
          {renderCell(row.numeroApartamento)}
          {renderCell(row.nombreResidente)}
          {renderCell(row.tipoResidente)}
          {renderCell(row.estadoParqueadero)}
          <td className="px-4 py-3 align-middle text-center">
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                leftIcon={<PencilSquareIcon className="h-5 w-5" aria-hidden="true" />}
                aria-label={`Modificar residente apto ${row.numeroApartamento}`}
                onClick={() => onEdit?.(row)}
              >
                Modificar
              </Button>
              <Button
                size="sm"
                leftIcon={<ArrowsRightLeftIcon className="h-5 w-5" aria-hidden="true" />}
                aria-label={`Cambiar estado parqueadero apto ${row.numeroApartamento}`}
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

  // ---- Render raíz ----
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
