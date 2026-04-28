"use client";

import { useEffect } from "react";
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

export default function OperacionalPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role !== "soporte") {
      router.replace("/dashboard/gerencial");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-promotick-gray">Cargando...</p>
      </div>
    );
  }

  const d = operacionalData;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-promotick-charcoal">Panel Operacional</h2>
          <span className="text-sm text-promotick-gray">Actualizacion 4x/dia</span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <KpiCard titulo="Tickets Abiertos" valor={d.ticketsAbiertos} color="dark" />
          <KpiCard titulo="Tickets Cerrados" valor={d.ticketsCerrados} color="green" />
          <KpiCard titulo="Backlog" valor={d.backlog} color={d.backlog > 10 ? "red" : "yellow"} />
          <KpiCard titulo="Tiempo Prom. Atencion" valor={d.tmo} />
          <KpiCard titulo="Primera Respuesta" valor={d.tpr} />
        </div>

        {/* SLA + Reabiertos + Prioridad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <GaugeChart value={d.cumplimientoSLA} titulo="Cumplimiento SLA" />
          <AlertCard
            titulo="Tickets Reabiertos"
            valor={d.reabiertos}
            mensaje="Incidencias que volvieron a fallar"
          />
          <DonutChart data={d.porPrioridad} titulo="Tickets por Prioridad" />
        </div>

        {/* SLA Resumen + Fuente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-promotick-gray-lighter p-5 shadow-sm">
            <p className="text-sm font-medium text-promotick-gray mb-3">Estado de SLA</p>
            <div className="flex gap-4">
              <div className="flex-1 bg-green-50 rounded-lg p-4 text-center border border-green-200">
                <p className="text-2xl font-bold text-green-600">{d.slaResumen.withinSLA}</p>
                <p className="text-xs text-green-700 mt-1">Within SLA</p>
              </div>
              <div className="flex-1 bg-red-50 rounded-lg p-4 text-center border border-promotick-red">
                <p className="text-2xl font-bold text-promotick-red">{d.slaResumen.violated}</p>
                <p className="text-xs text-promotick-red-dark mt-1">SLA Violated</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-promotick-gray-lighter p-5 shadow-sm">
            <p className="text-sm font-medium text-promotick-gray mb-3">Tickets por Fuente</p>
            <div className="space-y-3">
              {d.porFuente.map((item) => (
                <div key={item.fuente} className="flex items-center justify-between">
                  <span className="text-sm text-promotick-dark">{item.fuente}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-3 bg-promotick-gray-lightest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-promotick-red rounded-full"
                        style={{ width: `${(item.count / 128) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-promotick-dark w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BarChartVertical data={d.porCategoria} titulo="Tickets por Categoria" />
          <BarChartHorizontal data={d.porAnalista} titulo="Tickets por Analista" />
        </div>
      </main>
    </div>
  );
}
