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
    email: "usuario@example.com",
    nombre: "Conjunto Residencial Las Palmas",
    telefono: "3054645906",
    ciudad: "Bogota D.C.",
    direccion: "Cl. 74 Sur # 82G-20, Bosa, Bogotá, D.C.",
    parqueaderos: "333",
  });

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario:", form);
    // TODO: enviar al backend y redirigir
  };

  return (
    <main className="min-h-dvh grid place-items-start p-6 lg:p-10 bg-[var(--color-header)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-6 bg-white p-6 rounded-2xl shadow"
      >
        <h1 className="text-2xl font-semibold text-[var(--color-brand)]">
          Confirmación de datos
        </h1>

        {/* Email */}
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
          onChange={set("email")}
        />

        {/* Nombre */}
        <TextFieldLine
          label="Nombre"
          name="nombre"
          value={form.nombre}
          icon={<BuildingOfficeIcon className="h-5 w-5" />}
          placeholder="Nombre del conjunto residencial"
          pattern={/^.+$/} // obligatorio (no vacío)
          errorMessage="El nombre no puede estar vacío"
          required
          validateOnBlur
          onChange={set("nombre")}
        />

        {/* Teléfono */}
        <TextFieldLine
          label="Teléfono"
          name="telefono"
          type="text" // dejamos text para controlar la entrada
          value={form.telefono}
          icon={<PhoneIcon className="h-5 w-5" />}
          placeholder="Ej: 3204578787"
          allowedPattern={/^\d{0,10}$/} // SOLO números, máx 10 mientras escribe
          pattern={/^\d{10}$/} // validación final: exactamente 10
          errorMessage="El teléfono debe tener 10 dígitos numéricos"
          required
          validateOnBlur
          onChange={set("telefono")}
        />

        {/* Ciudad */}
        <TextFieldLine
          label="Ciudad"
          name="ciudad"
          value={form.ciudad}
          icon={<MapPinIcon className="h-5 w-5" />}
          placeholder="Bogotá D.C."
          pattern={/^.+$/} // obligatorio
          errorMessage="La ciudad no puede estar vacía"
          required
          validateOnBlur
          onChange={set("ciudad")}
        />

        {/* Dirección */}
        <TextFieldLine
          label="Dirección"
          name="direccion"
          value={form.direccion}
          icon={<MapPinIcon className="h-5 w-5" />}
          placeholder="Cl. 74 Sur # 82G-20, Bosa"
          pattern={/^.+$/} // obligatorio
          errorMessage="La dirección no puede estar vacía"
          required
          validateOnBlur
          onChange={set("direccion")}
        />

        {/* Cantidad de parqueaderos */}
        <TextFieldLine
          label="Cantidad de parqueaderos"
          name="parqueaderos"
          type="text" // text para bloquear caracteres con allowedPattern
          value={form.parqueaderos}
          icon={<BuildingOfficeIcon className="h-5 w-5" />}
          placeholder="245"
          allowedPattern={/^\d*$/} // <-- SOLO números mientras escribe
          pattern={/^\d+$/} // validación final: uno o más dígitos
          errorMessage="Solo se permiten números"
          required
          validateOnBlur
          onChange={set("parqueaderos")}
        />

        <button
          type="submit"
          className="mt-4 rounded-full px-6 py-3 shadow-md bg-[var(--color-brand)] text-white hover:brightness-110 transition"
        >
          Continuar
        </button>
      </form>
    </main>
  );
}
