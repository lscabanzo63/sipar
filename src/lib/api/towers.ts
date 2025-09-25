// src/lib/api/towers.ts

export type SetupTowersPayload = {
  id_conjunto: number;
  id_usuario: number;
  num_torres: number;
  pisos_x_torre: number;
  aptos_x_piso: number;
  numeracion_automatica: string;
};

export type SetupTowersResponse = string;

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
 * POST /setup/torres
 */
export async function setupTowers(
  payload: SetupTowersPayload
): Promise<SetupTowersResponse> {
  const res = await fetch(`${BASE_URL}/setup/torres`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: WITH_CREDENTIALS ? "include" : "same-origin",
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`${res.status} ${await readError(res)}`);

  // La API documenta un string como respuesta
  const text = await res.text();
  return text as SetupTowersResponse;
}

/**
 * Helper para construir el payload desde sessionStorage.
 * Úsalo SOLO en componentes "use client".
 */
export function setupTowersFromSession(input: {
  num_torres: number | string;
  pisos_x_torre: number | string;
  aptos_x_piso: number | string;
  numeracion_automatica: string;
}) {
  if (typeof window === "undefined") {
    throw new Error("Only available on client side");
  }

  const idConjunto = sessionStorage.getItem("conjunto_residencial_id");
  const idUsuario = sessionStorage.getItem("id_usuario");
  if (!idConjunto || !idUsuario) {
    throw new Error("Missing ids in session");
  }

  const toInt = (v: number | string) => {
    const n = typeof v === "string" ? parseInt(v, 10) : v;
    return Number.isFinite(n) ? n : 0;
  };

  return setupTowers({
    id_conjunto: Number(idConjunto),
    id_usuario: Number(idUsuario),
    num_torres: toInt(input.num_torres),
    pisos_x_torre: toInt(input.pisos_x_torre),
    aptos_x_piso: toInt(input.aptos_x_piso),
    numeracion_automatica: input.numeracion_automatica ?? "",
  });
}
