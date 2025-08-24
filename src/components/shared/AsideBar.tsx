"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

type SidebarItem = {
  label: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
};

type Props = {
  user?: { name: string; role?: string; avatarUrl?: string };
  items?: SidebarItem[];
};

const MAIN_ITEMS: SidebarItem[] = [
  { label: "Perfil", href: "/mainpage/perfil", icon: UserCircleIcon },
  { label: "Notificaciones", href: "/mainpage/notificaciones", icon: BellIcon },
  { label: "Pendientes", href: "/mainpage/pendientes", icon: ClipboardDocumentCheckIcon },
];

export default function AsideBar({ user, items = MAIN_ITEMS }: Props) {
  const pathname = usePathname();

  return (
   <aside className="w-fit bg-white hidden lg:block h-full">
    <div
      className="
        h-full
        grid grid-rows-[1fr_auto_1fr_auto]   /* ↑ espacio | bloque centrado | espacio | acciones */
        justify-items-center
        px-6
      "
    >
      {/* 1) ESPACIO SUPERIOR (1fr) */}
      <div />

      {/* 2) BLOQUE CENTRADO: Foto → Nombre/Rol → Menú (hasta Pendientes) */}
      <div className="w-full max-w-[220px]">
        {/* Foto */}
        <div className="mx-auto h-24 w-24 rounded-full overflow-hidden ring-1 ring-neutral-200">
          <Image
            src="/prueba.jpg"
            alt={`${user?.name}`}
            className="w-40 h-auto"
            width={96}
            height={96}
          />
        </div>

        {/* Nombre / rol */}
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-neutral-900 leading-tight">
            {user?.name ?? "Usuario"}
          </p>
          <p className="text-sm text-neutral-500">{user?.role ?? "Rol"}</p>
        </div>

        {/* Menú principal (incluye Perfil, Notificaciones, Pendientes) */}
        <nav className="mt-6 w-full">
          <ul className="space-y-5">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname?.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      "group flex items-center gap-4 px-2",
                      "text-base font-medium",
                      active ? "text-brand" : "text-neutral-800 hover:text-brand",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-6 w-6",
                        active ? "text-brand" : "text-neutral-700 group-hover:text-brand",
                      ].join(" ")}
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* 3) ESPACIO INFERIOR (1fr) */}
      <div />

      {/* 4) ACCIONES ancladas abajo */}
      <div className="w-full pb-8 space-y-6">
        <Link
          href="/mainpage/configuracion"
          className="flex items-center gap-4 text-neutral-700 hover:text-brand px-2"
        >
          <Cog6ToothIcon className="h-6 w-6" />
          <span>Configuración</span>
        </Link>

        <button
          type="button"
          className="flex items-center gap-4 text-neutral-700 hover:text-red-500 px-2"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  </aside>
  );
}
