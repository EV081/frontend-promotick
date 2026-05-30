"use client";

import { useState, useEffect } from "react";

export interface Periodo {
  fechaInicio: string;
  fechaFin: string;
}

interface PeriodSelectorProps {
  rango: Periodo | null;
  value: Periodo | null;
  activePreset: string | null;
  onChange: (fechaInicio: string, fechaFin: string, presetId: string | null) => void;
  disabled?: boolean;
}

interface PresetDef {
  id: string;
  label: string;
  /** Resta n días al fin. */
  days?: number;
  /** Resta n meses al fin. */
  months?: number;
}

const PRESETS: PresetDef[] = [
  { id: "7d", label: "7 días", days: 7 },
  { id: "1m", label: "1 mes", months: 1 },
  { id: "3m", label: "3 meses", months: 3 },
  { id: "6m", label: "6 meses", months: 6 },
];

// ── Helpers de fecha (evitan desfase de zona horaria) ──
function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDisplay(iso: string): string {
  return parseISO(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Fin = inicio + periodo (sin recorte; el backend ajusta si excede el rango). */
function computeEnd(startISO: string, preset: PresetDef): string {
  const end = parseISO(startISO);
  if (preset.days != null) end.setDate(end.getDate() + preset.days);
  if (preset.months != null) end.setMonth(end.getMonth() + preset.months);
  return formatISO(end);
}

/** Recorta una fecha al rango disponible [fechaInicio, fechaFin]. */
function clampToRango(iso: string, rango: Periodo): string {
  const d = parseISO(iso);
  if (d < parseISO(rango.fechaInicio)) return rango.fechaInicio;
  if (d > parseISO(rango.fechaFin)) return rango.fechaFin;
  return iso;
}

const chipStyle = (active: boolean): React.CSSProperties => ({
  background: active ? "rgba(207,7,0,0.12)" : "var(--t-bg-base)",
  border: `1px solid ${active ? "rgba(207,7,0,0.45)" : "var(--t-border-card)"}`,
  color: active ? "#e73137" : "var(--t-text-secondary)",
});

export default function PeriodSelector({
  rango,
  value,
  activePreset,
  onChange,
  disabled,
}: PeriodSelectorProps) {
  const isDisabled = disabled || !rango;
  const [customOpen, setCustomOpen] = useState(false);

  // Si el padre marca un preset real, salir del modo personalizado
  useEffect(() => {
    if (activePreset && activePreset !== "custom") setCustomOpen(false);
  }, [activePreset]);

  const inCustom = customOpen || activePreset === "custom";
  const activePresetDef = PRESETS.find((p) => p.id === activePreset);

  const handlePreset = (preset: PresetDef) => {
    if (!rango) return;
    setCustomOpen(false);
    const inicio = rango.fechaInicio;
    onChange(inicio, computeEnd(inicio, preset), preset.id);
  };

  // Editar el inicio en modo preset → recalcular el fin = inicio + periodo
  const handleStartChange = (val: string) => {
    if (!rango || !val || !activePresetDef) return;
    const inicio = clampToRango(val, rango);
    onChange(inicio, computeEnd(inicio, activePresetDef), activePresetDef.id);
  };

  const handleManual = (field: "fechaInicio" | "fechaFin", val: string) => {
    if (!rango || !val) return;
    let inicio = field === "fechaInicio" ? val : value?.fechaInicio ?? rango.fechaInicio;
    let fin = field === "fechaFin" ? val : value?.fechaFin ?? rango.fechaFin;
    // Evitar rango invertido (inicio > fin): ajustar el otro extremo al editado.
    if (parseISO(inicio) > parseISO(fin)) {
      if (field === "fechaInicio") fin = inicio;
      else inicio = fin;
    }
    onChange(inicio, fin, "custom");
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--t-bg-card)",
    border: "1px solid var(--t-border-card)",
    color: "var(--t-text-primary)",
  };

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: "var(--t-bg-card)",
        border: "1px solid var(--t-border-card)",
        boxShadow: "var(--t-shadow-card)",
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="text-xs font-semibold uppercase tracking-wider mr-1"
          style={{ color: "var(--t-text-muted)" }}
        >
          Periodo
        </span>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = !inCustom && activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePreset(p)}
                disabled={isDisabled}
                className="px-3 py-1.5 text-sm rounded-lg transition-all cursor-pointer font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                style={chipStyle(active)}
              >
                {p.label}
              </button>
            );
          })}
          <button
            onClick={() => setCustomOpen(true)}
            disabled={isDisabled}
            className="px-3 py-1.5 text-sm rounded-lg transition-all cursor-pointer font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            style={chipStyle(inCustom)}
          >
            Personalizada
          </button>
        </div>
      </div>

      {/* Modo personalizado: inputs editables */}
      {inCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            aria-label="Fecha inicio"
            value={value?.fechaInicio ?? ""}
            min={rango?.fechaInicio}
            max={rango?.fechaFin}
            disabled={isDisabled}
            onChange={(e) => handleManual("fechaInicio", e.target.value)}
            className="text-sm rounded-lg px-2 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            style={inputStyle}
          />
          <span className="text-sm" style={{ color: "var(--t-text-muted)" }}>—</span>
          <input
            type="date"
            aria-label="Fecha fin"
            value={value?.fechaFin ?? ""}
            min={rango?.fechaInicio}
            max={rango?.fechaFin}
            disabled={isDisabled}
            onChange={(e) => handleManual("fechaFin", e.target.value)}
            className="text-sm rounded-lg px-2 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            style={inputStyle}
          />
        </div>
      )}

      {/* Preset activo: inicio editable + fin autocalculado (solo lectura) */}
      {!inCustom && activePresetDef && value && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <label className="flex items-center gap-2 text-sm" style={{ color: "var(--t-text-secondary)" }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--t-text-muted)" }}>Inicio</span>
            <input
              type="date"
              aria-label="Fecha inicio"
              value={value.fechaInicio}
              min={rango?.fechaInicio}
              max={rango?.fechaFin}
              disabled={isDisabled}
              onChange={(e) => handleStartChange(e.target.value)}
              className="text-sm rounded-lg px-2 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={inputStyle}
            />
          </label>
          <span className="flex items-center gap-2 text-sm tabular-nums" style={{ color: "var(--t-text-primary)" }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--t-text-muted)" }}>Fin</span>
            {formatDisplay(value.fechaFin)}
          </span>
        </div>
      )}
    </div>
  );
}
