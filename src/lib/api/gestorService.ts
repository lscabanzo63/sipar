// src/lib/api/gestorService.ts

export interface AdminListItem {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  conjunto: string;
  estado: boolean;
}

/** Payload para creación del conjunto */
export interface ConjuntoPayload {
  nombre: string;
  direccion: string;
  numero_torres: number;
  numero_apartamentos: number;
  ciudad: string;
  email_conjunto: string;
  telefono_conjunto: string;
  numero_parqueaderos: number;
}

/** Payload para creación del administrador */
export interface AdminPayload {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  documento: string;
}

/** Payload completo del POST */
export interface CreateAdminPayload {
  conjunto: ConjuntoPayload;
  admin: AdminPayload;
}

/** Payload para modificar admin */
export interface UpdateAdminPayload {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  documento: string;
}

/** Errores 422 */
export interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}
export interface ValidationErrorResponse {
  detail: ValidationErrorItem[];
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const WITH_CREDENTIALS = true;

/** Lee mensaje de error de backend */
async function readError(res: Response): Promise<string> {
  try {
    const data: unknown = await res.json();

    if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>;

      if (typeof obj.detail === "string") return obj.detail;
      if (typeof obj.error === "string") return obj.error;

      if (Array.isArray(obj.detail)) {
        const validation = obj.detail as ValidationErrorItem[];
        return validation.map((e) => `${e.msg} (${e.loc.join(".")})`).join("; ");
      }

      return JSON.stringify(obj);
    }

    return String(data);
  } catch {
    return await res.text();
  }
}

/** Lee token desde sessionStorage */
function getAuthToken(): string {
  if (typeof window === "undefined") {
    throw new Error("Solo disponible en cliente");
  }

  const token = sessionStorage.getItem("access_token");
  if (!token) {
    throw new Error("No se encontró token de autenticación");
  }

  return token;
}

/* ======================================
 * GET — listar administradores
 * ====================================== */
export async function listAdmins(): Promise<AdminListItem[]> {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}/api/v1/gestion/admins`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: WITH_CREDENTIALS ? "include" : "same-origin",
    cache: "no-store",
  });

  if (!res.ok) {
    const message = await readError(res);
    throw new Error(`${res.status} ${message}`);
  }

  return (await res.json()) as AdminListItem[];
}

/* ======================================
 * POST — crear admin + conjunto
 * ====================================== */
export async function createAdmin(
  payload: CreateAdminPayload
): Promise<string> {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}/api/v1/gestion/admins`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: WITH_CREDENTIALS ? "include" : "same-origin",
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await readError(res);
    throw new Error(`${res.status} ${message}`);
  }

  return (await res.json()) as string;
}

/* ======================================
 * PATCH — modificar admin
 * ====================================== */
export async function updateAdmin(params: {
  id_usuario: number;
  payload: UpdateAdminPayload;
}): Promise<string> {
  const { id_usuario, payload } = params;
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}/api/v1/gestion/admins/${id_usuario}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: WITH_CREDENTIALS ? "include" : "same-origin",
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await readError(res);
    throw new Error(`${res.status} ${message}`);
  }

  return (await res.json()) as string;
}

/* ======================================
 * PATCH — cambiar estado del admin
 * ====================================== */

export type AdminEstadoAccion = "Bloqueo" | "Desbloqueo";

export async function changeAdminEstado(params: {
  id_usuario: number;
  accion: AdminEstadoAccion;
}): Promise<string> {
  const { id_usuario, accion } = params;
  const token = getAuthToken();

  const res = await fetch(
    `${BASE_URL}/api/v1/gestion/admins/${id_usuario}/estado`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: WITH_CREDENTIALS ? "include" : "same-origin",
      cache: "no-store",
      body: JSON.stringify({ accion }),
    }
  );

  if (!res.ok) {
    const message = await readError(res);
    throw new Error(`${res.status} ${message}`);
  }

  return (await res.json()) as string;
}
