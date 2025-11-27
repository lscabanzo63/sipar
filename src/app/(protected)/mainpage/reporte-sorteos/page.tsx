// app/(protected)/reportes/sorteos/page.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import SorteosTable, { type SorteoRow } from "@/components/ui/SorteosTable";
import {
  ClipboardIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

// Servicio que recupera la configuración del sorteo
import {
  getSorteoConfiguracionFromSession,
  type ConfiguracionResponse as GetConfigResponse,
} from "@/lib/api/getSorteoConfiguracion";

// Servicio que ejecuta el sorteo
import {
  ejecutarSorteoFromSession,
  type EjecutarSorteoResponse,
} from "@/lib/api/sorteos";

export default function ReporteDeSorteosPage() {
  // Fechas disponibles traídas desde el backend
  const [availableDates, setAvailableDates] = React.useState<string[]>([]);
  const [loadingConfig, setLoadingConfig] = React.useState<boolean>(true);
  const [configError, setConfigError] = React.useState<string | null>(null);

  // Fecha seleccionada manualmente por el usuario
  const [selectedDate, setSelectedDate] = React.useState<string>("");

  // Para feedback de "copiado"
  const [copiedDate, setCopiedDate] = React.useState<string | null>(null);

  // Estado para la ejecución del sorteo
  const [executing, setExecuting] = React.useState<boolean>(false);
  const [executeError, setExecuteError] = React.useState<string | null>(null);
  const [executeMessage, setExecuteMessage] = React.useState<string | null>(null);

  // Ganadores mapeados a la tabla
  const [rows, setRows] = React.useState<SorteoRow[]>([]);

  // 🔁 Al montar la página, traer la configuración del sorteo (fechas_programadas)
  React.useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoadingConfig(true);
        setConfigError(null);

        const res: GetConfigResponse = await getSorteoConfiguracionFromSession();
        // res.fechas_programadas: ["2026-01-15T00:00:00", ...]
        const fechas = Array.isArray(res.fechas_programadas)
          ? res.fechas_programadas.map((iso) => iso.slice(0, 10)) // YYYY-MM-DD
          : [];

        if (!isMounted) return;
        setAvailableDates(fechas);
      } catch (e) {
        console.error("Error obteniendo configuración de sorteo:", e);
        if (!isMounted) return;
        const msg =
          e instanceof Error ? e.message : "No fue posible cargar la configuración.";
        setConfigError(msg);
        setAvailableDates([]);
      } finally {
        if (isMounted) setLoadingConfig(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePickDate = async (date: string) => {
    setSelectedDate(date);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(date);
        setCopiedDate(date);
        setTimeout(() => setCopiedDate(null), 1500);
      }
    } catch (err) {
      console.error("No se pudo copiar la fecha al portapapeles", err);
    }
  };

  const handleExecute = async () => {
    if (!selectedDate) return;

    // Simple validación rápida del formato base
    if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      setExecuteError("La fecha debe estar en formato YYYY-MM-DD.");
      return;
    }

    try {
      setExecuting(true);
      setExecuteError(null);
      setExecuteMessage(null);
      setRows([]);

      const fechaISO = `${selectedDate}T00:00:00`;

      const res: EjecutarSorteoResponse = await ejecutarSorteoFromSession(fechaISO);

      // Mapear ganadores a la tabla
      const mapped: SorteoRow[] = (res.ganadores ?? []).map((g) => ({
        id: g.usuario_id,
        nombre: g.nombre,
        numero_parqueadero: g.numero_parqueadero,
      }));

      setRows(mapped);
      setExecuteMessage(res.mensaje || "Sorteo ejecutado correctamente.");
    } catch (e) {
      console.error("Error ejecutando sorteo:", e);
      const msg = e instanceof Error ? e.message : "Error al ejecutar el sorteo.";
      setExecuteError(msg);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <>
      <title>REPORTES</title>
      <main className="p-4 md:p-6 lg:p-8">
        {/* Encabezado */}
        <section className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Reporte de Sorteos
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Consulta y ejecuta los sorteos programados para tu conjunto.
          </p>
        </section>

        {/* Fechas disponibles + input manual */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            {/* Lista de fechas disponibles */}
            <div className="flex-1 min-w-[240px]">
              <h2 className="text-sm font-semibold text-neutral-900">
                Fechas disponibles para ejecutar el sorteo
              </h2>

              {loadingConfig ? (
                <p className="mt-2 text-sm text-neutral-600">
                  Cargando fechas programadas…
                </p>
              ) : configError ? (
                <p className="mt-2 text-sm text-red-600">{configError}</p>
              ) : availableDates.length === 0 ? (
                <p className="mt-2 text-sm text-neutral-600">
                  No hay fechas programadas actualmente.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {availableDates.map((date) => {
                    const isCopied = copiedDate === date;

                    return (
                      <li
                        key={date}
                        className={`
                          flex items-center justify-between gap-3 rounded-xl px-3 py-2
                          border text-sm font-medium transition-all duration-300
                          ${
                            isCopied
                              ? "bg-green-100 border-green-400 text-green-800"
                              : "bg-neutral-50 border-neutral-200 text-neutral-800"
                          }
                        `}
                      >
                        <span>{date}</span>

                        <button
                          type="button"
                          onClick={() => handlePickDate(date)}
                          className={`
                            inline-flex items-center gap-1 rounded-lg px-2 py-1 
                            text-xs font-medium shadow-sm border transition-all duration-200
                            ${
                              isCopied
                                ? "bg-green-200 border-green-500 text-green-900 hover:bg-green-300"
                                : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                            }
                          `}
                          aria-label={`Copiar fecha ${date}`}
                        >
                          {isCopied ? (
                            <>
                              <CheckIcon className="h-4 w-4 text-green-700" />
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <ClipboardIcon className="h-4 w-4" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <p className="mt-3 text-xs text-neutral-500">
                Tip: haz clic en <strong>Copiar</strong> para usar esa fecha en el campo de
                abajo y, además, llevarla al portapapeles.
              </p>
            </div>

            {/* Input manual de fecha + botón ejecutar */}
            <div className="flex-1 min-w-[240px] max-w-sm">
              <label
                htmlFor="fecha-ejecucion"
                className="block text-sm font-semibold text-neutral-900"
              >
                Fecha a ejecutar
              </label>
              <input
                id="fecha-ejecucion"
                type="text"
                placeholder="YYYY-MM-DD"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Escribe o pega una de las fechas listadas a la izquierda en formato{" "}
                <span className="font-mono">YYYY-MM-DD</span>. Se usará para ejecutar el sorteo.
              </p>

              {executeError && (
                <p className="mt-2 text-xs text-red-600">{executeError}</p>
              )}
              {executeMessage && (
                <p className="mt-2 text-xs text-green-700">{executeMessage}</p>
              )}

              <div className="mt-3">
                <Button
                  size="sm"
                  type="button"
                  fullWidth
                  disabled={!selectedDate || executing}
                  onClick={handleExecute}
                >
                  {executing ? "Ejecutando sorteo..." : "Ejecutar sorteo"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Resultados */}
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Resultados
            </h2>
            <span className="text-sm text-neutral-500">
              {rows.length} elementos
            </span>
          </div>

          <SorteosTable data={rows} />
        </section>
      </main>
    </>
  );
}
