// src/lib/utils/nav.ts

export type UserRole =
  | "administrador"
  | "gestor";

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
  gestorUsers:   { label: "GESTION DE USUARIOS", path: "/gestor_mainpage"}
} as const;



const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  administrador: [
    MODULES.sorteos,
    MODULES.reporteSorteos,
    MODULES.propietarios,
    MODULES.seguridadAdm,
  ],
  gestor: [
    MODULES.gestorUsers,
  ],
  
};

export function getNavItemsFor(role: UserRole): NavItem[] {
  return NAV_CONFIG[role] ?? [];
}
