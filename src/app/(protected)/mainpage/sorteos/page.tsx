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
      "Si el habitante es propietario, tiene prioridad sobre arrendatarios en la asignación de cupos.\n\nResumen:\n• Primero se asignan parqueaderos a propietarios.\n• Luego participan arrendatarios si quedan cupos.\n\nObjetivo: reconocer la titularidad del inmueble sin excluir a los demás cuando exista capacidad.",
  },
  "rule-2": {
    title: "Pago de administración al día",
    description:
      "Solo participan quienes estén al día en la administración (sin cuotas vencidas ni acuerdos incumplidos).\n\nResumen:\n• La morosidad inhabilita temporalmente la participación.\n• Al normalizar pagos, se habilita nuevamente.\n\nObjetivo: fomentar el pago oportuno y asegurar condiciones justas.",
  },
  "rule-3": {
    title: "Rotación por participación (N veces)",
    description:
      "Evita que la misma persona gane continuamente.\n\nRegla:\n• Si alguien participó en N sorteos consecutivos, no puede participar en el siguiente (N+1).\n• N depende de la periodicidad para que tenga sentido (ver Configurar).",
  },
};

// Opciones válidas de N según periodicidad
function getNOptions(periodicidad: Periodicidad): number[] {
  if (periodicidad === "SEMESTRAL") return [1];        // 2 veces/año
  if (periodicidad === "CUATRIMESTRAL") return [1, 2]; // 3 veces/año
  if (periodicidad === "TRIMESTRAL") return [1, 2, 3]; // 4 veces/año
  return [];
}

// Descripción pedagógica para el modal de configuración (con ejemplos)
function getNDescription(periodicidad: Periodicidad): string {
  if (periodicidad === "SEMESTRAL") {
    return (
      "Periodicidad: Semestral (2 veces al año)\n" +
      "Valores permitidos de N: 1\n\n" +
      "Ejemplo: con N = 1, si alguien participó en el sorteo 1, queda excluido del sorteo 2; " +
      "volverá a poder participar en el siguiente ciclo."
    );
  }
  if (periodicidad === "CUATRIMESTRAL") {
    return (
      "Periodicidad: Cuatrimestral (3 veces al año)\n" +
      "Valores permitidos de N: 1 o 2\n\n" +
      "Ejemplos:\n" +
      "• N = 1: si participó en el sorteo A, queda excluido del sorteo B.\n" +
      "• N = 2: si participó en A y B consecutivos, queda excluido del sorteo C."
    );
  }
  if (periodicidad === "TRIMESTRAL") {
    return (
      "Periodicidad: Trimestral (4 veces al año)\n" +
      "Valores permitidos de N: 1, 2 o 3\n\n" +
      "Ejemplos:\n" +
      "• N = 1: si participó en A, se excluye en B.\n" +
      "• N = 2: si participó en A y B, se excluye en C.\n" +
      "• N = 3: si participó en A, B y C, se excluye en D."
    );
  }
  return (
    "Selecciona una periodicidad para ver valores permitidos de N.\n\n" +
    "La idea: tras N participaciones consecutivas, la persona descansa el siguiente sorteo (N+1)."
  );
}

export default function SorteosPage() {
  const [rules, setRules] = React.useState<Rule[]>([
    { id: "rule-1", text: "Prioridad entre propietarios y arrendatarios", enabled: false },
    { id: "rule-2", text: "Pago de administración al día", enabled: true },
    { id: "rule-3", text: "Rotación por participación (N)", enabled: false },
  ]);

  const [startDate, setStartDate] = React.useState<string>("");

  // Periodicidad (checkboxes exclusivos) + log consola
  const [periodicidad, setPeriodicidad] = React.useState<Periodicidad>(null);
  const handlePeriodicidad = (value: Exclude<Periodicidad, null>) => {
    setPeriodicidad((prev) => {
      const next = prev === value ? null : value;
      console.log("Periodicidad seleccionada:", next);
      return next;
    });
  };

  // Modal de Información
  const [infoModal, setInfoModal] = React.useState<{
    open: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    title: "",
    description: "",
  });

  // Modal de Configurar
  const [configOpen, setConfigOpen] = React.useState(false);
  const [configN, setConfigN] = React.useState<number | null>(null);

  // Escuchar evento emitido por RuleToggleCard al pulsar "Configurar"
  React.useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ id: string; enabled: boolean; mainText: string }>;
      if (!ce.detail) return;
      // Abrir modal SIN preseleccionar N (mantener placeholder)
      setConfigOpen(true);
      setConfigN(null);
    };
    window.addEventListener("open-config-rule", handler as EventListener);
    return () => window.removeEventListener("open-config-rule", handler as EventListener);
  }, []); // <- sin dependencias: no se reescribe N

  const handleOpenInfo = (rule: Rule) => {
    const info = RULE_INFO[rule.id] ?? { title: rule.text, description: "" };
    setInfoModal({ open: true, title: info.title, description: info.description });
  };

  const saveConfig = () => {
    if (!periodicidad) {
      console.warn("Selecciona una periodicidad antes de guardar.");
      return;
    }
    if (!configN) {
      console.warn("Selecciona un valor de N antes de guardar.");
      return;
    }
    console.log("Guardando configuración de Rotación, N =", configN, "periodicidad =", periodicidad);
    setConfigOpen(false);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Sorteos</h1>
      <p className="mt-2 text-neutral-600">¡Genera tu sorteo!</p>

      {/* Fecha de inicio + Periodicidad */}
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
            hideConfigureButton={idx < 2}   // primeras 2 sin "Configurar"
            hideInfoButton={false}          // todas con "Información"
            onOpenInfo={() => handleOpenInfo(rule)}
            onOpenModal={() => { /* el modal de configurar se abre por evento */ }}
            infoLabel="Información"
            actionLabel="Configurar"
            domEventKey="open-config-rule"  // emite el evento que escuchamos
          />
        ))}
      </div>

      {/* Modal de Información */}
      <InfoModal
        open={infoModal.open}
        title={infoModal.title}
        description={infoModal.description}
        onClose={() => setInfoModal({ open: false, title: "", description: "" })}
        onSave={() => {
          console.log("Guardado desde InfoModal:", infoModal.title);
          setInfoModal({ open: false, title: "", description: "" });
        }}
        saveLabel="Guardar"
      />

      {/* Modal de Configurar (select N) */}
      <ConfigureModal
        open={configOpen}
        title="Configurar rotación por participación"
        description={
          "Define el valor de N para la regla de rotación:\n" +
          "• Si un residente ha participado en N sorteos consecutivos, quedará excluido del siguiente (N+1).\n" +
          "• Elige N de acuerdo con la periodicidad para que la rotación tenga sentido.\n\n" +
          getNDescription(periodicidad)
        }
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
