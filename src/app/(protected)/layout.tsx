// src/app/(protected)/layout.tsx
import AsideBar from "@/components/shared/AsideBar";
import NavBar from "@/components/shared/NavBar";
import Header from "@/components/shared/Header";
import { getNavItemsFor, type UserRole } from "@/lib/utils/nav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const role: UserRole = "admin";
  const navItems = getNavItemsFor(role);

  return (
    <div
      className="
        grid min-h-screen
        grid-cols-1
        lg:grid-cols-[auto_1fr]             
        grid-rows-[auto_auto_minmax(0,1fr)] 
      "
    >
      {/* ASIDE (oculto en mobile) */}
      <aside className="hidden lg:block lg:col-[1] lg:row-[1/-1] bg-white">
        <AsideBar user={{ name: "Santiago Cabanzo", role: role }} />
      </aside>

      {/* HEADER */}
      <header className="col-[1] lg:col-[2] row-[1] ">
        <Header userName="Santiago" />
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
  );
}
