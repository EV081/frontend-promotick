import { HealthResponse, RootResponse } from "@/interfaces/api";
import { BACKEND_URL } from "./config";

/**
 * GET /
 * Estado general de la API.
 */
export async function getApiRoot(): Promise<RootResponse> {
  const res = await fetch(`${BACKEND_URL}/`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`Error ${res.status}: /`);
  return res.json();
}

/**
 * GET /health
 * Health check del backend.
 */
export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BACKEND_URL}/health`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Error ${res.status}: /health`);
  return res.json();
}
