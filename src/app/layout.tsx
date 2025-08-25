import "./globals.css";
import { inter } from "../components/ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
   
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
