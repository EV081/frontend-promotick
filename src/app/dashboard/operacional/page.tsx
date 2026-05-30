"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import KpiCard from "@/components/ui/KpiCard";
import GaugeChart from "@/components/charts/GaugeChart";
import DonutChart from "@/components/charts/DonutChart";
import BarChartVertical from "@/components/charts/BarChartVertical";
import BarChartHorizontal from "@/components/charts/BarChartHorizontal";
import PeriodSelector, { Periodo } from "@/components/ui/PeriodSelector";
import {
  getRangoFechas,
  getReporteOperacional,
  ApiError,
  RangoFechasResponse,
  ReporteOperacionalResponse,
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

function formatHours(h: number | null): string {
  if (h == null) return "—";
  if (h < 1) return `${Math.round(h * 60)} min`;
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export default function OperacionalPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  const [rango, setRango] = useState<RangoFechasResponse | null>(null);
  const [periodo, setPeriodo] = useState<Periodo | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [report, setReport] = useState<ReporteOperacionalResponse | null>(null);
  const [loadingRango, setLoadingRango] = useState(true);
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [noClean, setNoClean] = useState(false);
  const [periodoError, setPeriodoError] = useState<string | null>(null);
  const reqIdRef = useRef(0);

  const showReport = report != null && !report.sinDatos;

  useGSAP(() => {
    const cards = mainRef.current?.querySelectorAll(".kpi-card");
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
    const sections = mainRef.current?.querySelectorAll(".anim-section");
    if (sections && sections.length > 0) {
      gsap.fromTo(
        sections,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.3 }
      );
    }
  }, { scope: mainRef });

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role !== "soporte") {
      router.replace("/dashboard/gerencial");
    }
  }, [user, isLoading, router]);

  // Cargar rango de fechas disponible al entrar
  useEffect(() => {
    if (!user || user.role !== "soporte") return;
    setLoadingRango(true);
    getRangoFechas()
      .then((r) => {
        setRango(r);
        setNoClean(false);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNoClean(true);
      })
      .finally(() => setLoadingRango(false));
  }, [user]);

  const handlePeriodoChange = (fechaInicio: string, fechaFin: string, presetId: string | null) => {
    setPeriodo({ fechaInicio, fechaFin });
    setActivePreset(presetId);
    setPeriodoError(null);
    setLoadingReporte(true);
    const reqId = ++reqIdRef.current;
    getReporteOperacional(fechaInicio, fechaFin)
      .then((data) => {
        if (reqId !== reqIdRef.current) return;
        setReport(data);
        setNoClean(false);
      })
      .catch((err) => {
        if (reqId !== reqIdRef.current) return;
        setReport(null);
        if (err instanceof ApiError && err.status === 404) {
          setNoClean(true);
        } else if (err instanceof ApiError && err.status === 422) {
          setPeriodoError(err.detail ?? "Periodo inválido.");
        } else {
          setPeriodoError("No se pudo cargar el reporte.");
        }
      })
      .finally(() => {
        if (reqId !== reqIdRef.current) return;
        setLoadingReporte(false);
      });
  };

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

  const priorityData = report
    ? Object.entries(report.ticketsPorPrioridad).map(([name, value]) => ({
        name,
        value,
        color: getPriorityColor(name),
      }))
    : [];
  const tipoData = report
    ? Object.entries(report.ticketsPorTipo).map(([categoria, count]) => ({ categoria, count }))
    : [];
  const analistaData = report
    ? Object.entries(report.ticketsPorAnalista).map(([nombre, count]) => ({ nombre, count }))
    : [];

  return (
    <div className="min-h-screen" style={{ background: "var(--t-bg-base)" }}>
      <DashboardHeader />
      <main ref={mainRef} className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: "var(--t-text-primary)" }}>Panel Operacional</h2>
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--t-text-muted)" }}>
            {loadingReporte ? "Cargando datos…" : showReport ? "Datos en tiempo real" : ""}
          </span>
        </div>

        {/* Estado sin datos limpios cargados */}
        {!loadingRango && noClean && (
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

        {/* Selector de periodo */}
        {!noClean && (
          <div className="mb-6">
            <PeriodSelector
              rango={rango ? { fechaInicio: rango.fechaInicio, fechaFin: rango.fechaFin } : null}
              value={periodo}
              activePreset={activePreset}
              onChange={handlePeriodoChange}
              disabled={loadingRango}
            />
          </div>
        )}

        {/* Error de periodo (422) */}
        {periodoError && (
          <div
            className="rounded-xl p-4 mb-6 text-sm"
            style={{ background: "rgba(207,7,0,0.08)", border: "1px solid rgba(207,7,0,0.3)", color: "#cf0700" }}
          >
            {periodoError}
          </div>
        )}

        {/* Guía: aún no se elige periodo */}
        {!noClean && !periodo && !loadingRango && (
          <div
            className="rounded-xl p-8 flex flex-col items-center gap-2 text-center anim-section"
            style={cardStyle}
          >
            <p className="font-semibold" style={{ color: "var(--t-text-primary)" }}>Selecciona un periodo</p>
            <p className="text-sm max-w-sm" style={{ color: "var(--t-text-muted)" }}>
              Elige un rango de fechas arriba para ver el reporte operacional.
            </p>
          </div>
        )}

        {/* Periodo sin tickets */}
        {!noClean && periodo && report?.sinDatos && !loadingReporte && (
          <div
            className="rounded-xl p-8 flex flex-col items-center gap-2 text-center anim-section"
            style={cardStyle}
          >
            <p className="font-semibold" style={{ color: "var(--t-text-primary)" }}>Sin tickets en el periodo</p>
            <p className="text-sm max-w-sm" style={{ color: "var(--t-text-muted)" }}>
              No hay tickets en el periodo seleccionado. Prueba con otro rango de fechas.
            </p>
          </div>
        )}

        {showReport && report && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <KpiCard titulo="Tickets Creados" valor={report.ticketsCreados} className="kpi-card" />
              <KpiCard titulo="Tickets Abiertos" valor={report.ticketsAbiertos} color="dark" className="kpi-card" />
              <KpiCard titulo="Tickets Cerrados" valor={report.ticketsCerrados} color="green" className="kpi-card" />
              <KpiCard titulo="Backlog" valor={report.backlogTickets} color={report.backlogTickets > 10 ? "red" : "yellow"} className="kpi-card" />
              <KpiCard titulo="Tiempo Prom. Atencion" valor={formatHours(report.promedioAtencionHoras)} className="kpi-card" />
              <KpiCard titulo="Primera Respuesta" valor={formatHours(report.promedioPrimeraRespuestaHoras)} className="kpi-card" />
            </div>

            {/* SLA + Prioridad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 anim-section">
              <GaugeChart value={Math.round(report.cumplimientoSLA.porcentaje ?? 0)} titulo="Cumplimiento SLA" />
              <DonutChart data={priorityData} titulo="Tickets por Prioridad" />
            </div>

            {/* SLA Resumen */}
            <div className="grid grid-cols-1 gap-4 mb-6 anim-section">
              <div className="rounded-xl p-5" style={cardStyle}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--t-text-muted)" }}>
                  Estado de SLA
                </p>
                <div className="flex gap-4">
                  <div className="flex-1 rounded-lg p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
                    <p className="text-2xl font-bold tabular-nums" style={{ color: "#22c55e" }}>{report.cumplimientoSLA.withinSLA}</p>
                    <p className="text-xs mt-1" style={{ color: "#16a34a" }}>Within SLA</p>
                  </div>
                  <div className="flex-1 rounded-lg p-4 text-center" style={{ background: "rgba(207,7,0,0.08)", border: "1px solid rgba(207,7,0,0.3)" }}>
                    <p className="text-2xl font-bold tabular-nums" style={{ color: "#e73137" }}>{report.cumplimientoSLA.violatedSLA}</p>
                    <p className="text-xs mt-1" style={{ color: "#cf0700" }}>SLA Violated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 anim-section">
              <BarChartVertical data={tipoData} titulo="Tickets por Tipo" />
              <BarChartHorizontal data={analistaData} titulo="Tickets por Analista" />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
