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

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Error ${res.status} en ${path}`);
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
