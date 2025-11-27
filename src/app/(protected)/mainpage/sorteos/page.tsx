// app/(protected)/mainpage/sorteos/page.tsx
"use client";

import * as React from "react";
import RuleToggleCard from "@/components/ui/RuleToggleCard";
import { Button } from "@/components/ui/Button";
import { DateField } from "@/components/ui/DateField";
import { InfoModal } from "@/components/ui/InfoModal";
import { ConfigureModal } from "@/components/ui/ConfigureModal";
import { useRouter } from "next/navigation";

// HeroIcons
import { CalendarDaysIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

import {
  upsertSorteoConfiguracionFromSession,
  type ConfiguracionPayload,
  type Periodicidad as ApiPeriodicidad,
} from "@/lib/api/sorteos";

import {
  getSorteoConfiguracionFromSession,
  type ConfiguracionResponse as GetConfigResponse,
} from "@/lib/api/getSorteoConfiguracion";

type Rule = { id: "rule-1" | "rule-2" | "rule-3"; text: string; enabled: boolean };
type Periodicidad = "TRIMESTRAL" | "CUATRIMESTRAL" | "SEMESTRAL" | null;

const RULE_TYPE: Record<
  Rule["id"],
  "PRIORIDAD_PROPIETARIO" | "PAGO_ADMINISTRACION" | "ROTACION"
> = {
  "rule-1": "PRIORIDAD_PROPIETARIO",
  "rule-2": "PAGO_ADMINISTRACION",
  "rule-3": "ROTACION",
};

const RULE_INFO: Record<Rule["id"], { title: string; description: string }> = {
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

function getRotationOptions(periodicidad: Periodicidad): number[] {
  if (periodicidad === "SEMESTRAL") return [1];
  if (periodicidad === "CUATRIMESTRAL") return [1, 2];
  if (periodicidad === "TRIMESTRAL") return [1, 2, 3];
  return [];
}

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

/** YYYY-MM-DD -> YYYY-MM-DDT00:00:00 */
function withMidnight(dateYYYYMMDD: string | null | undefined): string | null {
  if (!dateYYYYMMDD) return null;
  return `${dateYYYYMMDD}T00:00:00`;
}

/** ISO -> '15 ene 2026' (es-CO) */
function prettyDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** ISO -> 'YYYY-MM-DD' */
function isoToYYYYMMDD(iso: string): string {
  // acepta '2026-01-15T00:00:00' o '2026-01-15'
  return iso.slice(0, 10);
}

/** Reglas activas en texto amigable */
function selectedRulesText(rules: Rule[], rotationCount: number | null): string[] {
  return rules
    .filter((r) => r.enabled)
    .map((r) => {
      const base = RULE_INFO[r.id]?.title ?? r.text;
      return RULE_TYPE[r.id] === "ROTACION" && rotationCount
        ? `${base} (n=${rotationCount})`
        : base;
    });
}

function RuleChip({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200">
      {label}
    </span>
  );
}

function ConfigSummaryModal({
  open,
  onClose,
  periodicidad,
  fechas,
  reglas,
}: {
  open: boolean;
  onClose: () => void;
  periodicidad: string;
  fechas: string[];
  reglas: string[];
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <CalendarDaysIcon className="h-7 w-7" style={{ color: "var(--color-brand)" }} />
          <h2 className="text-2xl font-semibold" style={{ color: "var(--color-brand)" }}>
            Configuración de sorteo creada
          </h2>
        </div>

        <p className="text-sm text-neutral-600 mb-3">
          Periodicidad seleccionada:{" "}
          <span className="font-medium text-neutral-900">{periodicidad}</span>
        </p>

        <div className="mb-4">
          <h3 className="font-medium text-neutral-800 mb-1 flex items-center gap-1">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            Fechas programadas:
          </h3>
          <ul className="pl-4 list-disc text-sm text-neutral-700 space-y-0.5">
            {fechas.map((f, i) => (
              <li key={`${f}-${i}`}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="mb-5">
          <h3 className="font-medium text-neutral-800 mb-2">Reglas activas:</h3>
          <div className="flex flex-wrap gap-2">
            {reglas.length === 0 ? (
              <span className="text-sm text-neutral-600">Ninguna</span>
            ) : (
              reglas.map((r) => <RuleChip key={r} label={r} />)
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SorteosPage() {
  const [rules, setRules] = React.useState<Rule[]>([
    { id: "rule-1", text: "Prioridad entre propietarios y arrendatarios", enabled: false },
    { id: "rule-2", text: "Pago de administración al día", enabled: false },
    { id: "rule-3", text: "Rotación por participación", enabled: false },
  ]);

   const router = useRouter();

  const [startDate, setStartDate] = React.useState<string>("");
  const [periodicidad, setPeriodicidad] = React.useState<Periodicidad>(null);
  const [configOpen, setConfigOpen] = React.useState(false);
  const [rotationCount, setRotationCount] = React.useState<number | null>(null);
  const [infoModal, setInfoModal] = React.useState({ open: false, title: "", description: "" });

  const [summaryOpen, setSummaryOpen] = React.useState(false);
  const [summaryData, setSummaryData] = React.useState<{
    periodicidad: string;
    fechas: string[];
    reglas: string[];
  } | null>(null);

  const [submitting, setSubmitting] = React.useState(false);
  const [serverMsg, setServerMsg] = React.useState<string | null>(null);

  // Estado para condicionar el render
  const [hasExistingConfig, setHasExistingConfig] = React.useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = React.useState<boolean>(true);


  const [authChecked, setAuthChecked] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  // Lanza modal de configurar regla #3
  React.useEffect(() => {
    const handler = () => {
      setConfigOpen(true);
      setRotationCount((prev) => prev); // no tocar valor aquí
    };
    window.addEventListener("open-config-rule", handler as EventListener);
    return () => window.removeEventListener("open-config-rule", handler as EventListener);
  }, []);


  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const token = sessionStorage.getItem("access_token");
    const userId = sessionStorage.getItem("id_usuario");

    if (!token || !userId) {
      // No hay sesión → mostrar mensaje y redirigir
      setInfoModal({
        open: true,
        title: "Sesión requerida",
        description: "Usted no está autorizado para acceder a esta sección. Inicie sesión nuevamente.",
      });

      // Pequeño timeout para que se vea el modal 1 seg, si quieres
      setTimeout(() => {
        router.replace("/login");
      }, 1000);

      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }

    setAuthChecked(true);
  }, [router]);



  React.useEffect(() => {
    if (!authChecked || !isAuthenticated) return; 

    (async () => {
      try {
        const res: GetConfigResponse = await getSorteoConfiguracionFromSession();

        setHasExistingConfig(true);

        const fechas = Array.isArray(res.fechas_programadas)
          ? res.fechas_programadas.slice()
          : [];
        const fechaInicio = fechas.length ? isoToYYYYMMDD(fechas[0]) : "";
        setStartDate(fechaInicio);

        setPeriodicidad(res.periodicidad);

        const enabledByTipo = new Map(
          res.reglas_asignadas.map((r) => [r.tipo, r] as const)
        );

        setRules((prev) =>
          prev.map((r) => {
            const tipo = RULE_TYPE[r.id];
            const found = enabledByTipo.get(tipo);
            if (!found) return { ...r, enabled: false };
            if (tipo === "ROTACION") {
              const n = found.parametros?.n ?? null;
              setRotationCount(n);
            }
            return { ...r, enabled: true };
          })
        );
      } catch (err) {
        setHasExistingConfig(false);

        // Bonus: detectar 401 del backend
        if (err instanceof Error && err.message.startsWith("401")) {
          setInfoModal({
            open: true,
            title: "No autorizado",
            description: "Usted no está autorizado para acceder a esta sección.",
          });
          router.replace("/login");
        }
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [authChecked, isAuthenticated, router]);



  const handleOpenInfo = (rule: Rule) => {
    const info = RULE_INFO[rule.id] ?? { title: rule.text, description: "" };
    setInfoModal({ open: true, title: info.title, description: info.description });
  };

  const handlePeriodicidad = (value: Exclude<Periodicidad, null>) => {
    setPeriodicidad((prev) => (prev === value ? null : value));
    // si cambia la periodicidad, validar n de rotación
    setRotationCount((n) => {
      const options = getRotationOptions(value);
      return n && options.includes(n) ? n : null;
    });
  };

  const saveRotationConfig = () => {
    if (!periodicidad) return;
    setConfigOpen(false);
  };

  const anyRuleEnabled = rules.some((r) => r.enabled);
  const rule3Enabled = rules.find((r) => r.id === "rule-3")?.enabled ?? false;
  const rotationIsConfigured = !rule3Enabled || (rule3Enabled && rotationCount !== null);
  const canConfirm =
    Boolean(startDate) && Boolean(periodicidad) && anyRuleEnabled && rotationIsConfigured;

  type Norma = ConfiguracionPayload["normas"][number];
  function buildNormas(): Norma[] {
    const result: Norma[] = [];
    for (const r of rules) {
      const tipo = RULE_TYPE[r.id];
      if (tipo === "ROTACION") {
        const item: Norma =
          r.enabled && rotationCount
            ? { tipo, activa: true, parametros: { n: rotationCount } }
            : { tipo, activa: r.enabled };
        result.push(item);
      } else {
        result.push({ tipo, activa: r.enabled });
      }
    }
    return result;
  }

  const onConfirm = async () => {
    if (!canConfirm || !periodicidad) return;
    const fechaISO = withMidnight(startDate);
    if (!fechaISO) return;

    const payload: ConfiguracionPayload = {
      periodicidad: periodicidad as ApiPeriodicidad,
      fecha_inicio: fechaISO,
      normas: buildNormas(),
    };

    try {
      setSubmitting(true);
      setServerMsg(null);

      const res = await upsertSorteoConfiguracionFromSession(payload);
      const fechasFmt = (res.fechas_programadas ?? []).map(prettyDate);
      const reglasFmt = selectedRulesText(rules, rotationCount);

      setSummaryData({
        periodicidad: res.periodicidad,
        fechas: fechasFmt,
        reglas: reglasFmt,
      });
      setSummaryOpen(true);
      setServerMsg("Configuración guardada correctamente.");
      setHasExistingConfig(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setInfoModal({
        open: true,
        title: "Error",
        description: msg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!authChecked) {
    // Aún revisando si hay sesión
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-neutral-600">Verificando sesión…</p>
      </section>
    );
  }


  if (!isAuthenticated) {
    return null;
  }

  return (

    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Sorteos</h1>

      {/* 2) Mensaje condicionado */}
      {loadingInitial ? (
        <p className="mt-2 text-neutral-600">Cargando…</p>
      ) : hasExistingConfig ? (
        <p className="mt-2 text-neutral-600">Puedes actualizar tu sorteo</p>
      ) : (
        <p className="mt-2 text-neutral-600">¡Genera tu sorteo!</p>
      )}

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
              minToday
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

      {/* Cards de reglas */}
      <div className="mt-6 space-y-4">
        {rules.map((rule, idx) => (
          <RuleToggleCard
            key={rule.id}
            mainText={rule.text}
            enabled={rule.enabled}
            onToggle={(en) =>
              setRules((prev) =>
                prev.map((r) => (r.id === rule.id ? { ...r, enabled: en } : r))
              )
            }
            hideConfigureButton={idx < 2}
            hideInfoButton={false}
            onOpenInfo={() => handleOpenInfo(rule)}
            onOpenModal={() => setConfigOpen(true)}
            infoLabel="Información"
            actionLabel="Configurar"
            domEventKey="open-config-rule"
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 flex flex-col items-end gap-2">
        {serverMsg && (
          <p className="text-sm whitespace-pre-wrap text-neutral-700">{serverMsg}</p>
        )}
        <Button onClick={onConfirm} disabled={!canConfirm || submitting}>
          {submitting ? "Guardando..." : hasExistingConfig ? "Actualizar" : "Confirmar"}
        </Button>
      </div>

      {/* Modal simple de error */}
      <InfoModal
        open={infoModal.open}
        title={infoModal.title}
        description={infoModal.description}
        onConfirm={() => setInfoModal({ open: false, title: "", description: "" })}
        onClose={() => setInfoModal({ open: false, title: "", description: "" })}
      />

      {/* Modal de configurar rotación */}
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

      {/* Modal vistoso de resumen */}
      <ConfigSummaryModal
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        periodicidad={summaryData?.periodicidad ?? ""}
        fechas={summaryData?.fechas ?? []}
        reglas={summaryData?.reglas ?? []}
      />
    </section>
  );
}

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
