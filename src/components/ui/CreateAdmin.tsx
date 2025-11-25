"use client";

import { FormEvent, useState } from "react";
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
  const [formValues, setFormValues] = useState<AdminCreateFormValues>({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(formValues);
    // si quieres, puedes limpiar el formulario:
    // setFormValues({ name: "", email: "", role: "", password: "" });
  };

  const handleChange =
    (field: keyof AdminCreateFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const isValid =
    formValues.name.trim() !== "" &&
    formValues.email.trim() !== "" &&
    formValues.role.trim() !== "" &&
    formValues.password.trim() !== "";

  return (
    <section className="bg-white rounded-2xl shadow-md px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Agregar nuevo usuario
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Registra un usuario para que pueda acceder al sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800">
            Nombre completo
          </label>
          <input
            name="name"
            type="text"
            required
            value={formValues.name}
            onChange={handleChange("name")}
            className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800">
            Correo electrónico
          </label>
          <input
            name="email"
            type="email"
            required
            value={formValues.email}
            onChange={handleChange("email")}
            className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800">Rol</label>
          <select
            name="role"
            required
            value={formValues.role}
            onChange={handleChange("role")}
            className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
          >
            {/* 🔹 sin opción por defecto, solo placeholder deshabilitado */}
            <option value="" disabled>
              Selecciona un rol
            </option>
            <option value="ADMIN">Administrador</option>
            <option value="GESTOR">Gestor</option>
            <option value="SEGURIDAD">Seguridad</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800">
            Contraseña temporal
          </label>
          <input
            name="password"
            type="password"
            required
            value={formValues.password}
            onChange={handleChange("password")}
            className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
            placeholder="Generada o definida por ti"
          />
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="primary"
            size="sm"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!isValid}
          >
            Crear usuario
          </Button>
        </div>
      </form>
    </section>
  );
}
