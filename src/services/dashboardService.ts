import { BACKEND_URL } from "./config";

export interface InfoTicketsResponse {
  ticketsAbiertos: number;
  ticketsCerrados: number;
  backlogTickets: number;
}

export interface TiempoPromedioResponse {
  tiempoPromedio: number;
}

export interface TiempoPRResponse {
  tiempoPrimeraRespuesta: number;
}

export interface SLAResponse {
  withinSLA: number;
  violatedSLA: number;
}

export interface TicketsByResponse {
  diccionario: Record<string, number>;
}

// ── Endpoints consolidados por periodo ──────────

export interface RangoFechasResponse {
  fechaInicio: string;
  fechaFin: string;
  totalTickets: number;
}

export interface ReporteOperacionalResponse {
  periodo: { fechaInicio: string; fechaFin: string };
  ticketsCreados: number;
  ticketsAbiertos: number;
  ticketsCerrados: number;
  backlogTickets: number;
  promedioPrimeraRespuestaHoras: number | null;
  promedioAtencionHoras: number | null;
  cumplimientoSLA: { porcentaje: number | null; withinSLA: number; violatedSLA: number };
  ticketsPorPrioridad: Record<string, number>;
  ticketsPorTipo: Record<string, number>;
  ticketsPorAnalista: Record<string, number>;
  sinDatos: boolean;
}

/** Error de API con código de estado y detalle del backend. */
export class ApiError extends Error {
  constructor(public status: number, public detail?: string) {
    super(detail ?? `Error ${status}`);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    let detail: string | undefined;
    try {
      const body = await res.json();
      detail = typeof body?.detail === "string" ? body.detail : undefined;
    } catch {
      /* cuerpo no-JSON o vacío */
    }
    throw new ApiError(res.status, detail);
  }
  return res.json();
}

export const getInfoTickets = () =>
  apiFetch<InfoTicketsResponse>("/dashboard/getInfoTickets");

export const getTiempoPromedio = () =>
  apiFetch<TiempoPromedioResponse>("/dashboard/getTiempoPromedio");

export const getTiempoPrimeraRespuesta = () =>
  apiFetch<TiempoPRResponse>("/dashboard/getTiempoPrimeraRespuesta");

export const getCumplimientoSLA = () =>
  apiFetch<SLAResponse>("/dashboard/getCumplimientoSLA");

export const getTicketsBy = (by: "prioridad" | "categoria" | "reabiertos" | "analista") =>
  apiFetch<TicketsByResponse>(`/dashboard/getTicketsBy?by=${by}`);

export const getRangoFechas = () =>
  apiFetch<RangoFechasResponse>("/dashboard/getRangoFechas");

export const getReporteOperacional = (fechaInicio: string, fechaFin: string) =>
  apiFetch<ReporteOperacionalResponse>(
    `/dashboard/getReporteOperacional?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
  );
