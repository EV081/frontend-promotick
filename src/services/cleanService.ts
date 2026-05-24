import {
  CleanRunResponse,
  CleanStatusResponse,
} from "@/interfaces/api";
import { BACKEND_URL } from "./config";

/**
 * POST /clean/run
 * Ejecuta el pipeline completo de limpieza sobre el archivo cargado.
 * @param filename - Nombre del archivo a limpiar (opcional; usa el último si se omite).
 */
export async function runCleanPipeline(
  filename?: string
): Promise<CleanRunResponse> {
  const url = new URL(`${BACKEND_URL}/clean/run`);
  if (filename) url.searchParams.set("filename", filename);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Length": "0" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? `Error ${res.status}: clean/run`);
  }

  return res.json();
}

/**
 * GET /clean/download
 * Descarga el CSV limpio generado.
 * Devuelve un Blob para que el consumidor decida cómo manejarlo
 * (disparar descarga, pasar a URL.createObjectURL, etc.).
 * @param filename - Nombre del archivo original (opcional).
 */
export async function downloadCleanCsv(filename?: string): Promise<Blob> {
  const url = new URL(`${BACKEND_URL}/clean/download`);
  if (filename) url.searchParams.set("filename", filename);

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Error ${res.status}: clean/download`);
  }

  return res.blob();
}

/**
 * GET /clean/status
 * Muestra qué archivos ya fueron procesados y están disponibles.
 * Apto para Server Components.
 */
export async function getCleanStatus(): Promise<CleanStatusResponse> {
  const res = await fetch(`${BACKEND_URL}/clean/status`, {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: clean/status`);
  }

  return res.json();
}

/**
 * Helper de cliente: dispara la descarga del CSV en el browser.
 * Llamar únicamente desde Client Components.
 */
export async function triggerCsvDownload(filename?: string): Promise<void> {
  const blob = await downloadCleanCsv(filename);
  const objectUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename
    ? `${filename.replace(/\.[^.]+$/, "")}_clean.csv`
    : "tickets_promotick_clean.csv";
  anchor.click();

  URL.revokeObjectURL(objectUrl);
}
