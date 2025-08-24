// components/ui/SorteosTable.tsx
"use client";

import * as React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export type SorteoRow = {
  id: string | number;
  fechaRealizacion: string;
  parqueaderosTotales: number;
};

type Props = {
  data?: SorteoRow[];
  className?: string;
  onView?: (row: SorteoRow) => void;
};

export default function SorteosTable({ data = [], className, onView }: Props) {
  const hasData = data.length > 0;

  // ---- Render helpers ----
  const renderHeader = () => (
    <thead className="bg-brand text-white">
      <tr className="text-sm">
        <th scope="col" className="px-4 py-3 font-semibold text-center">ID</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">FECHA DE REALIZACIÓN</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">PARQUEADEROS TOTALES</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">ACCIONES</th>
      </tr>
    </thead>
  );

  const renderEmpty = () => (
    <tbody>
      <tr>
        <td colSpan={4} className="px-4 py-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-600">
            ¡Busca tu sorteo!
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
        <tr key={row.id} className="bg-white hover:bg-neutral-50">
          {renderCell(row.id)}
          {renderCell(row.fechaRealizacion)}
          {renderCell(row.parqueaderosTotales)}
          <td className="px-4 py-3 align-middle text-center">
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<EyeIcon className="h-5 w-5" aria-hidden="true" />}
                aria-label={`Ver sorteo ${row.id}`}
                onClick={() => onView?.(row)}
              >
                Ver
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
