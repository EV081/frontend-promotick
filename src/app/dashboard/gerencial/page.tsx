"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import AlertCard from "@/components/ui/AlertCard";
import GaugeChart from "@/components/charts/GaugeChart";
import LineChartTrend from "@/components/charts/LineChartTrend";
import PieChartIncidencia from "@/components/charts/PieChartIncidencia";
import StackedBarChart from "@/components/charts/StackedBarChart";
import GroupedBarChart from "@/components/charts/GroupedBarChart";
import { gerencialData } from "@/data/gerencial";
import { getInfoTickets, getTicketsBy } from "@/services/dashboardService";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const cardStyle = {
  background: "var(--t-bg-card)",
  border: "1px solid var(--t-border-card)",
  boxShadow: "var(--t-shadow-card)",
};

const CAT_COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#f43f5e", "#8b5cf6"];

interface GerencialLive {
  backlogCritico: number;
  incidencia: { cat: string; value: number }[];
}

export default function GerencialPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const [liveData, setLiveData] = useState<GerencialLive | null>(null);

  useGSAP(() => {
    const sections = mainRef.current?.querySelectorAll(".anim-section");
    if (sections && sections.length > 0) {
      gsap.from(sections, { y: 24, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
    }
  }, { scope: mainRef, dependencies: [liveData] });

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role !== "gerente") {
      router.replace("/dashboard/operacional");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== "gerente") return;

    Promise.allSettled([
      getInfoTickets(),
      getTicketsBy("categoria"),
    ]).then(([info, cat]) => {
      if (info.status === "rejected") return;

      const catDict = cat.status === "fulfilled" ? cat.value.diccionario : {};
      setLiveData({
        backlogCritico: info.value.backlogTickets,
        incidencia: Object.entries(catDict).map(([cat, value], i) => ({
          cat,
          value,
          color: CAT_COLORS[i % CAT_COLORS.length],
        })),
      });
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

  const d = gerencialData;
  const backlogCritico = liveData?.backlogCritico ?? d.backlogCritico;
  const incidencia = liveData && liveData.incidencia.length > 0 ? liveData.incidencia : d.incidencia;

  return (
    <div className="min-h-screen" style={{ background: "var(--t-bg-base)" }}>
      <DashboardHeader />
      <main ref={mainRef} className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: "var(--t-text-primary)" }}>Panel Gerencial</h2>
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--t-text-muted)" }}>
            {liveData ? "Datos en tiempo real" : "Datos de muestra"}
          </span>
        </div>

        {/* Top: Tendencia + Backlog critico + Saturacion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 anim-section">
          <div className="lg:col-span-2">
            <LineChartTrend data={d.tendencia} titulo="Tendencia de Tickets" />
          </div>
          <div className="space-y-4">
            <AlertCard titulo="Backlog Critico" valor={backlogCritico} mensaje="Tickets urgentes no resueltos" />
            <GaugeChart value={d.saturacion} titulo="Saturacion Operativa" />
          </div>
        </div>

        {/* Incidentes recurrentes */}
        <div className="rounded-xl p-5 mb-6 anim-section" style={cardStyle}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--t-text-muted)" }}>
            Top 5 Incidentes Recurrentes
          </p>
          <div className="space-y-2">
            {d.recurrentes.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: "var(--t-border-subtle)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "rgba(207,7,0,0.15)", color: "#e73137" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm" style={{ color: "var(--t-text-primary)" }}>{item.problema}</span>
                </div>
                <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--t-text-secondary)" }}>
                  {item.count} tickets
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 anim-section">
          <PieChartIncidencia data={incidencia} titulo="Categorias con Mayor Incidencia" />
          <StackedBarChart data={d.demandaEmpresa} titulo="Demanda por Empresa" />
        </div>

        {/* Comparativo + Mejora continua */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 anim-section">
          <GroupedBarChart data={d.comparativo} titulo="Comparativo Mensual" />
          <div className="rounded-xl p-5" style={cardStyle}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--t-text-muted)" }}>
              Indicadores de Mejora Continua
            </p>
            <ul className="space-y-3">
              {d.mejoraContinua.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 bg-promotick-red rounded-full shrink-0" />
                  <span className="text-sm" style={{ color: "var(--t-text-secondary)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
