"use client";

import * as React from "react";
import RuleToggleCard from "@/components/ui/RuleToggleCard";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import { InfoModal } from "@/components/ui/InfoModal";
import { ConfigureModal } from "@/components/ui/ConfigureModal";

type Rule = { id: string; text: string; enabled: boolean };
type Periodicidad = "TRIMESTRAL" | "CUATRIMESTRAL" | "SEMESTRAL" | null;

// Mapeo de regla -> tipo de payload
const RULE_TYPE: Record<string, "PRIORIDAD_PROPIETARIO" | "PAGO_ADMINISTRACION" | "ROTACION"> = {
  "rule-1": "PRIORIDAD_PROPIETARIO",
  "rule-2": "PAGO_ADMINISTRACION",
  "rule-3": "ROTACION",
};

const RULE_INFO: Record<string, { title: string; description: string }> = {
  "rule-1": {
    title: "Prioridad entre propietarios y arrendatarios",
    description:
      "Primero se asignan parqueaderos a propietarios y, si quedan disponibles, se continúa con arrendatarios. Esta prioridad reconoce la titularidad del inmueble sin excluir a los demás cuando haya cupos.",
  },
  "rule-2": {
    title: "Pago de administración al día",
    description:
      "Solo pueden participar quienes estén al día con la administración (sin cuotas vencidas ni acuerdos incumplidos). Si existe mora, la persona queda temporalmente inhabilitada hasta normalizar su estado.",
  },
  "rule-3": {
    title: "Rotación por participación",
    description:
      "Para repartir las oportunidades, alguien que haya participado en varios sorteos seguidos deberá descansar el siguiente. Tú decides cuántos sorteos seguidos permite el sistema antes de forzar ese descanso.",
  },
};

// Opciones válidas según periodicidad
function getRotationOptions(periodicidad: Periodicidad): number[] {
  if (periodicidad === "SEMESTRAL") return [1];
  if (periodicidad === "CUATRIMESTRAL") return [1, 2];
  if (periodicidad === "TRIMESTRAL") return [1, 2, 3];
  return [];
}

// Descripción (sin letras técnicas)
function getRotationDescription(periodicidad: Periodicidad): string {
  if (periodicidad === "SEMESTRAL") {
    return (
      "Periodicidad: Semestral (2 sorteos al año)\n" +
      "Solo puedes elegir 1 sorteo seguido antes de descansar.\n" +
      "Ejemplo: si participa en el primero, descansa el segundo."
    );
  }
  if (periodicidad === "CUATRIMESTRAL") {
    return (
      "Periodicidad: Cuatrimestral (3 sorteos al año)\n" +
      "Puedes elegir 1 o 2 sorteos seguidos antes de descansar.\n" +
      "Ejemplos:\n" +
      "• Con 1 seguido: participa en A, descansa en B.\n" +
      "• Con 2 seguidos: participa en A y B, descansa en C."
    );
  }
  if (periodicidad === "TRIMESTRAL") {
    return (
      "Periodicidad: Trimestral (4 sorteos al año)\n" +
      "Puedes elegir 1, 2 o 3 sorteos seguidos antes de descansar.\n" +
      "Ejemplos:\n" +
      "• 1 seguido → descansa el siguiente.\n" +
      "• 2 seguidos → descansa el tercero.\n" +
      "• 3 seguidos → descansa el cuarto."
    );
  }
  return "Selecciona una periodicidad para ver las opciones de cuántos sorteos seguidos se permiten antes de descansar.";
}

