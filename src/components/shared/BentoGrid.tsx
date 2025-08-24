"use client";

export default function BentoGrid() {
  return (
    <section className="bg-[var(--background)] py-16 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Encabezado */}
        <h2 className="text-center text-sm font-semibold text-[var(--color-brand)]">
          Dashboard
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Espacios disponibles
        </p>

        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2 lg:auto-rows-fr">
          {/* Espacio 1 (alto, 2 filas) */}
          <div className="relative lg:row-span-2 h-full">
            <div className="absolute inset-px rounded-lg bg-[var(--color-header)] shadow-md border border-[var(--color-brand-600)] lg:rounded-l-3xl"></div>
            <div className="relative flex h-full min-h-[280px] flex-col items-center justify-center rounded-2xl lg:rounded-l-3xl">
              <p className="text-3xl font-semibold text-[var(--color-brand)]">Espacio 1</p>
            </div>
          </div>

          {/* Espacio 2 */}
          <div className="relative h-full">
            <div className="absolute inset-px rounded-lg bg-[var(--color-header)] shadow-md border border-[var(--color-brand-600)]"></div>
            <div className="relative flex h-full min-h-[160px] flex-col items-center justify-center rounded-2xl">
              <p className="text-3xl font-semibold text-[var(--color-brand)]">Espacio 2</p>
            </div>
          </div>

          {/* Espacio 3 */}
          <div className="relative lg:col-start-2 lg:row-start-2 h-full">
            <div className="absolute inset-px rounded-lg bg-[var(--color-header)] shadow-md border border-[var(--color-brand-600)]"></div>
            <div className="relative flex h-full min-h-[160px] flex-col items-center justify-center rounded-2xl">
              <p className="text-3xl font-semibold text-[var(--color-brand)]">Espacio 3</p>
            </div>
          </div>

          {/* Espacio 4 (alto, 2 filas) */}
          <div className="relative lg:row-span-2 h-full">
            <div className="absolute inset-px rounded-lg bg-[var(--color-header)] shadow-md border border-[var(--color-brand-600)] lg:rounded-r-3xl"></div>
            <div className="relative flex h-full min-h-[280px] flex-col items-center justify-center rounded-2xl lg:rounded-r-3xl">
              <p className="text-3xl font-semibold text-[var(--color-brand)]">Espacio 4</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
