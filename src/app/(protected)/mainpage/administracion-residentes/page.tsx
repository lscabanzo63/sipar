// app/(protected)/reportes/sorteos/page.tsx
"use client";

import * as React from "react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import ResidentesTable, { type ResidenteRow } from "@/components/ui/ResidentesTable";

export default function ReporteDeSorteosPage() {
  const [nombre, setNombre] = React.useState("");
  const [apartamento, setApartamento] = React.useState("");

  // const data: ResidenteRow[] = [];

  // Si quieres ver la tabla con datos de prueba, descomenta:
  const data: ResidenteRow[] = [
    { numeroApartamento: "A-101", nombreResidente: "Juan Pérez",  tipoResidente: "Propietario",  estadoParqueadero: "Activo" },
    { numeroApartamento: "B-204", nombreResidente: "Ana Gómez",   tipoResidente: "Arrendatario", estadoParqueadero: "Inactivo" },
    { numeroApartamento: "C-305", nombreResidente: "Luis Ortega", tipoResidente: "Propietario",  estadoParqueadero: "Activo" },
    
  ];

  return (
    <>
      <title>REPORTES</title>
      <main className="p-4 md:p-6 lg:p-8">
        {/* Encabezado */}
        <section className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Administración Residentes
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Filtra por nombre o número de apartamento y consulta los resultados.
          </p>
        </section>

        {/* Filtros */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
            {/* Nombre residente */}
            <div className="flex-1 min-w-[200px]">
              <TextField
                label="Nombre residente"
                type="text"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNombre(e.target.value)
                }
              />
            </div>

            {/* Número de apartamento */}
            <div className="flex-1 min-w-[200px]">
              <TextField
                label="Número de apartamento"
                type="text"
                placeholder="A-101"
                value={apartamento}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setApartamento(e.target.value)
                }
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
            <span className="text-sm text-neutral-500"> Mostrando {data.length} residentes</span>
          </div>

          <ResidentesTable
            data={data}
            emptyMessage="¡Busca residentes!"
            onEdit={(row) => console.log("Modificar:", row)}
            onChangeStatus={(row) => console.log("Cambiar estado:", row)}
          />
        </section>
      </main>
    </>
  );
}
