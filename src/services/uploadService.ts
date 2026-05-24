import {
  UploadFileResponse,
  ListFilesResponse,
} from "@/interfaces/api";
import { BACKEND_URL } from "./config";

/**
 * POST /upload/file
 * Sube un archivo XLS / XLSX / CSV al backend.
 * Se usa desde un Client Component (FormData del browser).
 */
export async function uploadFile(file: File): Promise<UploadFileResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BACKEND_URL}/upload/file`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? `Error ${res.status}: upload/file`);
  }

  return res.json();
}

/**
 * GET /upload/files
 * Lista los archivos actualmente cargados en memoria.
 * Puede usarse desde Server Components (no usa estado del browser).
 */
export async function listUploadedFiles(): Promise<ListFilesResponse> {
  const res = await fetch(`${BACKEND_URL}/upload/files`, {
    next: { revalidate: 0 }, // no cachear — datos en memoria del backend
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: upload/files`);
  }

  return res.json();
}
