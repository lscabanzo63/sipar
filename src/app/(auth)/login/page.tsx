"use client";

import Image from "next/image";
import { useState } from "react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-6">
      <div
        className="
          w-full max-w-md 
          border border-brand 
          rounded-[var(--radius-lg)] 
          p-8 shadow-lg bg-white
        "
      >
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
        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Email */}
          <TextField
            label="Email"
            type="email"
            placeholder="get@ziontutorial.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />

          <div className="space-y-3 pt-2">
            <Button type="submit"
            fullWidth>
              Log in
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
