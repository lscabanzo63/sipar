"use client";

import { useEffect, useState } from "react";
import BentoGrid from "@/components/shared/BentoGrid";
import Spinner from "@/components/ui/Spinner";

export default function MainPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula tiempo de carga del DOM
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // puedes ajustar el tiempo
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Spinner
        variant="overlay"
        open={loading}
        text="Bienvenido"
        size="md"
        backdropOpacity={60}
        blur
      />

      {!loading && <BentoGrid />}
    </>
  );
}
