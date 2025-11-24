// src/lib/api/getSorteoConfiguracion.ts

export type Periodicidad = "TRIMESTRAL" | "CUATRIMESTRAL" | "SEMESTRAL";

export type ReglaTipo =
  | "PRIORIDAD_PROPIETARIO"
  | "PAGO_ADMINISTRACION"
  | "ROTACION";

/** Respuesta exitosa (200 OK) */
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
 * GET /api/v1/conjuntos/{id_conjunto}/sorteos/
 * Obtiene la configuración del sorteo para un conjunto.
 */
export async function getSorteoConfiguracion(params: {
  id_conjunto: number;
}): Promise<ConfiguracionResponse> {
  const { id_conjunto } = params;

  const res = await fetch(
    `${BASE_URL}/api/v1/conjuntos/${id_conjunto}/sorteos/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: WITH_CREDENTIALS ? "include" : "same-origin",
      cache: "no-store",
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
 * Conveniencia: usa el id_conjunto guardado en sessionStorage
 * y ejecuta el GET para traer la configuración.
 * (Solo disponible en componentes "use client")
 */
export async function getSorteoConfiguracionFromSession(): Promise<ConfiguracionResponse> {
  if (typeof window === "undefined") {
    throw new Error("Solo disponible en cliente");
  }

  const idConjunto = sessionStorage.getItem("conjunto_residencial_id");
  if (!idConjunto) {
    throw new Error("Falta conjunto_residencial_id en la sesión");
  }

  return getSorteoConfiguracion({ id_conjunto: Number(idConjunto) });
}
