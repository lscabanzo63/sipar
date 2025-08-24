import Header from "@/components/shared/Header";
import NavBar from "@/components/shared/NavBar";
import Sidebar from "@/components/shared/AsideBar";
import { getNavItemsFor, type UserRole } from "@/lib/utils/nav";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const userName = "Santiago";
  const role: UserRole = "admin"; // Aquí podrías obtener el rol real del usuario
  const navItems = getNavItemsFor(role);

 return (
    <>
      <Header userName="Santiago" />
      <NavBar items={navItems} />

      {/* Layout con sidebar a la izquierda */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-6">
          <Sidebar user={{ name: `${userName}`, role: "Celadora" }} />
          <main className="flex-1 py-8">{children}</main>
        </div>
      </div>
    </>
  );
}
