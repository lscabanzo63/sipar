"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  conjunto: string;
  active: boolean;
};

type Props = {
  admins: AdminUser[];
  loadingList: boolean;
  onRefresh: () => void;
  onUpdate: (admin: AdminUser) => void;
  onToggleActive: (admin: AdminUser) => void;
};

export default function AdminListCard({
  admins,
  loadingList,
  onRefresh,
  onUpdate,
  onToggleActive,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Pick<AdminUser, "name" | "email" | "conjunto">>({
    name: "",
    email: "",
    conjunto: "",
  });

  const startEdit = (admin: AdminUser) => {
    setEditingId(admin.id);
    setDraft({
      name: admin.name,
      email: admin.email,
      conjunto: admin.conjunto,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleChange =
    (field: keyof typeof draft) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraft((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const saveEdit = (admin: AdminUser) => {
    onUpdate({
      ...admin,
      ...draft,
    });
    setEditingId(null);
  };

  return (
    <section className="space-y-3 w-full">
      {/* Header superior */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Administradores registrados
          </h2>
          <p className="text-sm text-neutral-500">
            Gestiona los usuarios con rol administrador del conjunto.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-600">
            Total: <span className="font-semibold">{admins.length}</span>
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loadingList}
          >
            {loadingList ? "Actualizando..." : "Listar usuarios"}
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-brand text-white z-10">
              <tr>
                <th className="px-4 py-3 font-semibold text-center">ID</th>
                <th className="px-4 py-3 font-semibold text-center">Nombre</th>
                <th className="px-4 py-3 font-semibold text-center">Correo</th>
                <th className="px-4 py-3 font-semibold text-center">Conjunto</th>
                <th className="px-4 py-3 font-semibold text-center">Estado</th>
                <th className="px-4 py-3 font-semibold text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {admins.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-6 text-center text-neutral-500"
                  >
                    No hay administradores registrados aún.
                  </td>
                </tr>
              )}

              {admins.map((admin) => {
                const isEditing = editingId === admin.id;

                return (
                  <tr
                    key={admin.id}
                    className="border-t border-neutral-200 hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3 text-center">{admin.id}</td>

                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input
                          className="w-full rounded-full border border-neutral-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                          value={draft.name}
                          onChange={handleChange("name")}
                        />
                      ) : (
                        admin.name
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input
                          className="w-full rounded-full border border-neutral-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                          value={draft.email}
                          onChange={handleChange("email")}
                        />
                      ) : (
                        <span className="truncate inline-block max-w-[220px]">
                          {admin.email}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input
                          className="w-full rounded-full border border-neutral-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700/70"
                          value={draft.conjunto}
                          onChange={handleChange("conjunto")}
                        />
                      ) : (
                        <span className="truncate inline-block max-w-[260px]">
                          {admin.conjunto}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex justify-center min-w-[120px]">
                        <StatusBadge active={admin.active} />
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-4">
                        {isEditing ? (
                          <>
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              className="min-w-[120px]"
                              onClick={() => saveEdit(admin)}
                            >
                              Guardar
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="min-w-[120px]"
                              onClick={cancelEdit}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              className="min-w-[120px]"
                              onClick={() => startEdit(admin)}
                            >
                              Editar
                            </Button>

                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              className="min-w-[120px]"
                              onClick={() => onToggleActive(admin)}
                            >
                              {admin.active ? "Bloquear" : "Desbloquear"}
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
