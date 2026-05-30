import { BACKEND_URL } from "./config";

// ── Legacy endpoints (operacional) ────────────────────────────────────────────
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

// ── Gerencial endpoint types ───────────────────────────────────────────────────
export interface PeriodoBin {
  periodo: string;
  tickets: number;
}

export interface TendenciaTicketsResponse {
  rango: { inicio: string; fin: string };
  semanal: PeriodoBin[];
  mensual: PeriodoBin[];
  trimestral: PeriodoBin[];
}

export interface BacklogCriticoResponse {
  backlogCritico: number;
}

export interface IncidenteRecurrente {
  categoria: string;
  ocurrencias: number;
}

export interface IncidentesRecurrentesResponse {
  recurrentes: IncidenteRecurrente[];
}

export interface CategoriaIncidencia {
  categoria: string;
  ocurrencias: number;
}

export interface CategoriasMayorIncidenciaResponse {
  top: CategoriaIncidencia | null;
  ranking: CategoriaIncidencia[];
}

export interface SaturacionOperativaResponse {
  totales: number;
  atendidos: number;
  saturacion: number | null;
}

export interface AreaDemanda {
  area: string;
  tickets: number;
}

export interface DemandaPorAreaResponse {
  demanda: AreaDemanda[];
}

export interface PeriodoBinAtencion {
  periodo: string;
  ticketsAtendidos: number;
}

export interface ComparativoMensualResponse {
  rango: { inicio: string; fin: string };
  totalAtendidos: number;
  semanal: PeriodoBinAtencion[];
  mensual: PeriodoBinAtencion[];
  trimestral: PeriodoBinAtencion[];
}

export interface MejoraContinuaIndicadores {
  tasaReaperturaPct?: number;
  ticketsReabiertos?: number;
  cumplimientoSlaPct?: number;
  leadTimeMedianoHoras?: number;
  leadTimePromedioHoras?: number;
  resueltosMenos24hPct?: number;
  resueltosMenos72hPct?: number;
}

export interface MejoraContinuaResponse {
  totalTickets: number;
  indicadores: MejoraContinuaIndicadores;
}

// ── Endpoints consolidados por periodo (operacional) ───────────────────────────
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

// ── Generic fetch helper ───────────────────────────────────────────────────────
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

// ── Legacy calls ───────────────────────────────────────────────────────────────
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

// ── Gerencial calls ────────────────────────────────────────────────────────────
export const getTendenciaTickets = (fechaInicio: string, fechaFin: string) =>
  apiFetch<TendenciaTicketsResponse>(
    `/dashboard/gerencial/tendenciaTickets?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
  );

export const getBacklogCritico = () =>
  apiFetch<BacklogCriticoResponse>("/dashboard/gerencial/backlogCritico");

export const getIncidentesRecurrentes = (limit = 5) =>
  apiFetch<IncidentesRecurrentesResponse>(
    `/dashboard/gerencial/incidentesRecurrentes?limit=${limit}`
  );

export const getCategoriasMayorIncidencia = () =>
  apiFetch<CategoriasMayorIncidenciaResponse>("/dashboard/gerencial/categoriasMayorIncidencia");

export const getSaturacionOperativa = () =>
  apiFetch<SaturacionOperativaResponse>("/dashboard/gerencial/saturacionOperativa");

export const getDemandaPorArea = () =>
  apiFetch<DemandaPorAreaResponse>("/dashboard/gerencial/demandaPorArea");

export const getComparativoMensual = (fechaInicio: string, fechaFin: string) =>
  apiFetch<ComparativoMensualResponse>(
    `/dashboard/gerencial/comparativoMensualAtencion?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
  );

export const getMejoraContinua = () =>
  apiFetch<MejoraContinuaResponse>("/dashboard/gerencial/mejoraContinua");
