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
    <section className="bg-white rounded-2xl shadow-md px-6 py-5">
      <header className="flex items-center justify-between mb-4 gap-3">
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
            onClick={onRefresh}
            className="px-3 py-1.5 text-[11px] border border-purple-200 text-purple-800 hover:bg-purple-50 disabled:opacity-60"
          >
            {loadingList ? "Actualizando..." : "Listar usuarios"}
          </Button>
        </div>
      </header>

      <div className="border border-neutral-200 rounded-xl overflow-hidden">
        {/* Scroll interno */}
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="bg-neutral-50 text-neutral-600 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Nombre</th>
                <th className="px-4 py-2 text-left font-medium">Correo</th>
                <th className="px-4 py-2 text-left font-medium">Estado</th>
                <th className="px-4 py-2 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
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
                    <StatusBadge active={admin.active} />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        onClick={() => onEdit(admin)}
                        className="px-3 py-1.5 text-[11px] border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                      >
                        Editar
                      </Button>

                      <Button
                        type="button"
                        onClick={() => onToggleActive(admin)}
                        className={`px-3 py-1.5 text-[11px] font-medium ${
                          admin.active
                            ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        }`}
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
