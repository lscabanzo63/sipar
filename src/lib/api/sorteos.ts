// src/lib/api/sorteos.ts

export type Periodicidad = "TRIMESTRAL" | "CUATRIMESTRAL" | "SEMESTRAL";

export type ReglaTipo =
  | "PRIORIDAD_PROPIETARIO"
  | "PAGO_ADMINISTRACION"
  | "ROTACION";

/** Payload esperado por el backend */
export interface ConfiguracionPayload {
  periodicidad: Periodicidad;
  /** Fecha en formato ISO sin zona horaria (ej: "2026-01-15T00:00:00") */
  fecha_inicio: string;
  normas: Array<{
    tipo: ReglaTipo;
    activa: boolean;
    parametros?: { n: number };
  }>;
}

/** Respuesta exitosa (201 Created) */
export interface ConfiguracionResponse {
  conjunto_id: number;
  fechas_programadas: string[];
  id_sorteo: number;
  periodicidad: Periodicidad;
  reglas_asignadas: Array<{
    tipo: ReglaTipo;
    parametros?: { n: number };
  }>;
  sequence_id: number;
}

/** Respuesta de error 422 ValidationError */
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

/**
 * Intenta leer un mensaje de error de la respuesta HTTP.
 */
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

/**
 * POST /api/v1/conjuntos/{id_conjunto}/sorteos/configuracion
 * Crea o actualiza la configuración del sorteo (upsert).
 */
export async function upsertSorteoConfiguracion(params: {
  id_conjunto: number;
  payload: ConfiguracionPayload;
}): Promise<ConfiguracionResponse> {
  const { id_conjunto, payload } = params;

  const token = sessionStorage.getItem("access_token");
  if (!token) {
    throw new Error("No se encontró token de autenticación en sessionStorage");
  }

  const res = await fetch(
    `${BASE_URL}/api/v1/conjuntos/${id_conjunto}/sorteos/configuracion`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: WITH_CREDENTIALS ? "include" : "same-origin",
      cache: "no-store",
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const message = await readError(res);
    throw new Error(`${res.status} ${message}`);
  }

  const data = (await res.json()) as ConfiguracionResponse;
  return data;
}

/**
 * Conveniencia para el cliente:
 * Usa el id_conjunto guardado en sessionStorage y ejecuta el upsert.
 * (Solo disponible en componentes "use client")
 */
export async function upsertSorteoConfiguracionFromSession(
  payload: ConfiguracionPayload
): Promise<ConfiguracionResponse> {
  if (typeof window === "undefined") {
    throw new Error("Solo disponible en cliente");
  }

  const idConjunto = sessionStorage.getItem("conjunto_residencial_id");
  if (!idConjunto) {
    throw new Error("Falta conjunto_residencial_id en la sesión");
  }

  return upsertSorteoConfiguracion({
    id_conjunto: Number(idConjunto),
    payload,
  });
}

/**
 * Utilidad para formatear fechas a ISO local sin 'Z'
 */
export function toNaiveLocalISO(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}