// Convierte "dd/mm/aaaa" a "YYYY-MM-DDT00:00:00" (24h)
function toISOWithMidnight(dateStr: string): string | null {
  if (!dateStr) return null;
  const parts = dateStr.replaceAll(" ", "").split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map((x) => Number(x));
  if (!dd || !mm || !yyyy) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${yyyy}-${pad(mm)}-${pad(dd)}T00:00:00`;
}

export default function SorteosPage() {
  const [rules, setRules] = React.useState<Rule[]>([
    { id: "rule-1", text: "Prioridad entre propietarios y arrendatarios", enabled: false },
    { id: "rule-2", text: "Pago de administración al día", enabled: false },
    { id: "rule-3", text: "Rotación por participación", enabled: false },
  ]);

  const [startDate, setStartDate] = React.useState<string>("");

  // Periodicidad
  const [periodicidad, setPeriodicidad] = React.useState<Periodicidad>(null);
  const handlePeriodicidad = (value: Exclude<Periodicidad, null>) => {
    setPeriodicidad((prev) => (prev === value ? null : value));
    console.log("Periodicidad seleccionada:", value);
  };

  // Info modal
  const [infoModal, setInfoModal] = React.useState<{ open: boolean; title: string; description: string }>({
    open: false,
    title: "",
    description: "",
  });

  // Config modal (rotación)
  const [configOpen, setConfigOpen] = React.useState(false);
  const [rotationCount, setRotationCount] = React.useState<number | null>(null);

  // Escucha evento "Configurar" de la card
  React.useEffect(() => {
    const handler = () => {
      setConfigOpen(true);
      setRotationCount(null); // no preseleccionar
    };
    window.addEventListener("open-config-rule", handler as EventListener);
    return () => window.removeEventListener("open-config-rule", handler as EventListener);
  }, []);

  const handleOpenInfo = (rule: Rule) => {
    const info = RULE_INFO[rule.id] ?? { title: rule.text, description: "" };
    setInfoModal({ open: true, title: info.title, description: info.description });
  };

  const saveRotationConfig = () => {
    if (!periodicidad) {
      console.warn("Selecciona una periodicidad antes de guardar configuración de rotación.");
      return;
    }
    if (!rotationCount) {
      console.warn("Selecciona cuántos sorteos seguidos permite el sistema antes de descansar.");
      return;
    }
    console.log("Configuración guardada — Periodicidad:", periodicidad, " | Seguidos permitidos:", rotationCount);
    setConfigOpen(false);
  };

  // Habilitación del botón Confirmar (página)
  const anyRuleEnabled = rules.some((r) => r.enabled);
  const rule3Enabled = rules.find((r) => r.id === "rule-3")?.enabled ?? false;
  const rotationIsConfigured = !rule3Enabled || (rule3Enabled && rotationCount !== null);
  const canConfirm =
    Boolean(startDate) && Boolean(periodicidad) && anyRuleEnabled && rotationIsConfigured;

  // Construcción del payload y log formateado
  const onConfirm = () => {
    const fechaISO = toISOWithMidnight(startDate);
    const normas = rules.map((r) => {
      const tipo = RULE_TYPE[r.id];
      if (tipo === "ROTACION") {
        return {
          tipo,
          activa: r.enabled,
          parametros: r.enabled && rotationCount ? { n: rotationCount } : {},
        };
      }
      return { tipo, activa: r.enabled, parametros: {} };
    });

    const payload = {
      data: {
        periodicidad: periodicidad ?? "",
        fecha_inicio: fechaISO ?? "",
        normas,
      },
    };

    console.log("Fecha (con hora 24h):", fechaISO);
    console.log("Payload listo para servicio:", JSON.stringify(payload, null, 2));
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

      {/* Tarjetas de reglas */}
      <div className="mt-6 space-y-4">
        {rules.map((rule, idx) => (
          <RuleToggleCard
            key={rule.id}
            mainText={rule.text}
            enabled={rule.enabled}
            onToggle={(en) =>
              setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled: en } : r)))
            }
            hideConfigureButton={idx < 2}        // 2 primeras sin “Configurar”
            hideInfoButton={false}               // todas con “Información”
            onOpenInfo={() => handleOpenInfo(rule)}
            onOpenModal={() => { /* abrir por evento */ }}
            infoLabel="Información"
            actionLabel="Configurar"
            domEventKey="open-config-rule"
          />
        ))}
      </div>

      {/* Footer de página: Confirmar */}
      <div className="mt-8 flex justify-end">
        <Button onClick={onConfirm} disabled={!canConfirm}>
          Confirmar
        </Button>
      </div>

      {/* Modal de Información: un solo botón Confirmar */}
      <InfoModal
        open={infoModal.open}
        title={infoModal.title}
        description={infoModal.description}
        onConfirm={() => setInfoModal({ open: false, title: "", description: "" })}
        onClose={() => setInfoModal({ open: false, title: "", description: "" })}
      />

      {/* Modal de Configurar (rotación) */}
      <ConfigureModal
        open={configOpen}
        title="Configurar rotación por participación"
        description={
          "Indica cuántos sorteos seguidos puede participar una persona antes de descansar el siguiente.\n\n" +
          getRotationDescription(periodicidad)
        }
        nValue={rotationCount}
        nOptions={getRotationOptions(periodicidad)}
        onChangeN={setRotationCount}
        onClose={() => setConfigOpen(false)}
        onSave={saveRotationConfig}
        disabled={getRotationOptions(periodicidad).length === 0}
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
