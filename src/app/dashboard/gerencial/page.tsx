"use client";

import { useEffect } from "react";
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

export default function GerencialPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role !== "gerente") {
      router.replace("/dashboard/operacional");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-promotick-gray">Cargando...</p>
      </div>
    );
  }

  const d = gerencialData;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-promotick-charcoal">Panel Gerencial</h2>
          <span className="text-sm text-promotick-gray">Actualizacion 1x/dia</span>
        </div>

        {/* Top: Tendencia + Backlog critico + Saturacion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <LineChartTrend data={d.tendencia} titulo="Tendencia de Tickets" />
          </div>
          <div className="space-y-4">
            <AlertCard
              titulo="Backlog Critico"
              valor={d.backlogCritico}
              mensaje="Tickets urgentes no resueltos"
            />
            <GaugeChart value={d.saturacion} titulo="Saturacion Operativa" />
          </div>
        </div>

        {/* Incidentes recurrentes */}
        <div className="bg-white rounded-xl border border-promotick-gray-lighter p-5 shadow-sm mb-6">
          <p className="text-sm font-medium text-promotick-gray mb-3">Top 5 Incidentes Recurrentes</p>
          <div className="space-y-2">
            {d.recurrentes.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-promotick-gray-lightest last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-red-100 text-promotick-red rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-promotick-dark">{item.problema}</span>
                </div>
                <span className="text-sm font-semibold text-promotick-gray-dark">{item.count} tickets</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <PieChartIncidencia data={d.incidencia} titulo="Categorias con Mayor Incidencia" />
          <StackedBarChart data={d.demandaEmpresa} titulo="Demanda por Empresa" />
        </div>

        {/* Comparativo + Mejora continua */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GroupedBarChart data={d.comparativo} titulo="Comparativo Mensual" />
          <div className="bg-white rounded-xl border border-promotick-gray-lighter p-5 shadow-sm">
            <p className="text-sm font-medium text-promotick-gray mb-3">Indicadores de Mejora Continua</p>
            <ul className="space-y-3">
              {d.mejoraContinua.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-promotick-red rounded-full shrink-0" />
                  <span className="text-sm text-promotick-gray-dark">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
