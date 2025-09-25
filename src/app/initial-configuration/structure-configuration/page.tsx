// app/initial-configuration/structure-configuration/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import TextFieldLine from "@/components/ui/TextFieldLine";
import SelectFieldLine from "@/components/ui/SelectFieldLine";
import { HashtagIcon } from "@heroicons/react/24/outline";
import { setupTowersFromSession } from "@/lib/api/towers";

export default function StructureConfigurationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  const [form, setForm] = useState({
    numeroTorres: "",
    pisosPorTorre: "",
    aptosPorPiso: "",
    extraSelect: "",
  });

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const prefixOptions = useMemo(
    () => [
      { label: "Numeración Automática", value: "NUMERACION_AUTOMATICA" },
      { label: "Alfabético", value: "ALFABETICO" },
    ],
    []
  );

  const onlyDigits = /^\d+$/;
  const isValid = useMemo(() => {
    if (
      !form.numeroTorres ||
      !form.pisosPorTorre ||
      !form.aptosPorPiso ||
      !form.extraSelect
    ) {
      return false;
    }
    if (
      !onlyDigits.test(form.numeroTorres) ||
      !onlyDigits.test(form.pisosPorTorre) ||
      !onlyDigits.test(form.aptosPorPiso)
    ) {
      return false;
    }
    if (
      Number(form.numeroTorres) <= 0 ||
      Number(form.pisosPorTorre) <= 0 ||
      Number(form.aptosPorPiso) <= 0
    ) {
      return false;
    }
    return true;
  }, [form]);

  const handleConfirm = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      await setupTowersFromSession({
        num_torres: form.numeroTorres,
        pisos_x_torre: form.pisosPorTorre,
        aptos_x_piso: form.aptosPorPiso,
        numeracion_automatica: form.extraSelect,
      });
      // ✅ Redirigir a mainpage en caso de éxito
      router.push("/mainpage");
    } catch {
      // Aquí podrías mostrar un banner de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setHydrating(false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <main className="h-dvh flex flex-col lg:flex-row">
        <section className="flex-1 h-dvh bg-[var(--color-header)] flex flex-col px-6 lg:px-12 py-10 overflow-auto">
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Configuración del conjunto</h2>
              <Button variant="primary" size="md" onClick={() => router.back()}>
                Volver
              </Button>
            </div>

            <form
              className="w-full space-y-6 bg-white p-6 rounded-2xl shadow"
              onSubmit={(e) => e.preventDefault()}
            >
              <header>
                <h3 className="text-xl font-semibold">Torres y apartamentos</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Completa la estructura del conjunto.
                </p>
              </header>

              <div className="space-y-6">
                <TextFieldLine
                  label="Número de torres"
                  name="numeroTorres"
                  type="text"
                  value={form.numeroTorres}
                  icon={<HashtagIcon className="h-5 w-5" />}
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
                  icon={<HashtagIcon className="h-5 w-5" />}
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
                  icon={<HashtagIcon className="h-5 w-5" />}
                  placeholder="Ej: 4"
                  allowedPattern={/^\d*$/}
                  pattern={/^\d+$/}
                  errorMessage="Solo se permiten números"
                  required
                  validateOnBlur
                  onChange={set("aptosPorPiso")}
                />

                <SelectFieldLine
                  label="Selecciona un prefijo"
                  name="extraSelect"
                  value={form.extraSelect}
                  onChange={set("extraSelect")}
                  options={prefixOptions}
                  placeholder="Selecciona…"
                  required
                  validateOnBlur
                  icon={<HashtagIcon className="h-5 w-5" />}
                  errorMessage="Selecciona un valor válido"
                />
              </div>
            </form>

            <div className="flex justify-center mb-8">
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirm}
                disabled={!isValid || loading || hydrating}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </section>

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

      <Spinner
        variant="overlay"
        open={hydrating || loading}
        text="Estamos procesando la información"
        size="md"
        backdropOpacity={60}
        blur
      />
    </>
  );
}
