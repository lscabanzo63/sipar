"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import CreateAdmin from "@/components/ui/CreateAdmin";
import AdminListCard, { AdminUser } from "@/components/ui/AdminListCard";

// MOCK TEMPORAL PARA PROBAR
const MOCK_ADMINS: AdminUser[] = Array.from({ length: 25 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Administrador ${i + 1}`,
  email: `admin${i + 1}@conjunto.com`,
  active: i % 3 !== 0,
}));

export default function GestorMainPage() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const fetchAdmins = async () => {
    setLoadingList(true);
    await new Promise((r) => setTimeout(r, 400));
    setAdmins(MOCK_ADMINS);
    setLoading(false);
    setLoadingList(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (values: {
    name: string;
    email: string;
    role: string;
    password: string;
  }) => {
    console.log("Crear admin (mock):", values);

    const newAdmin: AdminUser = {
      id: `${admins.length + 1}`,
      name: values.name,
      email: values.email,
      active: true,
    };

    setAdmins((prev) => [newAdmin, ...prev]);
  };

  const handleEdit = (admin: AdminUser) => {
    console.log("Editar admin (mock):", admin);
  };

  const handleToggleActive = async (admin: AdminUser) => {
    console.log("Toggle activo (mock):", admin);
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === admin.id ? { ...a, active: !a.active } : a
      )
    );
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
          <div className="w-full max-w-6xl flex flex-col gap-8">
            {/* ARRIBA: form de creación */}
            <CreateAdmin onSubmit={handleCreate} />

            {/* ABAJO: tabla de admins */}
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
