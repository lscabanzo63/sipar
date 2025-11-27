"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

// Este tipo ahora representa un ganador de sorteo
export type SorteoRow = {
  id: number | string;            // usuario_id
  nombre: string;                 // nombre completo
  numero_parqueadero: number;     // número de parqueadero asignado
};

type Props = {
  data?: SorteoRow[];
  className?: string;
};

export default function SorteosTable({ data = [], className }: Props) {
  const hasData = data.length > 0;

  // ---- Header ----
  const renderHeader = () => (
    <thead className="bg-brand text-white">
      <tr className="text-sm">
        <th scope="col" className="px-4 py-3 font-semibold text-center">ID</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">NOMBRE</th>
        <th scope="col" className="px-4 py-3 font-semibold text-center">PARQUEADERO</th>
      </tr>
    </thead>
  );

  // ---- Empty State ----
  const renderEmpty = () => (
    <tbody>
      <tr>
        <td colSpan={3} className="px-4 py-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-600">
            No hay resultados para mostrar.
          </div>
        </td>
      </tr>
    </tbody>
  );

  // ---- Render cell helper ----
  const renderCell = (content: React.ReactNode) => (
    <td className="px-4 py-3 align-middle text-sm text-neutral-800 text-center">
      {content}
    </td>
  );

  // ---- Rows ----
  const renderRows = () => (
    <tbody className="divide-y divide-neutral-200">
      {data.map((row) => (
        <tr key={row.id} className="bg-white hover:bg-neutral-50">
          {renderCell(row.id)}
          {renderCell(row.nombre)}
          {renderCell(row.numero_parqueadero)}
        </tr>
      ))}
    </tbody>
  );

  // ---- Render root ----
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
