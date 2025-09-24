"use client";

import { useEffect, useState } from "react";
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
  InitialConfigResponse,
} from "@/lib/api/setup";

type FormState = {
  email: string;
  nombre: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  parqueaderos: string; // lo manejamos como string en el form
};

export default function InitialConfigurationPage() {
  const router = useRouter();

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

  // helper setter
  const set = (k: keyof FormState) => (v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  // Cargar datos del endpoint al montar
  useEffect(() => {
    (async () => {
      try {
        const data: InitialConfigResponse = await getInitialConfigFromSession();

        // Mapear al shape del formulario con ternarios (null -> '')
        setForm({
          email: (data.email ?? "") as string,
          nombre: (data.nombre_conjunto ?? "") as string,
          telefono: (data.telefono ?? "") as string,
          ciudad: (data.ciudad ?? "") as string,
          direccion: (data.direccion ?? "") as string,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditable(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Aquí luego harás el PATCH; por ahora solo navegamos
      router.push("/initial-configuration/structure-configuration");
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
            {/* Bienvenida */}
            <div>
              <h2 className="text-2xl font-semibold text-center">
                Bienvenido, confirmemos algunos datos antes de empezar...
              </h2>
            </div>

            {/* Formulario */}
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
                    onClick={() => setIsEditable((v) => !v)}
                    className="font-medium underline text-[var(--color-brand)] cursor-pointer transition hover:brightness-110"
                  >
                    {isEditable ? "Cancelar edición" : "Modificar"}
                  </button>
                  .
                </p>
              </header>

              {/* Carga inicial / error */}
              {loadingInitial ? (
                <p className="text-sm text-neutral-600">Cargando…</p>
              ) : error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : (
                <section className="relative">
                  {!isEditable && (
                    <div
                      className="absolute inset-0 z-10 cursor-not-allowed"
                      aria-hidden="true"
                    />
                  )}

                  <div className="space-y-6">
                    <TextFieldLine
                      label="Email"
                      name="email"
                      type="email"
                      value={form.email ?? ""} // ternario/?? para null -> ''
                      icon={<EnvelopeIcon className="h-5 w-5" />}
                      placeholder="usuario@ejemplo.com"
                      pattern={/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/}
                      errorMessage="Ingresa un correo válido"
                      required
                      validateOnBlur
                      readOnly={!isEditable}
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
                      readOnly={!isEditable}
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
                      readOnly={!isEditable}
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
                      readOnly={!isEditable}
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
                      readOnly={!isEditable}
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
                      readOnly={!isEditable}
                      onChange={set("parqueaderos")}
                    />
                  </div>
                </section>
              )}

              {/* Espacio reservado para evitar saltos */}
              <div className="pt-2 h-[56px] flex justify-center items-start">
                {isEditable && !loadingInitial && !error && (
                  <button
                    type="submit"
                    className="rounded-full px-6 py-3 shadow-md bg-[var(--color-brand)] text-white cursor-pointer transition hover:brightness-110"
                  >
                    Guardar cambios
                  </button>
                )}
              </div>
            </form>

            {/* Botón Confirmar */}
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

      {/* Overlay de carga con Spinner */}
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
