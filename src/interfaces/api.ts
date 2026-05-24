// ─────────────────────────────────────────────
// Interfaces para la Promotick Data API
// Corresponden 1-a-1 con los schemas de respuesta
// ─────────────────────────────────────────────

// ── Upload ────────────────────────────────────

/** Respuesta de POST /upload/file */
export interface UploadFileResponse {
  message: string;
  filename: string;
  size_mb: number;
  filas_detectadas: number;
  columnas_detectadas: number;
  columnas: string[];
  archivos_disponibles: string[];
}

/** Item dentro de GET /upload/files */
export interface UploadedFileItem {
  filename: string;
  filas: number;
  columnas: number;
}

/** Respuesta de GET /upload/files */
export interface ListFilesResponse {
  archivos: UploadedFileItem[];
  total: number;
}

// ── Clean ─────────────────────────────────────

/** Métricas de negocio calculadas en el pipeline */
export interface MetricasNegocio {
  total_backlog_critico: number;
  total_tickets_abiertos: number;
  total_cumple_sla: number;
  total_incumple_sla: number;
}

/** Resumen estadístico que devuelve POST /clean/run */
export interface CleanResumen {
  filas: number;
  columnas: number;
  columnas_lista: string[];
  tipos_de_dato: Record<string, string>;
  nulos_por_columna: Record<string, number>;
  metricas_negocio: MetricasNegocio;
}

/** Respuesta de POST /clean/run */
export interface CleanRunResponse {
  message: string;
  archivo_origen: string;
  output_filename: string;
  download_url: string;
  resumen: CleanResumen;
}

/** Item dentro de GET /clean/status */
export interface CleanFileItem {
  filename: string;
  filas_limpias: number;
  columnas_limpias: number;
  columnas: string[];
}

/** Respuesta de GET /clean/status */
export interface CleanStatusResponse {
  archivos_limpios: CleanFileItem[];
  total: number;
}

// ── Root / Health ─────────────────────────────

/** Respuesta de GET / */
export interface RootResponse {
  message: string;
  docs: string;
  endpoints: Record<string, string>;
}

/** Respuesta de GET /health */
export interface HealthResponse {
  status: "ok" | string;
}
