"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

type ConjuntoData = {
  nombre: string;
  direccion: string;
  numero_torres: string;
  numero_apartamentos: string;
  ciudad: string;
  email_conjunto: string;
  telefono_conjunto: string;
  numero_parqueaderos: string;
};

type AdminData = {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  documento: string;
};

type CreateAdminProps = {
  onCreate: (payload: { conjunto: ConjuntoData; admin: AdminData }) => void;
};

export default function CreateAdmin({ onCreate }: CreateAdminProps) {
  // ====== estado conjunto ======
  const [conjunto, setConjunto] = useState<ConjuntoData>({
    nombre: "",
    direccion: "",
    numero_torres: "",
    numero_apartamentos: "",
    ciudad: "",
    email_conjunto: "",
    telefono_conjunto: "",
    numero_parqueaderos: "",
  });

  // ====== estado admin ======
  const [admin, setAdmin] = useState<AdminData>({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    documento: "",
  });

  const [isValid, setIsValid] = useState(false);

  // Validación global para habilitar/deshabilitar botón
  useEffect(() => {
    const allConjuntoFilled = Object.values(conjunto).every(
      (v) => v.trim().length > 0
    );
    const allAdminFilled = Object.values(admin).every(
      (v) => v.trim().length > 0
    );
    setIsValid(allConjuntoFilled && allAdminFilled);
  }, [conjunto, admin]);

  const handleConjuntoChange =
    (field: keyof ConjuntoData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConjunto((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleAdminChange =
    (field: keyof AdminData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAdmin((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onCreate({
      conjunto,
      admin,
    });

    // reset formulario
    setConjunto({
      nombre: "",
      direccion: "",
      numero_torres: "",
      numero_apartamentos: "",
      ciudad: "",
      email_conjunto: "",
      telefono_conjunto: "",
      numero_parqueaderos: "",
    });
    setAdmin({
      nombres: "",
      apellidos: "",
      email: "",
      telefono: "",
      documento: "",
    });
  };

  const handleCancel = () => {
    setConjunto({
      nombre: "",
      direccion: "",
      numero_torres: "",
      numero_apartamentos: "",
      ciudad: "",
      email_conjunto: "",
      telefono_conjunto: "",
      numero_parqueaderos: "",
    });
    setAdmin({
      nombres: "",
      apellidos: "",
      email: "",
      telefono: "",
      documento: "",
    });
  };

  return (
    <section className="bg-white rounded-2xl shadow-md p-8 space-y-6 w-full">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Agregar nuevo administrador
        </h2>
        <p className="text-sm text-neutral-500">
          Registra la información del conjunto y del administrador que tendrá acceso al sistema.
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* ========== INFORMACIÓN DEL CONJUNTO ========== */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-800">
            Información del conjunto
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1">
                Nombre del conjunto
              </label>
              <input
                type="text"
                className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                placeholder="Ej. Conjunto Residencial Indigo"
                value={conjunto.nombre}
                onChange={handleConjuntoChange("nombre")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1">
                Dirección
              </label>
              <input
                type="text"
                className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                placeholder="Ej. Calle 123 #45-67"
                value={conjunto.direccion}
                onChange={handleConjuntoChange("direccion")}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-1">
                  Número de torres
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                  value={conjunto.numero_torres}
                  onChange={handleConjuntoChange("numero_torres")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-1">
                  Número de apartamentos
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                  value={conjunto.numero_apartamentos}
                  onChange={handleConjuntoChange("numero_apartamentos")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-1">
                  Número de parqueaderos
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                  value={conjunto.numero_parqueaderos}
                  onChange={handleConjuntoChange("numero_parqueaderos")}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                  placeholder="Ej. Bogotá"
                  value={conjunto.ciudad}
                  onChange={handleConjuntoChange("ciudad")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-800 mb-1">
                  Correo del conjunto
                </label>
                <input
                  type="email"
                  className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                  placeholder="correo@conjunto.com"
                  value={conjunto.email_conjunto}
                  onChange={handleConjuntoChange("email_conjunto")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1">
                Teléfono del conjunto
              </label>
              <input
                type="text"
                className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                placeholder="Número de contacto"
                value={conjunto.telefono_conjunto}
                onChange={handleConjuntoChange("telefono_conjunto")}
                required
              />
            </div>
          </div>
        </div>

        {/* ========== INFORMACIÓN DEL ADMINISTRADOR ========== */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-800">
            Información del administrador
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1">
                Nombres
              </label>
              <input
                type="text"
                className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                placeholder="Ej. Juan Carlos"
                value={admin.nombres}
                onChange={handleAdminChange("nombres")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1">
                Apellidos
              </label>
              <input
                type="text"
                className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                placeholder="Ej. Ramírez López"
                value={admin.apellidos}
                onChange={handleAdminChange("apellidos")}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
              placeholder="correo@ejemplo.com"
              value={admin.email}
              onChange={handleAdminChange("email")}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                placeholder="Número de contacto"
                value={admin.telefono}
                onChange={handleAdminChange("telefono")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1">
                Documento
              </label>
              <input
                type="text"
                className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                placeholder="CC / DNI / identificación"
                value={admin.documento}
                onChange={handleAdminChange("documento")}
                required
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>

          <Button type="submit" variant="primary" disabled={!isValid}>
            Crear administrador
          </Button>
        </div>
      </form>
    </section>
  );
}
