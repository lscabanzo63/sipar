// app/(protected)/reportes/sorteos/page.tsx
"use client";

import * as React from "react";
import { DateField } from "@/components/ui/DateField";
import { Button } from "@/components/ui/Button";
import SorteosTable, { type SorteoRow } from "@/components/ui/SorteosTable";

export default function ReporteDeSorteosPage() {
  // Estados locales (visual)
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  const data: SorteoRow[] = [
    { id: 101, fechaRealizacion: "2025-08-15", parqueaderosTotales: 24 },
    { id: 102, fechaRealizacion: "2025-08-22", parqueaderosTotales: 30 },
  ];

  return (
    <>
      <title>REPORTES</title>
      <main className="p-4 md:p-6 lg:p-8">
        {/* Encabezado */}
        <section className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Reporte de Sorteos</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Filtra por rango de fechas y consulta los resultados.
          </p>
        </section>

        {/* Filtros */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
            {/* Fecha de inicio */}
            <div className="flex-1 min-w-[200px]">
              <DateField
                id="fecha-inicio"
                name="fechaInicio"
                label="Fecha de inicio"
                value={startDate}
                onChange={setStartDate}
              />
            </div>

            {/* Fecha de fin */}
            <div className="flex-1 min-w-[200px]">
              <DateField
                id="fecha-fin"
                name="fechaFin"
                label="Fecha de fin"
                placeholder="Selecciona una fecha"
                value={endDate}
                onChange={setEndDate}
              />
            </div>

            {/* Botón buscar */}
            <div className="flex-none">
              <Button size="sm" type="submit" fullWidth>
                Buscar
              </Button>
            </div>
          </div>
        </section>

        {/* Resultados */}
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Resultados</h2>
            <span className="text-sm text-neutral-500">{data.length} elementos</span>
          </div>

          <SorteosTable
            data={data} // prueba con [] para ver el estado vacío
            onView={(row) => console.log("Ver:", row)}
          />
        </section>
      </main>
    </>
  );
}
