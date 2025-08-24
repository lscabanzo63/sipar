"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

// Heroicons (outline)
import {
  BellIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

type SidebarItem = {
  label: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
};

type SidebarProps = {
  user?: {
    name: string;
    role?: string;
    avatarUrl?: string;
  };
  items?: SidebarItem[];
};

const DEFAULT_ITEMS: SidebarItem[] = [
  { label: "Notificaciones",href: "/mainpage/notificaciones",      icon: BellIcon },
  { label: "Pendientes",    href: "/mainpage/pendientes",          icon: ClipboardDocumentCheckIcon },
  { label: "Perfil",        href: "/mainpage/perfil",              icon: UserCircleIcon },
];

export default function Sidebar({ user, items = DEFAULT_ITEMS }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="
        w-64 shrink-0 bg-white border-r border-neutral-200
        sticky top-0 h-[100dvh] hidden md:flex md:flex-col
      "
    >
      {/* Header usuario */}
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full border border-neutral-200">
            {/* Si no hay avatar, usa un placeholder */}
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={48}
                height={48}
              />
            ) : (
              <div className="h-full w-full bg-neutral-100" />
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-900">
              {user?.name ?? "Usuario"}
            </div>
            <div className="text-xs text-neutral-500">
              {user?.role ?? "Rol"}
            </div>
          </div>
        </div>

        {/* divisor */}
        <div className="mt-5 h-px bg-neutral-200" />
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    active
                      ? "text-brand bg-brand/5"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-brand",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-5 w-5",
                      active ? "text-brand" : "text-neutral-400 group-hover:text-brand",
                    ].join(" ")}
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer opcional del sidebar */}
      <div className="p-4 text-xs text-neutral-400">
        © Indigo
      </div>
    </aside>
  );
}
