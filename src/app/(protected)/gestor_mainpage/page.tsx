"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import CreateAdmin from "@/components/ui/CreateAdmin";
import AdminListCard, { AdminUser } from "@/components/ui/AdminListCard";

// ⬇ Servicios de API
import {
  listAdmins,
  changeAdminEstado,
  type AdminEstadoAccion,
} from "@/lib/api/gestorService";

export default function GestorMainPage() {
  const [loading, setLoading] = useState(true); // overlay inicial
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingList, setLoadingList] = useState(false); // spinner del botón "Listar usuarios"

  const fetchAdmins = async () => {
    setLoadingList(true);

    try {
      const apiAdmins = await listAdmins();

      // Ordenar por id ascendente
      apiAdmins.sort((a, b) => a.id_usuario - b.id_usuario);

      const mapped: AdminUser[] = apiAdmins.map((a) => ({
        id: String(a.id_usuario),
        name: `${a.nombres} ${a.apellidos}`,
        email: a.email,
        conjunto: a.conjunto,
        active: a.estado,
      }));

      setAdmins(mapped);
    } catch (error) {
      console.error("Error listando admins:", error);
    } finally {
      setLoading(false);
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ===========================
  // HANDLERS DEL CRUD
  // ===========================

  const handleCreate = async (values: {
    name: string;
    email: string;
    role: string;
    password: string;
  }) => {
    console.log("Crear usuario (mock):", values);

    const newAdmin: AdminUser = {
      id: `${admins.length + 1}`,
      name: values.name,
      email: values.email,
      conjunto: "Conjunto Residencial Indigo",
      active: true,
    };

    setAdmins((prev) => [newAdmin, ...prev]);
  };

  const handleEdit = (admin: AdminUser) => {
    console.log("Editar usuario:", admin);
    // Aquí luego conectamos updateAdmin + modal
  };

  const handleToggleActive = async (admin: AdminUser) => {
    try {
      console.log("Cambiar estado admin:", admin);

      const accion: AdminEstadoAccion = admin.active
        ? "Bloqueo"
        : "Desbloqueo";

      await changeAdminEstado({
        id_usuario: Number(admin.id),
        accion,
      });

      // Después de cambiar el estado en backend, recargamos lista
      await fetchAdmins();
    } catch (error) {
      console.error("Error cambiando estado del admin:", error);
      // Aquí luego se puede agregar un toast de error
    }
  };

  // ===========================
  // RENDER PAGE
  // ===========================

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
          <div className="w-full max-w-6xl flex flex-col gap-10">
            <CreateAdmin onSubmit={handleCreate} />

            <AdminListCard
              admins={admins}
              loadingList={loadingList}
              onRefresh={fetchAdmins}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
            />
          </div>
        </main>
      )}
    </>
  );
}
