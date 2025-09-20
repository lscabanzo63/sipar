"use client";

import { useState } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import TextFieldLine from "@/components/ui/TextFieldLine";

export default function InitialConfigurationPage() {
  const [form, setForm] = useState({
    email: "xxxxx@gmail.com",
    nombre: "Conjunto Residencial Las Palmas",
    telefono: "3204578787",
    ciudad: "Bogotá D.C.",
    direccion: "Cl. 74 Sur # 82G-20, Bosa",
    parqueaderos: "245",
  });

  const [isEditable, setIsEditable] = useState(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario guardado:", form);

    // ✅ después de guardar, volver a bloquear inputs
    setIsEditable(false);
  };

  return (
    <main className="min-h-dvh grid place-items-start p-6 lg:p-10 bg-[var(--color-header)]">
      {/* Mensaje de bienvenida */}
      <section className="w-full max-w-3xl mb-6">
        <h2 className="text-2xl font-semibold">
          Bienvenido Jorge, confirmemos algunos datos antes de empezar...
        </h2>
      </section>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl space-y-6 bg-white p-6 rounded-2xl shadow"
      >
        {/* Título e instrucción */}
        <header>
          <h3 className="text-xl font-semibold">Información personal</h3>
          <p className="mt-1 text-sm text-neutral-600">
            Por favor, asegúrate de que la información de abajo es correcta. Si
            necesitas cambiar algo, presiona{" "}
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

        {/* Campos con overlay */}
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

        {/* Guardar cambios */}
        {isEditable && (
          <div className="pt-2">
            <button
              type="submit"
              className="rounded-full px-6 py-3 shadow-md bg-[var(--color-brand)] text-white cursor-pointer transition hover:brightness-110"
            >
              Guardar cambios
            </button>
          </div>
        )}
      </form>
    </main>
  );
}
