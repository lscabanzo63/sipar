"use client";

import * as React from "react";
import RuleToggleCard from "@/components/ui/RuleToggleCard";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import { InfoModal } from "@/components/ui/InfoModal";
import { ConfigureModal } from "@/components/ui/ConfigureModal";

type Rule = { id: string; text: string; enabled: boolean };
type Periodicidad = "TRIMESTRAL" | "CUATRIMESTRAL" | "SEMESTRAL" | null;

const RULE_INFO: Record<string, { title: string; description: string }> = {
  "rule-1": {
    title: "Prioridad entre propietarios y arrendatarios",
    description:
      "Si el habitante es propietario, tiene prioridad sobre arrendatarios en la asignación de cupos. Primero se asignan los parqueaderos a propietarios y, si quedan disponibles, se continúa con arrendatarios. Esta prioridad busca reconocer la titularidad del inmueble sin excluir a los demás cuando exista capacidad.",
  },
  "rule-2": {
    title: "Pago de administración al día",
    description:
      "Solo participan quienes estén al día en el pago de la administración, es decir, sin cuotas vencidas ni acuerdos incumplidos. Esta regla promueve la cultura de pago oportuno y garantiza condiciones justas de participación. En caso de morosidad, el usuario quedará temporalmente inhabilitado hasta regularizar su estado.",
  },
  "rule-3": {
    title: "Rotación por participación (N veces)",
    description:
      "Quien haya participado en N sorteos consecutivos queda excluido del siguiente (N+1) para favorecer la rotación de beneficiarios. El valor de N se configura según la periodicidad elegida y debe mantener coherencia.",
  },
};

// Helper para opciones válidas de N según periodicidad
function getNOptions(periodicidad: Periodicidad): number[] {
  if (periodicidad === "SEMESTRAL") return [1];      // 2 veces al año: N = 1
  if (periodicidad === "CUATRIMESTRAL") return [1, 2]; // 3 veces al año: N = 1,2
  if (periodicidad === "TRIMESTRAL") return [1, 2, 3]; // 4 veces al año: N = 1,2,3
  return [];
}

export default function SorteosPage() {
  const [rules, setRules] = React.useState<Rule[]>([
    { id: "rule-1", text: "Prioridad entre propietarios y arrendatarios", enabled: false },
    { id: "rule-2", text: "Pago de administración al día", enabled: true },
    { id: "rule-3", text: "Rotación por participación (N)", enabled: false },
  ]);

  const [startDate, setStartDate] = React.useState<string>("");

  // Periodicidad (checkboxes exclusivos) + log
  const [periodicidad, setPeriodicidad] = React.useState<Periodicidad>(null);
  const handlePeriodicidad = (value: Exclude<Periodicidad, null>) => {
    setPeriodicidad((prev) => {
      const next = prev === value ? null : value;
      console.log("Periodicidad seleccionada:", next);
      return next;
    });
  };

  // Modal de Información (átomo)
  const [infoModal, setInfoModal] = React.useState<{ open: boolean; title: string; description: string }>({
    open: false,
    title: "",
    description: "",
  });

  // Modal de Configurar (átomo)
  const [configOpen, setConfigOpen] = React.useState(false);
  const [configN, setConfigN] = React.useState<number | null>(null);

  // Listener del evento de "Configurar" emitido por la tarjeta (domEventKey)
  React.useEffect(() => {
    const handler = (e: Event) => {
      // Detalle del evento: { id, enabled, mainText }
      const ce = e as CustomEvent<{ id: string; enabled: boolean; mainText: string }>;
      // Solo abrimos modal cuando venga de la regla de Rotación (rule-3),
      // pero puedes quitar esta condición si quieres mostrar para cualquiera.
      if (!ce.detail) return;
      // Abre el modal de configuración
      setConfigOpen(true);
      // Reset N si cambió la periodicidad
      const options = getNOptions(periodicidad);
      setConfigN(options[0] ?? null);
    };

    window.addEventListener("open-config-rule", handler as EventListener);
    return () => window.removeEventListener("open-config-rule", handler as EventListener);
  }, [periodicidad]);

  // Callbacks abrir/cerrar modales
  const handleOpenInfo = (rule: Rule) => {
    const info = RULE_INFO[rule.id] ?? { title: rule.text, description: "" };
    setInfoModal({ open: true, title: info.title, description: info.description });
  };

  const saveConfig = () => {
    console.log("Guardando configuración de Rotación, N =", configN, "periodicidad =", periodicidad);
    setConfigOpen(false);
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
            onToggle={(en) =>
              setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled: en } : r)))
            }
            // Control de visibilidad de botones
            hideConfigureButton={idx < 2}   // primeras 2 sin "Configurar"
            hideInfoButton={false}          // todas con "Información"
            onOpenInfo={() => handleOpenInfo(rule)}
            onOpenModal={() => { /* redundante: abrimos por evento */ }}
            infoLabel="Información"
            actionLabel="Configurar"
            domEventKey="open-config-rule"  // <- emite evento global que escuchamos en useEffect
          />
        ))}
      </div>

      {/* Modal de Información (átomo) */}
      <InfoModal
        open={infoModal.open}
        title={infoModal.title}
        description={infoModal.description}
        onClose={() => setInfoModal({ open: false, title: "", description: "" })}
      />

      {/* Modal de Configurar (átomo) */}
      <ConfigureModal
        open={configOpen}
        title="Configurar rotación por participación"
        description="Define el valor de N para la regla de rotación. Si un residente ha participado en N sorteos consecutivos, quedará excluido del siguiente (N+1)."
        nValue={configN}
        nOptions={getNOptions(periodicidad)}
        onChangeN={setConfigN}
        onClose={() => setConfigOpen(false)}
        onSave={saveConfig}
        disabled={getNOptions(periodicidad).length === 0}
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
