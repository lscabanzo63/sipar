// app/(protected)/layout.tsx (o donde tengas este layout)
"use client";

import React from "react";
import { useRouter } from "next/navigation";

import AsideBar from "@/components/shared/AsideBar";
import NavBar from "@/components/shared/NavBar";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { getNavItemsFor, type UserRole } from "@/lib/utils/nav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const role: UserRole = sessionStorage.getItem("rol") as UserRole || "invitado";
  const navItems = getNavItemsFor(role);
  const name = sessionStorage.getItem("name") || "Usuario";
  const [authChecked, setAuthChecked] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const token = sessionStorage.getItem("access_token");
    const userId = sessionStorage.getItem("id_usuario");

    if (!token || !userId) {
      router.replace("/login");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }

    setAuthChecked(true);
  }, [router]);

  // Mientras se verifica la sesión
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-600">Verificando sesión…</p>
      </div>
    );
  }

  // Si no está autenticado, no mostramos nada (ya se redirigió)
  if (!isAuthenticated) {
    return null;
  }

  // Si pasó la validación, render normal del layout protegido
  return (
    <>
      <div
        className="
          grid min-h-screen
          grid-cols-1
          lg:grid-cols-[auto_1fr]
          grid-rows-[auto_auto_minmax(0,1fr)]
        "
      >
        {/* ASIDE (oculto en mobile) */}
        <aside className="hidden lg:block lg:col-[1] lg:row-[1/-1]">
          <AsideBar user={{ name: name, role: role }} />
        </aside>

        {/* HEADER */}
        <header className="col-[1] lg:col-[2] row-[1] ">
          <Header userName={name} />
        </header>

        {/* NAVBAR */}
        <nav className="col-[1] lg:col-[2] row-[2] z-10">
          <NavBar items={navItems} />
        </nav>

        {/* MAIN */}
        <main className="col-[1] lg:col-[2] row-[3] ">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      <Footer />
    </>
  );
}
