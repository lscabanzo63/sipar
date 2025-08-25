"use client";

import {
  CalendarDaysIcon,
  ClockIcon,
  UserMinusIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export default function BentoGrid() {
  return (
    <section className="bg-[var(--background)] py-16 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Encabezado */}
        <h2 className="text-center text-sm font-semibold text-[var(--color-brand)]">
          Resumen de tu conjunto
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Estas son algunas de las estadísticas
        </p>

        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:mt-16 lg:auto-rows-fr lg:grid-cols-3 lg:grid-rows-2">
          {/* 1) Alto (izq) – fondo brand, texto blanco */}
          <div className="relative h-full lg:row-span-2">
            <div className="relative flex h-full min-h-[280px] flex-col justify-between rounded-2xl border border-[var(--color-brand)] bg-[var(--color-brand)] p-6 text-white shadow-md lg:rounded-l-3xl">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-3">
                  <Squares2X2Icon className="h-10 w-10" aria-hidden="true" />
                </div>
                <h3 className="text-base font-medium opacity-90">Parqueaderos</h3>
              </div>

              <div className="mt-6 text-center">
                <p className="text-5xl font-bold leading-tight">330</p>
                <p className="mt-1 text-sm opacity-90">Se han asignado</p>
              </div>

              <div className="mt-6 h-1 w-full rounded-full bg-white/15" />
            </div>
          </div>

          {/* 2) Pequeño (arriba centro) – morado claro, texto brand */}
          <div className="relative h-full">
            <div className="relative flex h-full min-h-[160px] flex-col justify-between rounded-2xl border border-[var(--color-brand)] bg-[rgba(85,35,115,0.08)] p-6 text-[var(--color-brand)] shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[var(--color-brand)]/10 p-3">
                  <CalendarDaysIcon className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-medium">Último sorteo</h3>
              </div>

              <div className="text-center">
                <p className="text-3xl font-semibold leading-tight">23 días</p>
                <p className="mt-1 text-xs opacity-80">desde el último sorteo</p>
              </div>
            </div>
          </div>

          {/* 3) Pequeño (abajo centro) – morado claro, texto brand */}
          <div className="relative h-full lg:col-start-2 lg:row-start-2">
            <div className="relative flex h-full min-h-[160px] flex-col justify-between rounded-2xl border border-[var(--color-brand)] bg-[rgba(85,35,115,0.08)] p-6 text-[var(--color-brand)] shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[var(--color-brand)]/10 p-3">
                  <ClockIcon className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-medium">Próximo sorteo</h3>
              </div>

              <div className="text-center">
                <p className="text-3xl font-semibold leading-tight">67 días</p>
                <p className="mt-1 text-xs opacity-80">para el siguiente</p>
              </div>
            </div>
          </div>

          {/* 4) Alto (der) – fondo brand, texto blanco */}
          <div className="relative h-full lg:row-span-2">
            <div className="relative flex h-full min-h-[280px] flex-col justify-between rounded-2xl border border-[var(--color-brand)] bg-[var(--color-brand)] p-6 text-white shadow-md lg:rounded-r-3xl">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-3">
                  <UserMinusIcon className="h-10 w-10" aria-hidden="true" />
                </div>
                <h3 className="text-base font-medium opacity-90">Residentes excluidos</h3>
              </div>

              <div className="mt-6 text-center">
                <p className="text-5xl font-bold leading-tight">33</p>
                <p className="mt-1 text-sm opacity-90">no podrán participar</p>
              </div>

              <div className="mt-6 h-1 w-full rounded-full bg-white/15" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
