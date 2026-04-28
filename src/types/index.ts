export type Role = "gerente" | "soporte";

export interface User {
  email: string;
  nombre: string;
  role: Role;
}

export interface OperacionalData {
  ticketsAbiertos: number;
  ticketsCerrados: number;
  backlog: number;
  tmo: string;
  tpr: string;
  cumplimientoSLA: number;
  reabiertos: number;
  porPrioridad: { name: string; value: number; color: string }[];
  porCategoria: { categoria: string; count: number }[];
  porAnalista: { nombre: string; count: number }[];
  porFuente: { fuente: string; count: number }[];
  slaResumen: { withinSLA: number; violated: number };
}

export interface GerencialData {
  tendencia: { fecha: string; tickets: number }[];
  backlogCritico: number;
  recurrentes: { problema: string; count: number }[];
  incidencia: { cat: string; value: number }[];
  saturacion: number;
  demandaEmpresa: { empresa: string; alta: number; media: number; baja: number }[];
  comparativo: { mes: string; actual: number; anterior: number }[];
  mejoraContinua: string[];
}
