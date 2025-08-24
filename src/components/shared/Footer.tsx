"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#5B2C83] text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo y derechos */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Image
            src="/logo-city-parking.png"
            alt="City Parking"
            width={150}
            height={40}
            priority
          />
          <p className="text-xs text-gray-200">
            © Grupo INDIGO – Todos los derechos reservados
          </p>
        </div>

        {/* Enlaces legales */}
        <div className="flex flex-col items-center gap-2 md:gap-3 text-sm md:text-left">
          <Link href="#" className="hover:underline">
            Información jurídica
          </Link>
          <Link href="#" className="hover:underline">
            Condiciones de uso
          </Link>
          <Link href="#" className="hover:underline">
            Política de privacidad
          </Link>
          <Link href="#" className="hover:underline">
            Gestión de cookies
          </Link>
        </div>

        {/* Redes sociales */}
        <div className="flex gap-5 text-white text-xl">
          <Link href="#" aria-label="Instagram" className="hover:text-gray-300">
            <FaInstagram />
          </Link>
          <Link href="#" aria-label="LinkedIn" className="hover:text-gray-300">
            <FaLinkedinIn />
          </Link>
          <Link href="#" aria-label="Facebook" className="hover:text-gray-300">
            <FaFacebookF />
          </Link>
          <Link href="#" aria-label="Twitter" className="hover:text-gray-300">
            <FaTwitter />
          </Link>
        </div>
      </div>
    </footer>
  );
}
