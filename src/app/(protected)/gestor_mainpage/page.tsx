"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt?: string;
};

export default function MainPage() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        // 👉 Ajusta esta URL a tu backend real
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/gestion/admins`
        );

        if (!res.ok) {
          throw new Error("No se pudo cargar la lista de administradores");
        }

        const data: AdminUser[] = await res.json();
        setAdmins(data);
      } catch (error) {
        console.error(error);
        // aquí podrías mostrar un toast o alerta
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: llamar a tu endpoint para crear administrador
    console.log("Crear nuevo usuario");
  };

  return (
    <>
      <Spinner
        variant="overlay"
        open={loading}
        text="Cargando información..."
        size="md"
        backdropOpacity={60}
        blur
      />

      {!loading && (
        <main className="w-full flex justify-center px-6 py-10">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* LISTADO DE ADMINISTRADORES */}
            <section className="bg-white rounded-2xl shadow-md px-6 py-5">
              <header className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Administradores registrados
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Gestiona los usuarios con rol administrador del conjunto.
                  </p>
                </div>
                <span className="text-sm text-neutral-600">
                  Total:{" "}
                  <span className="font-semibold">
                    {admins.length}
                  </span>
                </span>
              </header>

              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 text-neutral-600">
                    <tr>
                      <th className="px-4 py-2 text-left">Nombre</th>
                      <th className="px-4 py-2 text-left">Correo</th>
                      <th className="px-4 py-2 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-6 text-center text-neutral-500"
                        >
                          No hay administradores registrados aún.
                        </td>
                      </tr>
                    )}

                    {admins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="border-t border-neutral-100 hover:bg-neutral-50"
                      >
                        <td className="px-4 py-2 text-neutral-900">
                          {admin.name}
                        </td>
                        <td className="px-4 py-2 text-neutral-700">
                          {admin.email}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              admin.active
                                ? "bg-green-100 text-green-700"
                                : "bg-neutral-200 text-neutral-700"
                            }`}
                          >
                            {admin.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* FORMULARIO PARA AGREGAR USUARIO */}
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
                    type="text"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                    placeholder="Ej. Juan Pérez"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-800">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-800">
                    Rol
                  </label>
                  <select
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                    defaultValue=""
                    required
                  >
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
                    type="password"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                    placeholder="Generada o definida por ti"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-medium rounded-lg bg-purple-800 text-white hover:bg-purple-900 transition"
                  >
                    Crear usuario
                  </button>
                </div>
              </form>
            </section>
          </div>
        </main>
      )}
    </>
  );
}



