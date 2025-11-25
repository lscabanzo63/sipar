"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import CreateAdmin from "@/components/ui/CreateAdmin";
import AdminListCard, { AdminUser } from "@/components/ui/AdminListCard";

// ===============================
// MOCK TEMPORAL para pruebas visuales
// ===============================
const MOCK_ADMINS: AdminUser[] = Array.from({ length: 25 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Administrador ${i + 1}`,
  email: `admin${i + 1}@conjunto.com`,
  conjunto:
    i % 3 === 0
      ? "Conjunto Residencial Indigo"
      : i % 3 === 1
      ? "Conjunto Los Almendros"
      : "Conjunto Torres del Parque",
  active: i % 4 !== 0, // algunos bloqueados
}));

// ===============================
// PAGE COMPONENT
// ===============================

export default function GestorMainPage() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Simula carga inicial
  const fetchAdmins = async () => {
    setLoadingList(true);
    await new Promise((res) => setTimeout(res, 500)); // pequeño delay
    setAdmins(MOCK_ADMINS);
    setLoading(false);
    setLoadingList(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ===========================
  // HANDLERS DEL CRUD FAKE
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
      conjunto: "Conjunto Residencial Indigo", // valor fijo por mock
      active: true,
    };

    // prepend
    setAdmins((prev) => [newAdmin, ...prev]);
  };

  const handleEdit = (admin: AdminUser) => {
    console.log("Editar usuario:", admin);
    // Más adelante generamos modal de edición
  };

  const handleToggleActive = async (admin: AdminUser) => {
    console.log("Toggle activo:", admin);

    setAdmins((prev) =>
      prev.map((a) =>
        a.id === admin.id ? { ...a, active: !a.active } : a
      )
    );
  };

  // ===========================
  // RENDER PAGE
  // ===========================

  return (
    <>
      {/* Overlay loading */}
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
            
            {/* FORMULARIO DE CREACIÓN */}
            <CreateAdmin onSubmit={handleCreate} />

            {/* TABLA DE ADMINISTRADORES */}
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
