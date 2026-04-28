import { OperacionalData } from "@/types";

export const operacionalData: OperacionalData = {
  ticketsAbiertos: 42,
  ticketsCerrados: 128,
  backlog: 15,
  tmo: "02:45 hrs",
  tpr: "15 min",
  cumplimientoSLA: 92,
  reabiertos: 3,
  porPrioridad: [
    { name: "Alta", value: 10, color: "#cf0700" },
    { name: "Media", value: 22, color: "#e73137" },
    { name: "Baja", value: 10, color: "#bababa" },
  ],
  porCategoria: [
    { categoria: "Solicitud Operativa", count: 35 },
    { categoria: "Consulta", count: 28 },
    { categoria: "Incidente", count: 20 },
    { categoria: "Requerimiento", count: 18 },
    { categoria: "Cambio", count: 15 },
    { categoria: "Otros", count: 12 },
  ],
  porAnalista: [
    { nombre: "Alexia Trujillo", count: 32 },
    { nombre: "Francis Vargas", count: 28 },
    { nombre: "Jassmin Ramirez", count: 25 },
    { nombre: "Grace Estrella", count: 22 },
    { nombre: "Sin Asignar", count: 21 },
  ],
  porFuente: [
    { fuente: "Portal", count: 85 },
    { fuente: "Email", count: 43 },
  ],
  slaResumen: {
    withinSLA: 118,
    violated: 10,
  },
};
