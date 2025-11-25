"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";

type AdminCreateFormValues = {
  name: string;
  email: string;
  role: string;
  password: string;
};

type Props = {
  onSubmit: (values: AdminCreateFormValues) => void;
};

export default function CreateAdmin({ onSubmit }: Props) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const values: AdminCreateFormValues = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      role: (form.elements.namedItem("role") as HTMLSelectElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    onSubmit(values);
  };

  return (
    <section className="bg-white rounded-2xl shadow-md px-8 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Agregar nuevo usuario
        </h1>
        <p className="mt-1 text-xs text-neutral-600">
          Registra un usuario para que pueda acceder al sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-medium text-neutral-800">
            Nombre completo
          </label>
          <input
            name="name"
            type="text"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-700/70"
            placeholder="Ej. Juan Pérez"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-medium text-neutral-800">
            Correo electrónico
          </label>
          <input
            name="email"
            type="email"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-700/70"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-medium text-neutral-800">Rol</label>
          <select
            name="role"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-700/70"
            defaultValue="ADMIN"
            required
          >
            <option value="ADMIN">Administrador</option>
            <option value="GESTOR">Gestor</option>
            <option value="SEGURIDAD">Seguridad</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-medium text-neutral-800">
            Contraseña temporal
          </label>
          <input
            name="password"
            type="password"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-700/70"
            placeholder="Generada o definida por ti"
            required
          />
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button
            type="button"
            className="px-4 py-2 text-[11px] border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="px-5 py-2 text-[11px] font-medium bg-purple-800 text-white hover:bg-purple-900"
          >
            Crear usuario
          </Button>
        </div>
      </form>
    </section>
  );
}
