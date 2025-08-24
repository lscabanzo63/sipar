// src/lib/utils/nav.ts

export type UserRole =
  | "admin"
  | "operador"
  | "seguridad"
  | "propietario";

export type NavItem = {
  label: string;   
  path: string;    
  exact?: boolean;
};

// Catálogo base de módulos (para no repetir paths)
const MODULES = {
  sorteos:        { label: "SORTEOS", path: "/mainpage/sorteos", exact: true },
  reporteSorteos: { label: "REPORTE DE SORTEOS", path: "/mainpage/reporte-sorteos" },
  propietarios:   { label: "ADMINISTRACION DE RESIDENTES", path: "/mainpage/administracion-residentes" },
  seguridadAdm:   { label: "ADMINISTRACION SEGURIDAD", path: "/mainpage/administracion-seguridad" },
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
