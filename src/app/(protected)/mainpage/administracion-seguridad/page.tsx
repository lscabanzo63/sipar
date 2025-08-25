// app/(protected)/reportes/sorteos/page.tsx
"use client";

import * as React from "react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import SeguridadAdminTable, { type SeguridadRow } from "@/components/ui/SeguridadAdminTable";

export default function ReporteDeSorteosPage() {
  // Filtros: código y nombre
  const [codigo, setCodigo] = React.useState("");
  const [nombre, setNombre] = React.useState("");

  // Arranca vacío para ver estado "¡Busca registros de seguridad!"
//   const data: SeguridadRow[] = [];

  // Descomenta para mockear filas:
  const data: SeguridadRow[] = [
    { codigo: "SEC-001", nombre: "Carlos Rojas", turno: "Diurno",  estado: "Activo" },
    { codigo: "SEC-002", nombre: "María López", turno: "Nocturno", estado: "Inactivo" },
  ];

  return (
    <>
      <title>Administración Seguridad</title>
      <main className="p-4 md:p-6 lg:p-8">
        {/* Encabezado */}
        <section className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Administración Seguridad</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Filtra por <span className="font-medium">código</span> o <span className="font-medium">nombre</span> y consulta los resultados.
          </p>
        </section>

        {/* Filtros */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
            {/* Código */}
            <div className="flex-1 min-w-[200px]">
              <TextField
                label="Código"
                type="text"
                placeholder="SEC-001"
                value={codigo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCodigo(e.target.value)}
              />
            </div>

            {/* Nombre */}
            <div className="flex-1 min-w-[200px]">
              <TextField
                label="Nombre"
                type="text"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
              />
            </div>

            {/* Botón buscar */}
            <div className="flex-none">
              <Button size="sm" type="button" fullWidth>
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

          <SeguridadAdminTable
            data={data}
            onEdit={(row) => console.log("Modificar:", row)}
            onChangeStatus={(row) => console.log("Cambiar estado:", row)}
          />
        </section>
      </main>
    </>
  );
}
