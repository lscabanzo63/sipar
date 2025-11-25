"use client";

import { Button } from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  active: boolean;
};

type Props = {
  admins: AdminUser[];
  loadingList: boolean;
  onRefresh: () => void;
  onEdit: (admin: AdminUser) => void;
  onToggleActive: (admin: AdminUser) => void;
};

export default function AdminListCard({
  admins,
  loadingList,
  onRefresh,
  onEdit,
  onToggleActive,
}: Props) {
  return (
    <section className="space-y-3">
      {/* Título arriba, fuera del card */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Administradores registrados
          </h2>
          <p className="text-[11px] text-neutral-500">
            Gestiona los usuarios con rol administrador del conjunto.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-600">
            Total: <span className="font-semibold">{admins.length}</span>
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="text-[11px] px-3 py-1.5"
            disabled={loadingList}
          >
            {loadingList ? "Actualizando..." : "Listar usuarios"}
          </Button>
        </div>
      </div>

      {/* Card de tabla estilo morado */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header morado de la tabla */}
        <div className="bg-brand text-white">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left font-semibold">ID</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left font-semibold">
                  Correo
                </th>
                <th className="px-6 py-3 text-left font-semibold">
                  Estado
                </th>
                <th className="px-6 py-3 text-right font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Cuerpo con scroll si hay muchos datos */}
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-xs">
            <tbody>
              {admins.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-center text-neutral-500"
                  >
                    No hay administradores registrados aún.
                  </td>
                </tr>
              )}

              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-t border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="px-6 py-3 text-neutral-900">
                    {admin.id}
                  </td>
                  <td className="px-6 py-3 text-neutral-900">
                    {admin.name}
                  </td>
                  <td className="px-6 py-3 text-neutral-700">
                    {admin.email}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge active={admin.active} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => onEdit(admin)}
                        className="text-[11px] px-3 py-1.5"
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => onToggleActive(admin)}
                        className="text-[11px] px-3 py-1.5"
                      >
                        {admin.active ? "Bloquear" : "Desbloquear"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
