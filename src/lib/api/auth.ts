// Tipos de entrada/salida EXACTOS a tu API
export type LoginInput = {
  email: string;
  contrasena: string; // 👈 clave correcta
};

export type LoginResponse = {
  id_usuario: number;
  email: string;
  nombre_completo: string;
  first_time: boolean;
  conjunto_residencial_id: number;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
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

export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: WITH_CREDENTIALS ? "include" : "same-origin",
    body: JSON.stringify({
      email: input.email,
      contrasena: input.contrasena, // 👈 enviar con el nombre correcto
    }),
    cache: "no-store",
  });

  const raw = await res.clone().text();
   
  console.log("login raw response:", res.status, raw);

  if (!res.ok) throw new Error(`${res.status} ${await readError(res)}`);
  return (await res.json()) as LoginResponse;
}
