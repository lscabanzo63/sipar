// app/(protected)/mainpage/sorteos/page.tsx
"use client";

import * as React from "react";
import RuleToggleCard from "@/components/ui/RuleToggleCard";
import { Button } from "@/components/ui/Button";

type Rule = { id: string; text: string; enabled: boolean };

export default function SorteosPage() {
  const [rules, setRules] = React.useState<Rule[]>([
    { id: "rule-1", text: "Limitar a 1 ticket por residente.", enabled: false },
    { id: "rule-2", text: "Exigir estar al día en administración.", enabled: true },
    { id: "rule-3", text: "Participación solo para mayores de 18 años.", enabled: false },
  ]);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRule, setSelectedRule] = React.useState<Rule | null>(null);

  const handleToggle =
    (id: string) =>
    (enabled: boolean) => {
      setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)));
    };

  const handleOpenModal = (rule: Rule) => {
    setSelectedRule(rule);
    setModalOpen(true);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Sorteos</h1>
      <p className="mt-2 text-neutral-600">¡Genera tu sorteo!</p>

      <div className="mt-6 space-y-4">
        {rules.map((rule) => (
          <RuleToggleCard
            key={rule.id}
            mainText={rule.text}
            enabled={rule.enabled}
            onToggle={handleToggle(rule.id)}
            onOpenModal={() => handleOpenModal(rule)}
            actionLabel="Configurar"
          />
        ))}
      </div>

      {modalOpen && (
        <ModalShell onClose={() => setModalOpen(false)}>
          <h3 className="mb-1 text-lg font-semibold">Configurar regla</h3>
          <p className="mb-4 text-sm text-neutral-600">{selectedRule?.text}</p>
          <div className="flex justify-end gap-2">
            <Button  onClick={() => setModalOpen(false)}>
              Cerrar
            </Button>
            <Button onClick={() => setModalOpen(false)}>Guardar</Button>
          </div>
        </ModalShell>
      )}
    </section>
  );
}

// Modal UI simple
function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 mx-auto mt-24 w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
        {children}
      </div>
    </div>
  );
}
