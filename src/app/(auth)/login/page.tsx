"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { login } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwd(e.target.value);
  };

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !pwd) {
      setError("Ingresa email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const resp = await login({ email, contrasena: pwd });
      
      sessionStorage.setItem(
        "conjunto_residencial_id",
        String(resp.conjunto_residencial_id)
      );

      sessionStorage.setItem("id_usuario", String(resp.id_usuario));
      if (resp.first_time) {
        router.push("/initial-configuration");
      } else {
        router.push("/mainpage");
      }
    } catch {
      setError("Credenciales Incorrectas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-brand rounded-[var(--radius-lg)] p-8 shadow-lg bg-white">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/indigo-group.png"
            alt="Hero"
            width={231}
            height={76}
            priority
          />
        </div>

        {/* Título */}
        <h1 className="text-center text-3xl font-bold">LOGIN</h1>
        <p className="text-center text-sm text-neutral-500 mt-2">
          Please, put the information below:
        </p>

        {/* Formulario */}
        <form className="mt-8 space-y-4" onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            placeholder="usuario@example.com"
            value={email}
            onChange={handleEmailChange}
          />

          <TextField
            label="Password"
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={handlePwdChange}
          />

          {error && (
            <p className="text-sm text-red-600 mt-1" role="alert">
              {error}
            </p>
          )}

          <div className="space-y-3 pt-2">
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Ingresando..." : "Log in"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
