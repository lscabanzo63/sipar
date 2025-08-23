import "./globals.css";
import { inter } from "../components/ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* inter.variable inyecta --font-sans; también puedes añadir inter.className si prefieres */}
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
