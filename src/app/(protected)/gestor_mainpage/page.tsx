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
  const [loading, setLoading] = useState(true);          // overlay inicial
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingList, setLoadingList] = useState(false); // spinner del botón "Listar usuarios"

  // ===========================
  // CARGA DE ADMINISTRADORES
  // ===========================
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

  // Cargar lista al montar la página
  useEffect(() => {
    fetchAdmins();
  }, []);

  // ===========================
  // HANDLERS DEL CRUD
  // ===========================

  // Crear administrador desde el formulario
  const handleCreate = async (payload: {
    conjunto: {
      nombre: string;
      direccion: string;
      numero_torres: string;
      numero_apartamentos: string;
      ciudad: string;
      email_conjunto: string;
      telefono_conjunto: string;
      numero_parqueaderos: string;
    };
    admin: {
      nombres: string;
      apellidos: string;
      email: string;
      telefono: string;
      documento: string;
    };
  }) => {
    console.log("Crear administrador (mock por ahora):", payload);

    const { conjunto, admin } = payload;

    // Por ahora solo actualizamos en memoria.
    // Cuando tengas endpoint de creación, lo llamas aquí y luego haces fetchAdmins().
    const newAdmin: AdminUser = {
      id: (admins.length + 1).toString(),
      name: `${admin.nombres} ${admin.apellidos}`,
      email: admin.email,
      conjunto: conjunto.nombre,
      active: true,
    };

    setAdmins((prev) => [newAdmin, ...prev]);
  };

  // Actualizar fila editada en la tabla (edición inline)
  const handleUpdateRow = async (updated: AdminUser) => {
    console.log("Actualizar administrador (mock por ahora):", updated);

    // Aquí después llamas a updateAdmin en backend; por ahora solo actualizamos estado local.
    setAdmins((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  // Bloquear / Desbloquear administrador
  const handleToggleActive = async (admin: AdminUser) => {
    try {
      const accion: AdminEstadoAccion = admin.active
        ? "Bloqueo"
        : "Desbloqueo";

      await changeAdminEstado({
        id_usuario: Number(admin.id),
        accion,
      });

      // Después de cambiar el estado en backend, recargamos la lista para tener data fresca
      await fetchAdmins();
    } catch (error) {
      console.error("Error cambiando estado del admin:", error);
      // Aquí luego puedes disparar un toast de error
    }
  };

  // ===========================
  // RENDER
  // ===========================

  return (
    <>
      <Spinner
        variant="overlay"
        open={loading}
        text="Cargando módulo del Gestor"
        backdropOpacity={60}
        blur
      />

      {!loading && (
        <main className="w-full flex justify-center px-6 py-10">
          <div className="w-full max-w-6xl flex flex-col gap-10">
            {/* Formulario de creación de administrador + conjunto */}
            <CreateAdmin onCreate={handleCreate} />

            {/* Tabla de administradores con edición inline */}
            <AdminListCard
              admins={admins}
              loadingList={loadingList}
              onRefresh={fetchAdmins}
              onUpdate={handleUpdateRow}
              onToggleActive={handleToggleActive}
            />
          </div>
        </main>
      )}
    </>
  );
}
