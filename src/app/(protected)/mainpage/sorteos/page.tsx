"use client";

import * as React from "react";
import RuleToggleCard from "@/components/ui/RuleToggleCard";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import { InfoModal } from "@/components/ui/InfoModal";

type Rule = { id: string; text: string; enabled: boolean };
type Periodicidad = "TRIMESTRAL" | "CUATRIMESTRAL" | "SEMESTRAL" | null;

const RULE_INFO: Record<string, { title: string; description: string }> = {
  "rule-1": {
    title: "Prioridad entre propietarios y arrendatarios",
    description:
      "Si el habitante es propietario, tiene prioridad sobre arrendatarios en la asignación. Primero se asigna a propietarios.",
  },
  "rule-2": {
    title: "Pago de administración al día",
    description:
      "Solo participan quienes no tienen retrasos en el pago de la administración.",
  },
  "rule-3": {
    title: "Rotación por participación (N veces)",
    description:
      "Quien haya participado N sorteos consecutivos queda excluido del siguiente (N+1). N se ajusta según la periodicidad.",
  },
};

export default function SorteosPage() {
  const [rules, setRules] = React.useState<Rule[]>([
    { id: "rule-1", text: "Prioridad entre propietarios y arrendatarios", enabled: false },
    { id: "rule-2", text: "Pago de administración al día", enabled: true },
    { id: "rule-3", text: "Rotación por participación (N)", enabled: false },
  ]);

  const [startDate, setStartDate] = React.useState<string>("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRule, setSelectedRule] = React.useState<Rule | null>(null);

  // Modal de Información (átomo)
  const [infoModal, setInfoModal] = React.useState<{ open: boolean; title: string; description: string }>({
    open: false,
    title: "",
    description: "",
  });

  // Periodicidad (checkboxes exclusivos) + log
  const [periodicidad, setPeriodicidad] = React.useState<Periodicidad>(null);
  const handlePeriodicidad = (value: Exclude<Periodicidad, null>) => {
    setPeriodicidad((prev) => {
      const next = prev === value ? null : value;
      console.log("Periodicidad seleccionada:", next);
      return next;
    });
  };

  const handleToggle =
    (id: string) =>
    (enabled: boolean) => {
      setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)));
    };

  const handleOpenModal = (rule: Rule) => {
    setSelectedRule(rule);
    setModalOpen(true);
  };

  const handleOpenInfo = (rule: Rule) => {
    const info = RULE_INFO[rule.id] ?? { title: rule.text, description: "" };
    setInfoModal({ open: true, title: info.title, description: info.description });
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Sorteos</h1>
      <p className="mt-2 text-neutral-600">¡Genera tu sorteo!</p>

      {/* Bloque: Fecha de inicio + Periodicidad */}
      <section className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 sm:items-start sm:gap-10">
          <div className="min-w-[220px]">
            <DateField
              id="fecha-inicio"
              name="fechaInicio"
              label="Fecha de inicio"
              value={startDate}
              onChange={setStartDate}
            />
          </div>

          <div className="min-w-[260px] sm:pl-12">
            <label className="block text-sm font-medium text-neutral-800 text-center sm:text-left">
              Periodicidad
            </label>
            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2">
              <Checkbox
                id="chk-trimestral"
                checked={periodicidad === "TRIMESTRAL"}
                onChange={() => handlePeriodicidad("TRIMESTRAL")}
                label="Trimestral"
              />
              <Checkbox
                id="chk-cuatrimestral"
                checked={periodicidad === "CUATRIMESTRAL"}
                onChange={() => handlePeriodicidad("CUATRIMESTRAL")}
                label="Cuatrimestral"
              />
              <Checkbox
                id="chk-semestral"
                checked={periodicidad === "SEMESTRAL"}
                onChange={() => handlePeriodicidad("SEMESTRAL")}
                label="Semestral"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas de reglas: 2 primeras SOLO info; última INFO + CONFIGURAR */}
      <div className="mt-6 space-y-4">
        {rules.map((rule, idx) => (
          <RuleToggleCard
            key={rule.id}
            mainText={rule.text}
            enabled={rule.enabled}
            onToggle={handleToggle(rule.id)}
            // Control de visibilidad de botones
            hideConfigureButton={idx < 2}   // primeras 2 sin "Configurar"
            hideInfoButton={false}          // todas con "Información"
            onOpenInfo={() => handleOpenInfo(rule)}
            onOpenModal={() => handleOpenModal(rule)} // visible en la última
            infoLabel="Información"
            actionLabel="Configurar"
          />
        ))}
      </div>

      {/* Modal de Configurar (existente) */}
      {modalOpen && (
        <ModalShell onClose={() => setModalOpen(false)}>
          <h3 className="mb-1 text-lg font-semibold">Configurar regla</h3>
          <p className="mb-4 text-sm text-neutral-600">{selectedRule?.text}</p>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
            <Button onClick={() => setModalOpen(false)}>Guardar</Button>
          </div>
        </ModalShell>
      )}

      {/* Modal de Información (átomo) */}
      <InfoModal
        open={infoModal.open}
        title={infoModal.title}
        description={infoModal.description}
        onClose={() => setInfoModal({ open: false, title: "", description: "" })}
      />
    </section>
  );
}

/* ---------- UI helpers ---------- */

function Checkbox({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2">
      <input
        id={id}
        type="checkbox"
        className="h-5 w-5 rounded-md border-neutral-300 text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"
        checked={checked}
        onChange={onChange}
      />
      <span className="select-none text-sm text-neutral-800">{label}</span>
    </label>
  );
}

// (Tu modal simple existente si aún lo necesitas)
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
      <div
        className="relative z-10 mx-auto mt-24 w-full max-w-md rounded-2xl bg-white p-5 shadow-lg"
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
