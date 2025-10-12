// src/lib/api/setup.ts
// (Si ya tienes este archivo con el GET, puedes añadir estas exportaciones;
// o reemplazar por este contenido unificado.)

export type InitialConfigResponse = {
  email: string;
  nombre_conjunto: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  cantidad_parqueaderos: number;
};

export type PatchInitialConfigPayload = {
  id_conjunto: number;
  email: string;
  nombre_conjunto: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  cantidad_parqueaderos: number;
};

export type PatchInitialConfigResponse = {
  status: "ok" | "error";
  message: string;
  errors: unknown | null;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const WITH_CREDENTIALS = true;

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { detail?: unknown; error?: string };
    if (typeof data.detail === "string") return data.detail;
    if (data.error) return data.error;
    return JSON.stringify(data.detail ?? data);
  } catch {
    return await res.text();
  }
}

/* ========== GET /setup/initial (por si no lo tenías) ========== */
export async function getInitialConfig(params: {
  id_conjunto: number;
  id_usuario: number;
}): Promise<InitialConfigResponse> {
  const qs = new URLSearchParams({
    id_conjunto: String(params.id_conjunto),
    id_usuario: String(params.id_usuario),
  });

  const res = await fetch(`${BASE_URL}/setup/initial?${qs.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: WITH_CREDENTIALS ? "include" : "same-origin",
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`${res.status} ${await readError(res)}`);
  return (await res.json()) as InitialConfigResponse;
}

export function getInitialConfigFromSession() {
  if (typeof window === "undefined") {
    throw new Error("Only available on client side");
  }
  const idConjunto = sessionStorage.getItem("conjunto_residencial_id");
  const idUsuario = sessionStorage.getItem("id_usuario");

  if (!idConjunto || !idUsuario) {
    throw new Error("Missing ids in session");
  }
  return getInitialConfig({
    id_conjunto: Number(idConjunto),
    id_usuario: Number(idUsuario),
  });
}

/* ========== PATCH /setup/initial ========== */
export async function patchInitialConfig(
  payload: PatchInitialConfigPayload
): Promise<PatchInitialConfigResponse> {
  const res = await fetch(`${BASE_URL}/setup/initial`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: WITH_CREDENTIALS ? "include" : "same-origin",
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${await readError(res)}`);
  }
  return (await res.json()) as PatchInitialConfigResponse;
}

/**
 * Helper para construir y enviar el PATCH leyendo id_conjunto de sessionStorage.
 * Úsalo desde componentes "use client".
 */
export function patchInitialConfigFromSession(input: {
  email: string;
  nombre_conjunto: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  cantidad_parqueaderos: string | number; // aceptamos string del form
}) {
  if (typeof window === "undefined") {
    throw new Error("Only available on client side");
  }
  const idConjunto = sessionStorage.getItem("conjunto_residencial_id");
  if (!idConjunto) {
    throw new Error("Missing id_conjunto in session");
  }

  const cantidad = Number(input.cantidad_parqueaderos);
  return patchInitialConfig({
    id_conjunto: Number(idConjunto),
    email: input.email ?? "",
    nombre_conjunto: input.nombre_conjunto ?? "",
    ciudad: input.ciudad ?? "",
    direccion: input.direccion ?? "",
    telefono: input.telefono ?? "",
    cantidad_parqueaderos: Number.isFinite(cantidad) ? cantidad : 0,
  });
}
