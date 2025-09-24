"use client";

import { useEffect, useRef, useState } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import TextFieldLine from "@/components/ui/TextFieldLine";
import { Button } from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import {
  getInitialConfigFromSession,
  patchInitialConfigFromSession,
  InitialConfigResponse,
} from "@/lib/api/confirmData";

type FormState = {
  email: string;
  nombre: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  parqueaderos: string;
};

export default function InitialConfigurationPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLElement | null>(null); // 👈 ref del contenedor scrollable

  const [form, setForm] = useState<FormState>({
    email: "",
    nombre: "",
    telefono: "",
    ciudad: "",
    direccion: "",
    parqueaderos: "",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof FormState) => (v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  // subir el scroll del formulario
  function scrollToTopOfForm() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => {
      el.scrollTop = 0;
    });
  }

  useEffect(() => {
    (async () => {
      try {
        const data: InitialConfigResponse = await getInitialConfigFromSession();
        setForm({
          email: data.email ?? "",
          nombre: data.nombre_conjunto ?? "",
          telefono: data.telefono ?? "",
          ciudad: data.ciudad ?? "",
          direccion: data.direccion ?? "",
          parqueaderos:
            data.cantidad_parqueaderos != null
              ? String(data.cantidad_parqueaderos)
              : "",
        });
      } catch {
        setError("No se pudo cargar la configuración inicial");
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaved(false);
    setError(null);
    setLoading(true);
    try {
      await patchInitialConfigFromSession({
        email: form.email ?? "",
        nombre_conjunto: form.nombre ?? "",
        ciudad: form.ciudad ?? "",
        direccion: form.direccion ?? "",
        telefono: form.telefono ?? "",
        cantidad_parqueaderos: form.parqueaderos ?? "0",
      });
      setIsEditable(false);
      setSaved(true);
      scrollToTopOfForm(); // 👈 subir scroll al éxito
    } catch {
      setError("No se pudieron guardar los cambios");
      scrollToTopOfForm(); // 👈 subir scroll al error
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      router.push("/initial-configuration/structure-configuration");
    } finally {
      setLoading(false);
    }
  };

  const EDITABLE_KEYS = new Set<keyof FormState>(["email", "telefono", "direccion"]);
  const canEdit = (k: keyof FormState) => isEditable && EDITABLE_KEYS.has(k);

  return (
    <>
      <main className="h-dvh flex flex-col lg:flex-row">
        {/* Columna izquierda scrollable */}
        <section
          ref={scrollRef} // 👈 ref para controlar el scroll
          className="flex-1 h-dvh bg-[var(--color-header)] flex flex-col px-6 lg:px-12 py-10 overflow-auto"
        >
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-center">
                Bienvenido, confirmemos algunos datos antes de empezar...
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="w-full space-y-6 bg-white p-6 rounded-2xl shadow"
            >
              <header>
                <h3 className="text-xl font-semibold">Información personal</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Por favor, asegúrate de que la información de abajo es
                  correcta. Si necesitas cambiar algo, presiona{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditable((v) => !v);
                      setSaved(false);
                      setError(null);
                    }}
                    className="font-medium underline text-[var(--color-brand)] cursor-pointer transition hover:brightness-110"
                  >
                    {isEditable ? "Cancelar edición" : "Modificar"}
                  </button>
                  .
                </p>
                {saved && (
                  <p className="mt-2 text-sm text-green-600">
                    Cambios guardados correctamente.
                  </p>
                )}
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </header>

              {loadingInitial ? (
                <p className="text-sm text-neutral-600">Cargando…</p>
              ) : (
                <section className="relative">
                  <div className="space-y-6">
                    <TextFieldLine
                      label="Email"
                      name="email"
                      type="email"
                      value={form.email ?? ""}
                      icon={<EnvelopeIcon className="h-5 w-5" />}
                      placeholder="usuario@ejemplo.com"
                      pattern={/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/}
                      errorMessage="Ingresa un correo válido"
                      required
                      validateOnBlur
                      readOnly={!canEdit("email")}
                      onChange={set("email")}
                    />

                    <TextFieldLine
                      label="Nombre"
                      name="nombre"
                      value={form.nombre ?? ""}
                      icon={<BuildingOfficeIcon className="h-5 w-5" />}
                      placeholder="Nombre del conjunto residencial"
                      pattern={/^.+$/}
                      errorMessage="El nombre no puede estar vacío"
                      required
                      validateOnBlur
                      readOnly={!canEdit("nombre")}
                      onChange={set("nombre")}
                    />

                    <TextFieldLine
                      label="Teléfono"
                      name="telefono"
                      type="text"
                      value={form.telefono ?? ""}
                      icon={<PhoneIcon className="h-5 w-5" />}
                      placeholder="Ej: 3204578787"
                      allowedPattern={/^\d{0,10}$/}
                      pattern={/^\d{10}$/}
                      errorMessage="El teléfono debe tener 10 dígitos numéricos"
                      required
                      validateOnBlur
                      readOnly={!canEdit("telefono")}
                      onChange={set("telefono")}
                    />

                    <TextFieldLine
                      label="Ciudad"
                      name="ciudad"
                      value={form.ciudad ?? ""}
                      icon={<MapPinIcon className="h-5 w-5" />}
                      placeholder="Bogotá D.C."
                      pattern={/^.+$/}
                      errorMessage="La ciudad no puede estar vacía"
                      required
                      validateOnBlur
                      readOnly={!canEdit("ciudad")}
                      onChange={set("ciudad")}
                    />

                    <TextFieldLine
                      label="Dirección"
                      name="direccion"
                      value={form.direccion ?? ""}
                      icon={<MapPinIcon className="h-5 w-5" />}
                      placeholder="Cl. 74 Sur # 82G-20, Bosa"
                      pattern={/^.+$/}
                      errorMessage="La dirección no puede estar vacía"
                      required
                      validateOnBlur
                      readOnly={!canEdit("direccion")}
                      onChange={set("direccion")}
                    />

                    <TextFieldLine
                      label="Cantidad de parqueaderos"
                      name="parqueaderos"
                      type="text"
                      value={form.parqueaderos ?? ""}
                      icon={<BuildingOfficeIcon className="h-5 w-5" />}
                      placeholder="245"
                      allowedPattern={/^\d*$/}
                      pattern={/^\d+$/}
                      errorMessage="Solo se permiten números"
                      required
                      validateOnBlur
                      readOnly={!canEdit("parqueaderos")}
                      onChange={set("parqueaderos")}
                    />
                  </div>
                </section>
              )}

              <div className="pt-2 h-[56px] flex justify-center items-start">
                {isEditable && !loadingInitial && !error && (
                  <button
                    type="submit"
                    className="rounded-full px-6 py-3 shadow-md bg-[var(--color-brand)] text-white cursor-pointer transition hover:brightness-110"
                    disabled={loading}
                  >
                    Guardar cambios
                  </button>
                )}
              </div>
            </form>

            <div className="flex justify-center mb-8">
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirm}
                disabled={loadingInitial || !!error}
              >
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
