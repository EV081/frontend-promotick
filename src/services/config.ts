/**
 * Base URL del backend.
 * Se lee de la variable de entorno NEXT_PUBLIC_BACKEND_URL (definida en .env).
 * En Server Components se puede leer directamente; en Client Components
 * el prefijo NEXT_PUBLIC_ la expone al navegador.
 */
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
