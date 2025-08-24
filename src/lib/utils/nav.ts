// src/lib/utils/nav.ts

export type UserRole =
  | "admin"
  | "operador"
  | "seguridad"
  | "propietario";

export type NavItem = {
  label: string;   // Texto visible (SORTEOS, etc.)
  path: string;    // Ruta a la que navega
  exact?: boolean; // Si quieres marcar activo solo cuando coincide exacto
};

// Catálogo base de módulos (para no repetir paths)
const MODULES = {
  sorteos:        { label: "SORTEOS", path: "/mainpage/sorteos", exact: true },
  reporteSorteos: { label: "REPORTE DE SORTEOS", path: "/mainpage/sorteos/reportes" },
  propietarios:   { label: "ADMINISTRACION DE PROPIETARIOS", path: "/mainpage/propietarios" },
  seguridadAdm:   { label: "SEGURIDAD ADMINISTRATIVA", path: "/mainpage/seguridad" },
} as const;


// Config por rol: qué módulos aparecen y en qué orden
const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  admin: [
    MODULES.sorteos,
    MODULES.reporteSorteos,
    MODULES.propietarios,
    MODULES.seguridadAdm,
  ],
  operador: [
    MODULES.sorteos,
    MODULES.reporteSorteos,
  ],
  seguridad: [
    MODULES.seguridadAdm,
  ],
  propietario: [
    MODULES.propietarios,
  ],
};

export function getNavItemsFor(role: UserRole): NavItem[] {
  return NAV_CONFIG[role] ?? [];
}
