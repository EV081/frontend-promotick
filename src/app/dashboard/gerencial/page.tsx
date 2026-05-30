"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import KpiCard from "@/components/ui/KpiCard";
import AlertCard from "@/components/ui/AlertCard";
import {
  getBacklogCritico,
  getTendenciaTickets,
  getIncidentesRecurrentes,
  getCategoriasMayorIncidencia,
  getSaturacionOperativa,
  getDemandaPorArea,
  getComparativoMensual,
  getMejoraContinua,
  type TendenciaTicketsResponse,
  type IncidenteRecurrente,
  type CategoriaIncidencia,
  type SaturacionOperativaResponse,
  type AreaDemanda,
  type ComparativoMensualResponse,
  type MejoraContinuaResponse,
} from "@/services/dashboardService";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ── helpers ────────────────────────────────────────────────────────────────────
const CAT_COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#f43f5e", "#8b5cf6", "#22c55e"];
const AREA_COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#f43f5e", "#8b5cf6", "#22c55e"];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function threeMonthsAgo() {
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  return d.toISOString().slice(0, 10);
}

const cardStyle = {
  background: "var(--t-bg-card)",
  border: "1px solid var(--t-border-card)",
  boxShadow: "var(--t-shadow-card)",
};

// ── local chart components ─────────────────────────────────────────────────────
function TrendChart({ data, dataKey, label }: { data: { periodo: string; tickets?: number; ticketsAtendidos?: number }[]; dataKey: string; label: string }) {
  const { isDark } = useTheme();
  const axisColor = isDark ? "#4d4d4d" : "#888888";
  const grid = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const tip = { background: "var(--t-tooltip-bg)", border: "1px solid var(--t-tooltip-border)", borderRadius: "8px", color: "var(--t-tooltip-color)" };
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
        <XAxis dataKey="periodo" tick={{ fontSize: 10, fill: axisColor }} />
        <YAxis tick={{ fontSize: 10, fill: axisColor }} />
        <Tooltip contentStyle={tip} />
        <Line type="monotone" dataKey={dataKey} name={label} stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: "#6366f1" }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function HBarChart({ data }: { data: { name: string; value: number }[] }) {
  const { isDark } = useTheme();
  const axisColor = isDark ? "#4d4d4d" : "#888888";
  const grid = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const tip = { background: "var(--t-tooltip-bg)", border: "1px solid var(--t-tooltip-border)", borderRadius: "8px", color: "var(--t-tooltip-color)" };
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
        <XAxis type="number" tick={{ fontSize: 10, fill: axisColor }} />
        <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 10, fill: axisColor }} />
        <Tooltip contentStyle={tip} />
        <Bar dataKey="value" name="Tickets" fill="#14b8a6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function VBarChart({ data, dataKey, label }: { data: { periodo: string; tickets?: number; ticketsAtendidos?: number }[]; dataKey: string; label: string }) {
  const { isDark } = useTheme();
  const axisColor = isDark ? "#4d4d4d" : "#888888";
  const grid = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const tip = { background: "var(--t-tooltip-bg)", border: "1px solid var(--t-tooltip-border)", borderRadius: "8px", color: "var(--t-tooltip-color)" };
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
        <XAxis dataKey="periodo" tick={{ fontSize: 10, fill: axisColor }} />
        <YAxis tick={{ fontSize: 10, fill: axisColor }} />
        <Tooltip contentStyle={tip} />
        <Bar dataKey={dataKey} name={label} fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DonutPie({ data }: { data: { name: string; value: number }[] }) {
  const { isDark } = useTheme();
  const tip = { background: "var(--t-tooltip-bg)", border: "1px solid var(--t-tooltip-border)", borderRadius: "8px", color: "var(--t-tooltip-color)", fontSize: "12px" };

  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top5 = sorted.slice(0, 5);
  const others = sorted.slice(5);
  const othersTotal = others.reduce((s, x) => s + x.value, 0);
  const chartData = othersTotal > 0 ? [...top5, { name: "Otros", value: othersTotal }] : top5;
  const total = chartData.reduce((s, x) => s + x.value, 0);

  const COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#f43f5e", "#8b5cf6", "#64748b"];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4" style={{ minHeight: 220 }}>
      <div className="relative flex-shrink-0" style={{ width: 180, height: 180 }}>
        <PieChart width={180} height={180}>
          <Pie
            data={chartData}
            cx={90} cy={90}
            innerRadius={58} outerRadius={82}
            dataKey="value" nameKey="name"
            paddingAngle={2} strokeWidth={0}
          >
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={tip} formatter={(v: number) => [`${v.toLocaleString()} (${((v/total)*100).toFixed(1)}%)`, ""]} />
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold tabular-nums" style={{ color: "var(--t-text-primary)" }}>
            {total.toLocaleString()}
          </span>
          <span className="text-xs" style={{ color: "var(--t-text-muted)" }}>total</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        {chartData.map((item, i) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs truncate" style={{ color: "var(--t-text-secondary)", maxWidth: 160 }}>{item.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-xs tabular-nums font-semibold" style={{ color: "var(--t-text-primary)" }}>
                    {item.value.toLocaleString()}
                  </span>
                  <span className="text-xs tabular-nums w-10 text-right" style={{ color: "var(--t-text-muted)" }}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function Gauge({ value }: { value: number | null }) {
  const { isDark } = useTheme();
  const pct = value != null ? Math.round(value * 100) : 0;
  const color = pct >= 90 ? "#22c55e" : pct >= 70 ? "#f59e0b" : "#e73137";
  const gaugeData = [{ value: pct }, { value: 100 - pct }];
  return (
    <div className="flex flex-col items-center">
      <PieChart width={160} height={90}>
        <Pie data={gaugeData} cx={80} cy={80} startAngle={180} endAngle={0} innerRadius={48} outerRadius={72} dataKey="value" stroke="none">
          <Cell fill={color} />
          <Cell fill={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} />
        </Pie>
      </PieChart>
      <p className="text-2xl font-bold tabular-nums -mt-2" style={{ color: "var(--t-text-primary)" }}>
        {value != null ? `${pct}%` : "—"}
      </p>
    </div>
  );
}

function Skeleton({ h = "h-48" }: { h?: string }) {
  return <div className={`rounded-xl ${h} animate-pulse`} style={{ background: "var(--t-bg-subtle)" }} />;
}

function DateRange({
  start, end, onStart, onEnd, onApply, loading,
}: {
  start: string; end: string;
  onStart: (v: string) => void;
  onEnd: (v: string) => void;
  onApply: () => void;
  loading: boolean;
}) {
  const inp = {
    background: "var(--t-bg-subtle)",
    border: "1px solid var(--t-border-card)",
    color: "var(--t-text-primary)",
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "12px",
  };
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input type="date" value={start} onChange={e => onStart(e.target.value)} style={inp} />
      <span style={{ color: "var(--t-text-muted)", fontSize: "12px" }}>→</span>
      <input type="date" value={end} onChange={e => onEnd(e.target.value)} style={inp} />
      <button
        onClick={onApply}
        disabled={loading}
        className="px-3 py-1 rounded-lg text-xs font-semibold transition-opacity"
        style={{ background: "#6366f1", color: "#fff", opacity: loading ? 0.5 : 1 }}
      >
        {loading ? "Cargando…" : "Aplicar"}
      </button>
    </div>
  );
}

// ── Título de sección ──────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--t-text-muted)" }}>
      {children}
    </p>
  );
}

