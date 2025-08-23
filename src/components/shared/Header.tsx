type HeaderProps = { userName?: string };
import Image from "next/image";
import SocialNav from "@/components/shared/SocialNav";
export default function Header({ userName }: HeaderProps) {
  return (
    <header className="w-full bg-white">
      {/* Top bar */}
      <div className="bg-brand text-white">
        <div className="mx-auto max-w-6xl px-4 h-10 flex items-center justify-between text-sm">
          {/* Teléfono */}
          <div className="flex items-center gap-2">
            {/* ícono teléfono (usa SVG inline o el carácter ☎︎ si no quieres paquetes) */}
            <span aria-hidden>☎︎</span>
            <span>(601) 6210372</span>
          </div>
            {/* Redes sociales */}
            <SocialNav />
        </div>
      </div>

      {/* Barra principal */}
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo (placeholder tipográfico) */}
          <div className="text-3xl font-extrabold tracking-wide leading-none">
            <Image src='/indigo-group.png' alt="Hero" 
            width={231} 
            height={76} 
            />
          </div>

          {/* Account */}
          <div className="flex items-center gap-3 text-brand">
            {/* ícono usuario simple */}
            <span aria-hidden>👤</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-500">Hola de nuevo{userName ? "," : ""}</span>
              {userName && <strong>{userName}</strong>}
              <span className="text-neutral-300">|</span>
              <a href="#" className="font-medium hover:underline">Account</a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="mt-4 h-px bg-neutral-200" />
      </div>
    </header>
  );
}
