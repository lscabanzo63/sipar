// src/lib/api/setup.ts
export type InitialConfigResponse = {
  email: string;
  nombre_conjunto: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  cantidad_parqueaderos: number;
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

/**
 * Llama GET /setup/initial con ?id_conjunto=&id_usuario=
 */
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

/**
 * Conveniencia para cliente: lee ids desde sessionStorage
 * (Úsalo solo en componentes "use client")
 */
export function getInitialConfigFromSession() {
  if (typeof window === "undefined") {
    throw new Error("Solo disponible en cliente");
  }
  const idConjunto = sessionStorage.getItem("conjunto_residencial_id");
  const idUsuario = sessionStorage.getItem("id_usuario");

  if (!idConjunto || !idUsuario) {
    throw new Error("Faltan ids en la sesión");
  }
  return getInitialConfig({
    id_conjunto: Number(idConjunto),
    id_usuario: Number(idUsuario),
  });
}