// ── Indicador badge ────────────────────────────────────────────────────────────
function Indicador({ label, value, fmt = "num" }: { label: string; value?: number; fmt?: "pct" | "h" | "num" }) {
  if (value === undefined) return null;
  const display = fmt === "pct" ? `${value.toFixed(2)}%` : fmt === "h" ? `${value.toFixed(1)} h` : String(value);
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "var(--t-border-subtle)" }}>
      <span className="text-sm" style={{ color: "var(--t-text-secondary)" }}>{label}</span>
      <span className="text-sm font-bold tabular-nums" style={{ color: "var(--t-text-primary)" }}>{display}</span>
    </div>
  );
}

// ── State types ────────────────────────────────────────────────────────────────
interface GerencialState {
  backlogCritico: number | null;
  saturacion: SaturacionOperativaResponse | null;
  recurrentes: IncidenteRecurrente[];
  incidencia: CategoriaIncidencia[];
  demanda: AreaDemanda[];
  mejora: MejoraContinuaResponse | null;
}

interface RangedState {
  tendencia: TendenciaTicketsResponse | null;
  comparativo: ComparativoMensualResponse | null;
}

type ViewMode = "semanal" | "mensual" | "trimestral";

// ── Page ───────────────────────────────────────────────────────────────────────
export default function GerencialPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<GerencialState>({
    backlogCritico: null,
    saturacion: null,
    recurrentes: [],
    incidencia: [],
    demanda: [],
    mejora: null,
  });

  const [ranged, setRanged] = useState<RangedState>({ tendencia: null, comparativo: null });
  const [loadingStatic, setLoadingStatic] = useState(true);
  const [loadingRanged, setLoadingRanged] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fechaInicio, setFechaInicio] = useState(threeMonthsAgo());
  const [fechaFin, setFechaFin] = useState(todayStr());
  const [viewTend, setViewTend] = useState<ViewMode>("mensual");
  const [viewComp, setViewComp] = useState<ViewMode>("mensual");

  useGSAP(() => {
    const sections = mainRef.current?.querySelectorAll(".anim-section");
    if (sections && sections.length > 0) {
      gsap.fromTo(
        sections,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, { scope: mainRef });

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/login");
    else if (user.role !== "gerente") router.replace("/dashboard/operacional");
  }, [user, isLoading, router]);

  // Load static endpoints (callable manually for refresh)
  const fetchStatic = useCallback(() => {
    if (!user || user.role !== "gerente") return;
    setLoadingStatic(true);
    setError(null);
    Promise.allSettled([
      getBacklogCritico(),
      getSaturacionOperativa(),
      getIncidentesRecurrentes(5),
      getCategoriasMayorIncidencia(),
      getDemandaPorArea(),
      getMejoraContinua(),
    ]).then(([bl, sat, rec, cat, dem, mej]) => {
      setState({
        backlogCritico: bl.status === "fulfilled" ? bl.value.backlogCritico : null,
        saturacion: sat.status === "fulfilled" ? sat.value : null,
        recurrentes: rec.status === "fulfilled" ? rec.value.recurrentes : [],
        incidencia: cat.status === "fulfilled" ? cat.value.ranking : [],
        demanda: dem.status === "fulfilled" ? dem.value.demanda : [],
        mejora: mej.status === "fulfilled" ? mej.value : null,
      });
      const all404 = [bl, sat, rec, cat, dem, mej].every(
        r => r.status === "rejected" && (r.reason as Error).message.includes("404")
      );
      if (all404) setError("No hay datos limpios. Sube un archivo y ejecuta la limpieza desde el menú de archivos.");
      setLoadingStatic(false);
    });
  }, [user]);

  useEffect(() => { fetchStatic(); }, [fetchStatic]);

  // Load ranged endpoints
  const fetchRanged = useCallback(() => {
    if (!user || user.role !== "gerente") return;
    setLoadingRanged(true);
    Promise.allSettled([
      getTendenciaTickets(fechaInicio, fechaFin),
      getComparativoMensual(fechaInicio, fechaFin),
    ]).then(([tend, comp]) => {
      setRanged({
        tendencia: tend.status === "fulfilled" ? tend.value : null,
        comparativo: comp.status === "fulfilled" ? comp.value : null,
      });
      setLoadingRanged(false);
    });
  }, [user, fechaInicio, fechaFin]);

  useEffect(() => { fetchRanged(); }, [fetchRanged]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--t-bg-base)" }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-promotick-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>Cargando...</p>
        </div>
      </div>
    );
  }

  // Derived data
  const tendData: { periodo: string; tickets: number }[] = (ranged.tendencia?.[viewTend] ?? []) as { periodo: string; tickets: number }[];
  const compData: { periodo: string; ticketsAtendidos: number }[] = (ranged.comparativo?.[viewComp] ?? []) as { periodo: string; ticketsAtendidos: number }[];
  const incidenciaPie = state.incidencia.map(i => ({ name: i.categoria, value: i.ocurrencias }));
  const demandaHBar = state.demanda.map(d => ({ name: d.area, value: d.tickets }));
  const compVBar = compData;

  const tabStyle = (active: boolean) => ({
    padding: "3px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
    background: active ? "#6366f1" : "transparent",
    color: active ? "#fff" : "var(--t-text-muted)",
    border: active ? "1px solid #6366f1" : "1px solid var(--t-border-card)",
  });

  function Tabs({ view, setView }: { view: ViewMode; setView: (v: ViewMode) => void }) {
    return (
      <div className="flex gap-1">
        {(["semanal", "mensual", "trimestral"] as ViewMode[]).map(v => (
          <button key={v} style={tabStyle(view === v)} onClick={() => setView(v)}>{v}</button>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--t-bg-base)" }}>
      <DashboardHeader />
      <main ref={mainRef} className="max-w-7xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: "var(--t-text-primary)" }}>Panel Gerencial</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--t-text-muted)" }}>
              {loadingStatic ? "Cargando datos…" : "Datos en tiempo real"}
            </span>
            <button
              onClick={() => { fetchStatic(); fetchRanged(); }}
              disabled={loadingStatic || loadingRanged}
              title="Refrescar todos los datos"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "var(--t-bg-subtle)",
                border: "1px solid var(--t-border-card)",
                color: "var(--t-text-secondary)",
                opacity: (loadingStatic || loadingRanged) ? 0.5 : 1,
                cursor: (loadingStatic || loadingRanged) ? "not-allowed" : "pointer",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              Refrescar
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-xl p-4 mb-6 text-sm" style={{ background: "rgba(207,7,0,0.12)", border: "1px solid rgba(207,7,0,0.4)", color: "#e73137" }}>
            ⚠ {error}
          </div>
        )}

        {/* Row 1: KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 anim-section">
          {loadingStatic ? (
            [0,1,2,3].map(i => <Skeleton key={i} h="h-28" />)
          ) : (
            <>
              <AlertCard
                titulo="Backlog Crítico"
                valor={state.backlogCritico ?? "—"}
                mensaje="Tickets urgentes sin resolver"
              />
              <KpiCard
                titulo="Total Tickets"
                valor={state.saturacion?.totales.toLocaleString() ?? "—"}
                color="default"
              />
              <KpiCard
                titulo="Atendidos"
                valor={state.saturacion?.atendidos.toLocaleString() ?? "—"}
                color="green"
              />
              <div className="rounded-xl p-5" style={cardStyle}>
                <SectionTitle>Saturación Operativa</SectionTitle>
                <Gauge value={state.saturacion?.saturacion ?? null} />
              </div>
            </>
          )}
        </div>

        {/* Row 2: Tendencia + date filter */}
        <div className="rounded-xl p-5 mb-6 anim-section" style={cardStyle}>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <SectionTitle>Tendencia de Tickets</SectionTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <DateRange
                start={fechaInicio} end={fechaFin}
                onStart={setFechaInicio} onEnd={setFechaFin}
                onApply={fetchRanged} loading={loadingRanged}
              />
              <Tabs view={viewTend} setView={setViewTend} />
            </div>
          </div>
          {loadingRanged ? <Skeleton /> : ranged.tendencia ? (
            <TrendChart data={tendData} dataKey="tickets" label="Tickets" />
          ) : (
            <div className="h-48 flex items-center justify-center text-sm" style={{ color: "var(--t-text-muted)" }}>
              Sin datos para el rango seleccionado
            </div>
          )}
        </div>

        {/* Row 3: Incidentes Recurrentes + Categorías con Mayor Incidencia */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 anim-section">
          <div className="rounded-xl p-5" style={cardStyle}>
            <SectionTitle>Top 5 Incidentes Recurrentes</SectionTitle>
            {loadingStatic ? <Skeleton /> : state.recurrentes.length > 0 ? (
              <div className="space-y-1">
                {state.recurrentes.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "var(--t-border-subtle)" }}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "rgba(207,7,0,0.15)", color: "#e73137" }}>
                        {i + 1}
                      </span>
                      <span className="text-sm" style={{ color: "var(--t-text-primary)" }}>{item.categoria}</span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--t-text-secondary)" }}>
                      {item.ocurrencias.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>Sin datos</p>
            )}
          </div>

          <div className="rounded-xl p-5" style={cardStyle}>
            <SectionTitle>Categorías con Mayor Incidencia</SectionTitle>
            {loadingStatic ? <Skeleton /> : incidenciaPie.length > 0 ? (
              <DonutPie data={incidenciaPie} />
            ) : (
              <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>Sin datos</p>
            )}
          </div>
        </div>

        {/* Row 4: Demanda por Área + Comparativo Mensual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 anim-section">
          <div className="rounded-xl p-5" style={cardStyle}>
            <SectionTitle>Demanda por Área</SectionTitle>
            {loadingStatic ? <Skeleton /> : demandaHBar.length > 0 ? (
              <HBarChart data={demandaHBar} />
            ) : (
              <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>Sin datos</p>
            )}
          </div>

          <div className="rounded-xl p-5" style={cardStyle}>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <SectionTitle>Comparativo Mensual de Atención</SectionTitle>
              <Tabs view={viewComp} setView={setViewComp} />
            </div>
            {loadingRanged ? <Skeleton /> : compData.length > 0 ? (
              <VBarChart data={compVBar} dataKey="ticketsAtendidos" label="Atendidos" />
            ) : (
              <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>Sin datos para el rango</p>
            )}
          </div>
        </div>

        {/* Row 5: Mejora Continua */}
        <div className="rounded-xl p-5 anim-section" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>Indicadores de Mejora Continua</SectionTitle>
            {state.mejora && (
              <span className="text-xs font-medium" style={{ color: "var(--t-text-muted)" }}>
                Total tickets: {state.mejora.totalTickets.toLocaleString()}
              </span>
            )}
          </div>
          {loadingStatic ? <Skeleton h="h-40" /> : state.mejora ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <Indicador label="Tasa de reapertura" value={state.mejora.indicadores.tasaReaperturaPct} fmt="pct" />
              <Indicador label="Tickets reabiertos" value={state.mejora.indicadores.ticketsReabiertos} fmt="num" />
              <Indicador label="Cumplimiento SLA" value={state.mejora.indicadores.cumplimientoSlaPct} fmt="pct" />
              <Indicador label="Lead time mediano" value={state.mejora.indicadores.leadTimeMedianoHoras} fmt="h" />
              <Indicador label="Lead time promedio" value={state.mejora.indicadores.leadTimePromedioHoras} fmt="h" />
              <Indicador label="Resueltos en &lt;24 h" value={state.mejora.indicadores.resueltosMenos24hPct} fmt="pct" />
              <Indicador label="Resueltos en &lt;72 h" value={state.mejora.indicadores.resueltosMenos72hPct} fmt="pct" />
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>Sin datos de mejora continua</p>
          )}
        </div>

      </main>
    </div>
  );
}
