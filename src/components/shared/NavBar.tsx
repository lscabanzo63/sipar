"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/utils/nav";

type Props = { items: NavItem[] };

export default function NavBar({ items }: Props) {
  const pathname = usePathname();

  return (
    <nav className="w-full border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-4">
        <ul className="flex items-center gap-6 overflow-x-auto py-4">
          {items.map((item, idx) => {
            const isActive = item.exact
              ? pathname === item.path
              : pathname?.startsWith(item.path);

            return (
              <li key={item.path} className="flex items-center">
                <Link
                href={item.path}
                className={[
                  "relative uppercase tracking-[0.15em] text-sm font-semibold transition-colors",
                  isActive
                    ? "text-brand after:w-full"
                    : "text-neutral-800 hover:text-brand hover:after:w-full",
                  "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 after:w-0",
                ].join(" ")}
              >
                {item.label}
              </Link>

                {/* Separador morado entre items, no al final */}
                {idx < items.length - 1 && (
                  <span
                    aria-hidden
                    className="mx-6 h-6 w-px bg-brand/40"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
