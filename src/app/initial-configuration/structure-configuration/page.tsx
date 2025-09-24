// app/initial-configuration/structure-configuration/page.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import TextFieldLine from "@/components/ui/TextFieldLine";
import SelectFieldLine from "@/components/ui/SelectFieldLine";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

export default function StructureConfigurationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    numeroTorres: "",
    pisosPorTorre: "",
    aptosPorPiso: "",
    extraSelect: "", // nuevo campo del select
  });

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  // Opciones de ejemplo 1..50 para el select final
  const numOptions = useMemo(
    () =>
      Array.from({ length: 2 }, (_, i) => {
        const n = String(i + 1);
        return { label: n, value: n };
      }),
    []
  );

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      // router.push("/home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="h-dvh flex flex-col lg:flex-row">
        {/* Columna izquierda */}
        <section className="flex-1 h-dvh bg-[var(--color-header)] flex flex-col px-6 lg:px-12 py-10 overflow-auto">
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
            {/* Título + Volver */}
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Configuración del conjunto</h2>
              <Button variant="primary" size="md" onClick={() => router.back()}>
                Volver
              </Button>
            </div>

            {/* Card */}
            <form className="w-full space-y-6 bg-white p-6 rounded-2xl shadow">
              <header>
                <h3 className="text-xl font-semibold">Torres y apartamentos</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Completa la estructura del conjunto.
                </p>
              </header>

              <div className="space-y-6">
                {/* ⬇️ Se mantienen los 3 inputs originales (editables) */}
                <TextFieldLine
                  label="Número de torres"
                  name="numeroTorres"
                  type="text"
                  value={form.numeroTorres}
                  icon={<BuildingOfficeIcon className="h-5 w-5" />}
                  placeholder="Ej: 6"
                  allowedPattern={/^\d*$/}
                  pattern={/^\d+$/}
                  errorMessage="Solo se permiten números"
                  required
                  validateOnBlur
                  onChange={set("numeroTorres")}
                />

                <TextFieldLine
                  label="Número de pisos por torre"
                  name="pisosPorTorre"
                  type="text"
                  value={form.pisosPorTorre}
                  icon={<BuildingOfficeIcon className="h-5 w-5" />}
                  placeholder="Ej: 12"
                  allowedPattern={/^\d*$/}
                  pattern={/^\d+$/}
                  errorMessage="Solo se permiten números"
                  required
                  validateOnBlur
                  onChange={set("pisosPorTorre")}
                />

                <TextFieldLine
                  label="Número de apartamentos por piso"
                  name="aptosPorPiso"
                  type="text"
                  value={form.aptosPorPiso}
                  icon={<BuildingOfficeIcon className="h-5 w-5" />}
                  placeholder="Ej: 4"
                  allowedPattern={/^\d*$/}
                  pattern={/^\d+$/}
                  errorMessage="Solo se permiten números"
                  required
                  validateOnBlur
                  onChange={set("aptosPorPiso")}
                />

                {/* ⬇️ NUEVO: sólo al final, el SelectFieldLine */}
                <SelectFieldLine
                  label="Selecciona un prefijo"
                  name="extraSelect"
                  value={form.extraSelect}
                  onChange={set("extraSelect")}
                  options={numOptions}
                  placeholder="Selecciona…"
                  required
                  validateOnBlur
                  icon={<BuildingOfficeIcon className="h-5 w-5" />}
                  errorMessage="Selecciona un valor válido"
                />
              </div>
            </form>

            {/* Confirmar */}
            <div className="flex justify-center mb-8">
              <Button variant="primary" size="md" onClick={handleConfirm}>
                Confirmar
              </Button>
            </div>
          </div>
        </section>

        {/* Columna derecha */}
        <aside className="relative flex-1 h-dvh">
          <Image
            src="/parking.jpg"
            alt="Parqueadero"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/65" />
        </aside>
      </main>

      {/* Overlay de carga */}
      <Spinner
        variant="overlay"
        open={loading}
        text="Estamos procesando la información"
        size="md"
        backdropOpacity={60}
        blur
      />
    </>
  );
}
