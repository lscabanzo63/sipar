"use client";

import { useState } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TextFieldLine from "@/components/ui/TextFieldLine";
import { Button } from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

export default function InitialConfigurationPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "xxxxx@gmail.com",
    nombre: "Conjunto Residencial Las Palmas",
    telefono: "3204578787",
    ciudad: "Bogotá D.C.",
    direccion: "Cl. 74 Sur # 82G-20, Bosa",
    parqueaderos: "245",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardar cambios y volver a bloquear
    console.log("Formulario guardado:", form);
    setIsEditable(false);
  };

  const handleToggleEdit = () => {
    setIsEditable((v) => !v);
  };

  const handleConfirm = async () => {
    // Si quieres mostrar overlay mientras navegamos:
    setLoading(true);
    // Aquí podrías hacer una llamada al backend si es necesario.
    // Navegación a la siguiente página
    router.push("initial-configuration/structure-configuration");
    // No necesitamos setLoading(false) porque la navegación desmonta este componente.
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
                Bienvenido Jorge, confirmemos algunos datos antes de empezar...
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
                    onClick={handleToggleEdit}
                    className="font-medium underline text-[var(--color-brand)] cursor-pointer transition hover:brightness-110"
                  >
                    {isEditable ? "Cancelar edición" : "Modificar"}
                  </button>
                  .
                </p>
              </header>

              {/* Campos */}
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
                    value={form.email}
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
                    value={form.nombre}
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
                    value={form.telefono}
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
                    value={form.ciudad}
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
                    value={form.direccion}
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
                    value={form.parqueaderos}
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

              {/* Espacio reservado para evitar saltos */}
              <div className="pt-2 h-[56px] flex justify-center items-start">
                {isEditable && (
                  <button
                    type="submit"
                    className="rounded-full px-6 py-3 shadow-md bg-[var(--color-brand)] text-white cursor-pointer transition hover:brightness-110"
                  >
                    Guardar cambios
                  </button>
                )}
              </div>
            </form>

            {/* Botón Confirmar (deshabilitado si se edita o si hay loading) */}
            <div className="flex justify-center mb-8">
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirm}
                disabled={isEditable || loading}
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

      {/* Overlay de carga con Spinner (aparece al confirmar) */}
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
