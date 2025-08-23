import Header from "@/components/shared/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // userName vendrá del estado/servidor luego; por ahora maquetación.
  const userName = "Santiago";

  return (
    <>
      <Header userName={userName} />
      <main>{children}</main>
    </>
  );
}
