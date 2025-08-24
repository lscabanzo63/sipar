import Header from "@/components/shared/Header";
import NavBar from "@/components/shared/NavBar";
import { getNavItemsFor, type UserRole } from "@/lib/utils/nav";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const userName = "Santiago";
  const role: UserRole = "admin"; // Aquí podrías obtener el rol real del usuario
  const navItems = getNavItemsFor(role);

  return (
    <>
      <Header userName={userName} />
      <NavBar items={navItems} />
      <main>{children}</main>
    </>
  );
}
