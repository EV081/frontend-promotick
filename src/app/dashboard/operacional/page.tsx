"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import KpiCard from "@/components/ui/KpiCard";
import AlertCard from "@/components/ui/AlertCard";
import GaugeChart from "@/components/charts/GaugeChart";
import DonutChart from "@/components/charts/DonutChart";
import BarChartVertical from "@/components/charts/BarChartVertical";
import BarChartHorizontal from "@/components/charts/BarChartHorizontal";
import { operacionalData } from "@/data/operacional";
import {
  getInfoTickets,
  getTiempoPromedio,
  getTiempoPrimeraRespuesta,
  getCumplimientoSLA,
  getTicketsBy,
} from "@/services/dashboardService";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const cardStyle = {
  background: "var(--t-bg-card)",
  border: "1px solid var(--t-border-card)",
  boxShadow: "var(--t-shadow-card)",
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#cf0700",
  high:   "#f43f5e",
  medium: "#f59e0b",
  low:    "#64748b",
  alta:   "#f43f5e",
  media:  "#f59e0b",
  baja:   "#64748b",
};

function getPriorityColor(name: string): string {
  return PRIORITY_COLORS[name.toLowerCase()] ?? "#6366f1";
}

function formatHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)} min`;
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

function extractReabiertos(dict: Record<string, number>): number {
  const key = Object.keys(dict).find((k) =>
    /reabiert|^s[ií]$/i.test(k)
  );
  if (key) return dict[key];
  const vals = Object.values(dict);
  return vals.length === 1 ? vals[0] : Math.min(...vals);
}

interface OperacionalLive {
  ticketsAbiertos: number;
  ticketsCerrados: number;
  backlog: number;
  tmo: string;
  tpr: string;
  cumplimientoSLA: number;
  slaResumen: { withinSLA: number; violated: number };
  reabiertos: number;
  porPrioridad: { name: string; value: number; color: string }[];
  porCategoria: { categoria: string; count: number }[];
  porAnalista: { nombre: string; count: number }[];
}

export default function OperacionalPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<OperacionalLive | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useGSAP(() => {
    const cards = mainRef.current?.querySelectorAll(".kpi-card");
    if (cards && cards.length > 0) {
      gsap.from(cards, { y: 30, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" });
    }
    const sections = mainRef.current?.querySelectorAll(".anim-section");
    if (sections && sections.length > 0) {
      gsap.from(sections, { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.3 });
    }
  }, { scope: mainRef, dependencies: [data] });

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role !== "soporte") {
      router.replace("/dashboard/gerencial");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== "soporte") return;

    Promise.allSettled([
      getInfoTickets(),
      getTiempoPromedio(),
      getTiempoPrimeraRespuesta(),
      getCumplimientoSLA(),
      getTicketsBy("prioridad"),
      getTicketsBy("categoria"),
      getTicketsBy("analista"),
      getTicketsBy("reabiertos"),
    ]).then(([info, tmo, tpr, sla, prio, cat, anal, reab]) => {
      if (info.status === "rejected") {
        setFetchLoading(false);
        return;
      }

      const infoVal = info.value;
      const slaVal = sla.status === "fulfilled" ? sla.value : null;
      const prioVal = prio.status === "fulfilled" ? prio.value.diccionario : {};
      const catVal = cat.status === "fulfilled" ? cat.value.diccionario : {};
      const analVal = anal.status === "fulfilled" ? anal.value.diccionario : {};
      const reabVal = reab.status === "fulfilled" ? reab.value.diccionario : null;

      const withinSLA = slaVal?.withinSLA ?? 0;
      const violatedSLA = slaVal?.violatedSLA ?? 0;
      const total = withinSLA + violatedSLA;

      setData({
        ticketsAbiertos: infoVal.ticketsAbiertos,
        ticketsCerrados: infoVal.ticketsCerrados,
        backlog: infoVal.backlogTickets,
        tmo: tmo.status === "fulfilled" ? formatHours(tmo.value.tiempoPromedio) : "—",
        tpr: tpr.status === "fulfilled" ? formatHours(tpr.value.tiempoPrimeraRespuesta) : "—",
        cumplimientoSLA: total > 0 ? Math.round((withinSLA / total) * 100) : 0,
        slaResumen: { withinSLA, violated: violatedSLA },
        reabiertos: reabVal ? extractReabiertos(reabVal) : 0,
        porPrioridad: Object.entries(prioVal).map(([name, value]) => ({
          name,
          value,
          color: getPriorityColor(name),
        })),
        porCategoria: Object.entries(catVal).map(([categoria, count]) => ({ categoria, count })),
        porAnalista: Object.entries(analVal).map(([nombre, count]) => ({ nombre, count })),
      });
      setFetchLoading(false);
    });
  }, [user]);

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

  const d = data ?? operacionalData;

  return (
    <div className="min-h-screen" style={{ background: "var(--t-bg-base)" }}>
      <DashboardHeader />
      <main ref={mainRef} className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: "var(--t-text-primary)" }}>Panel Operacional</h2>
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--t-text-muted)" }}>
            {fetchLoading ? "Cargando datos…" : data ? "Datos en tiempo real" : "Datos de muestra"}
          </span>
        </div>

        {/* Estado sin datos */}
        {!fetchLoading && !data && (
          <div
            className="rounded-xl p-8 mb-6 flex flex-col items-center gap-3 text-center anim-section"
            style={{ background: "var(--t-bg-card)", border: "1px solid var(--t-border-card)" }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(207,7,0,0.1)" }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#cf0700" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="font-semibold" style={{ color: "var(--t-text-primary)" }}>Sin datos cargados</p>
            <p className="text-sm max-w-sm" style={{ color: "var(--t-text-muted)" }}>
              Usa el menú <strong>Archivos</strong> en la barra superior para subir un archivo y ejecutar el pipeline de limpieza.
            </p>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <KpiCard titulo="Tickets Abiertos" valor={d.ticketsAbiertos} color="dark" className="kpi-card" />
          <KpiCard titulo="Tickets Cerrados" valor={d.ticketsCerrados} color="green" className="kpi-card" />
          <KpiCard titulo="Backlog" valor={d.backlog} color={d.backlog > 10 ? "red" : "yellow"} className="kpi-card" />
          <KpiCard titulo="Tiempo Prom. Atencion" valor={d.tmo} className="kpi-card" />
          <KpiCard titulo="Primera Respuesta" valor={d.tpr} className="kpi-card" />
        </div>

        {/* SLA + Reabiertos + Prioridad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 anim-section">
          <GaugeChart value={d.cumplimientoSLA} titulo="Cumplimiento SLA" />
          <AlertCard titulo="Tickets Reabiertos" valor={d.reabiertos} mensaje="Incidencias que volvieron a fallar" />
          <DonutChart data={d.porPrioridad} titulo="Tickets por Prioridad" />
        </div>

        {/* SLA Resumen + Fuente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 anim-section">
          <div className="rounded-xl p-5" style={cardStyle}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--t-text-muted)" }}>
              Estado de SLA
            </p>
            <div className="flex gap-4">
              <div className="flex-1 rounded-lg p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
                <p className="text-2xl font-bold tabular-nums" style={{ color: "#22c55e" }}>{d.slaResumen.withinSLA}</p>
                <p className="text-xs mt-1" style={{ color: "#16a34a" }}>Within SLA</p>
              </div>
              <div className="flex-1 rounded-lg p-4 text-center" style={{ background: "rgba(207,7,0,0.08)", border: "1px solid rgba(207,7,0,0.3)" }}>
                <p className="text-2xl font-bold tabular-nums" style={{ color: "#e73137" }}>{d.slaResumen.violated}</p>
                <p className="text-xs mt-1" style={{ color: "#cf0700" }}>SLA Violated</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-5" style={cardStyle}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--t-text-muted)" }}>
              Tickets por Fuente
            </p>
            <div className="space-y-3">
              {operacionalData.porFuente.map((item) => (
                <div key={item.fuente} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--t-text-primary)" }}>{item.fuente}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: "var(--t-border-subtle)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(item.count / 128) * 100}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }} />
                    </div>
                    <span className="text-sm font-semibold w-8 text-right tabular-nums" style={{ color: "var(--t-text-primary)" }}>{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 anim-section">
          <BarChartVertical data={d.porCategoria} titulo="Tickets por Categoria" />
          <BarChartHorizontal data={d.porAnalista} titulo="Tickets por Analista" />
        </div>
      </main>
    </div>
  );
}
