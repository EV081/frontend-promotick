"use client";

import { useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { uploadFile, listUploadedFiles } from "@/services/uploadService";
import { runCleanPipeline, getCleanStatus } from "@/services/cleanService";
import type {
  UploadFileResponse,
  ListFilesResponse,
  CleanRunResponse,
  CleanStatusResponse,
} from "@/interfaces/api";

type Panel = "upload" | "files" | "status" | null;

export default function FilesMenu() {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadFileResponse | null>(null);
  const [cleanResult, setCleanResult] = useState<CleanRunResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [filesData, setFilesData] = useState<ListFilesResponse | null>(null);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<CleanStatusResponse | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  function openPanel(panel: Panel) {
    setActivePanel(panel);
    if (panel === "files") fetchFiles();
    if (panel === "status") fetchStatus();
  }

  async function fetchFiles() {
    setFilesLoading(true);
    setFilesError(null);
    try {
      const data = await listUploadedFiles();
      setFilesData(data);
    } catch (e: unknown) {
      setFilesError(e instanceof Error ? e.message : "Error al listar archivos");
    } finally {
      setFilesLoading(false);
    }
  }

  async function fetchStatus() {
    setStatusLoading(true);
    setStatusError(null);
    try {
      const data = await getCleanStatus();
      setStatusData(data);
    } catch (e: unknown) {
      setStatusError(e instanceof Error ? e.message : "Error al obtener estado");
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    setUploadResult(null);
    setCleanResult(null);
    try {
      const uploaded = await uploadFile(selectedFile);
      setUploadResult(uploaded);
      const cleaned = await runCleanPipeline(uploaded.filename);
      setCleanResult(cleaned);
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Error en el proceso");
    } finally {
      setUploading(false);
    }
  }

  function resetUpload() {
    setSelectedFile(null);
    setUploadResult(null);
    setCleanResult(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const divider = { borderColor: "var(--t-border-subtle)" };

  return (
    <>
      {/* Trigger button */}
      <button
        id="files-menu-trigger"
        onClick={() => { setOpen(!open); if (open) setActivePanel(null); }}
        aria-label="Menú de archivos"
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer text-sm"
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.05)",
          color: "var(--t-text-primary)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(207,7,0,0.15)";
          e.currentTarget.style.borderColor = "rgba(207,7,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="hidden sm:inline">Archivos</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setOpen(false); setActivePanel(null); }}
        />
      )}

      <div
        className={`fixed top-17 left-0 h-[calc(100vh-68px)] z-50 flex transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar nav */}
        <aside
          className="w-64 h-full flex flex-col shadow-2xl rounded-tr-2xl rounded-br-2xl overflow-hidden"
          style={{ background: "var(--t-bg-surface)", borderRight: "1px solid var(--t-border-subtle)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b" style={divider}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(207,7,0,0.15)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#cf0700" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              </div>
              <span className="font-semibold text-sm" style={{ color: "var(--t-text-primary)" }}>
                Archivos
              </span>
            </div>
            <button
              onClick={() => { setOpen(false); setActivePanel(null); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ color: "var(--t-text-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#cf0700";
                e.currentTarget.style.background = "rgba(207,7,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--t-text-muted)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-0.5">
            <MenuOption
              id="menu-upload"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              }
              label="Subir archivo"
              sublabel="XLS · XLSX · CSV"
              active={activePanel === "upload"}
              onClick={() => openPanel("upload")}
            />
            <MenuOption
              id="menu-files"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              label="Archivos cargados"
              active={activePanel === "files"}
              onClick={() => openPanel("files")}
            />
            <MenuOption
              id="menu-status"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              label="Estado de limpiezas"
              active={activePanel === "status"}
              onClick={() => openPanel("status")}
            />
          </nav>

          {/* Footer */}
          <div className="px-5 py-4 border-t" style={divider}>
            <p className="text-xs font-medium" style={{ color: "var(--t-text-muted)" }}>Promotick Data API</p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--t-text-muted)", opacity: 0.55 }}>v1.0.0</p>
          </div>
        </aside>

        {/* Panel content */}
        {activePanel && (
          <div
            className="w-105 h-full overflow-y-auto"
            style={{
              background: "var(--t-bg-card)",
              borderRight: "1px solid var(--t-border-subtle)",
              boxShadow: "var(--t-shadow-card)",
            }}
          >
            {activePanel === "upload" && (
              <div className="p-6 space-y-5">
                <PanelHeader
                  title="Subir archivo"
                  description="El archivo se sube y se ejecuta automáticamente el pipeline de limpieza."
                />

                {!uploadResult && (
                  <DropZone
                    selectedFile={selectedFile}
                    fileInputRef={fileInputRef}
                    onFileChange={(e) => { setSelectedFile(e.target.files?.[0] ?? null); setUploadError(null); }}
                  />
                )}

                {!uploadResult && (
                  <div className="flex gap-3">
                    <button
                      id="upload-submit-btn"
                      onClick={handleUpload}
                      disabled={!selectedFile || uploading}
                      className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg, #cf0700, #da1e0b)" }}
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Spinner /> {uploadResult ? "Limpiando…" : "Subiendo…"}
                        </span>
                      ) : (
                        "Subir y procesar"
                      )}
                    </button>
                    {selectedFile && !uploading && (
                      <button
                        onClick={resetUpload}
                        className="px-4 py-2.5 rounded-lg text-sm transition-all"
                        style={{
                          border: "1px solid var(--t-border-card)",
                          color: "var(--t-text-secondary)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(207,7,0,0.4)";
                          e.currentTarget.style.color = "var(--t-text-primary)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--t-border-card)";
                          e.currentTarget.style.color = "var(--t-text-secondary)";
                        }}
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                )}

                {uploadError && (
                  <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(207,7,0,0.08)", border: "1px solid rgba(207,7,0,0.25)", color: "#e73137" }}>
                    {uploadError}
                  </div>
                )}

                {uploading && (
                  <div className="space-y-3 pt-1">
                    <StepIndicator step={1} label="Subiendo archivo al servidor…" done={!!uploadResult} active={!uploadResult} />
                    <StepIndicator step={2} label="Ejecutando pipeline de limpieza…" done={!!cleanResult} active={!!uploadResult && !cleanResult} />
                  </div>
                )}

                {uploadResult && (
                  <ResultCard title="Archivo subido" color="blue">
                    <InfoRow label="Nombre" value={uploadResult.filename} />
                    <InfoRow label="Tamaño" value={`${uploadResult.size_mb} MB`} />
                    <InfoRow label="Filas detectadas" value={uploadResult.filas_detectadas.toLocaleString()} />
                    <InfoRow label="Columnas" value={uploadResult.columnas_detectadas.toString()} />
                  </ResultCard>
                )}

                {cleanResult && (
                  <ResultCard title="Limpieza completada" color="green">
                    <InfoRow label="Filas procesadas" value={cleanResult.resumen.filas.toLocaleString()} />
                    <InfoRow label="Columnas resultantes" value={cleanResult.resumen.columnas.toString()} />
                    <InfoRow label="Cumple SLA" value={cleanResult.resumen.metricas_negocio.total_cumple_sla.toLocaleString()} />
                    <InfoRow label="Incumple SLA" value={cleanResult.resumen.metricas_negocio.total_incumple_sla.toLocaleString()} />
                    <InfoRow label="Backlog crítico" value={cleanResult.resumen.metricas_negocio.total_backlog_critico.toLocaleString()} />
                    <div className="pt-2">
                      <a
                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${cleanResult.download_url}`}
                        download
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descargar CSV limpio
                      </a>
                    </div>
                  </ResultCard>
                )}

                {cleanResult && (
                  <button
                    onClick={resetUpload}
                    className="w-full py-2.5 rounded-lg text-sm transition-all"
                    style={{
                      border: "1px solid var(--t-border-card)",
                      color: "var(--t-text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(207,7,0,0.4)";
                      e.currentTarget.style.color = "var(--t-text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--t-border-card)";
                      e.currentTarget.style.color = "var(--t-text-secondary)";
                    }}
                  >
                    Subir otro archivo
                  </button>
                )}
              </div>
            )}

            {activePanel === "files" && (
              <div className="p-6 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <PanelHeader
                    title="Archivos cargados"
                    description="Archivos actualmente en memoria del servidor."
                  />
                  <button
                    id="refresh-files-btn"
                    onClick={fetchFiles}
                    disabled={filesLoading}
                    className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                    style={{
                      border: "1px solid var(--t-border-card)",
                      color: "var(--t-text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(207,7,0,0.4)";
                      e.currentTarget.style.color = "var(--t-text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--t-border-card)";
                      e.currentTarget.style.color = "var(--t-text-secondary)";
                    }}
                  >
                    {filesLoading ? <Spinner /> : (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Actualizar
                      </>
                    )}
                  </button>
                </div>

                {filesError && (
                  <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(207,7,0,0.08)", border: "1px solid rgba(207,7,0,0.25)", color: "#e73137" }}>
                    {filesError}
                  </div>
                )}

                {filesLoading && !filesData && (
                  <div className="flex items-center justify-center py-12">
                    <Spinner size="lg" />
                  </div>
                )}

                {filesData && (
                  <>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: "rgba(207,7,0,0.12)", color: "#e73137", border: "1px solid rgba(207,7,0,0.2)" }}
                      >
                        {filesData.total} {filesData.total === 1 ? "archivo" : "archivos"}
                      </span>
                    </div>
                    {filesData.total === 0 ? (
                      <EmptyState label="No hay archivos cargados" />
                    ) : (
                      <div className="space-y-3">
                        {filesData.archivos.map((f) => (
                          <div
                            key={f.filename}
                            className="rounded-xl p-4"
                            style={{ background: "var(--t-bg-subtle)", border: "1px solid var(--t-border-card)" }}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(207,7,0,0.1)" }}>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#cf0700" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <p className="text-sm font-medium truncate" style={{ color: "var(--t-text-primary)" }} title={f.filename}>
                                {f.filename}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <MetricCell label="Filas" value={f.filas.toLocaleString()} />
                              <MetricCell label="Columnas" value={f.columnas.toString()} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activePanel === "status" && (
              <div className="p-6 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <PanelHeader
                    title="Estado de limpiezas"
                    description="Archivos que ya pasaron por el pipeline y están disponibles para análisis."
                  />
                  <button
                    id="refresh-status-btn"
                    onClick={fetchStatus}
                    disabled={statusLoading}
                    className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                    style={{
                      border: "1px solid var(--t-border-card)",
                      color: "var(--t-text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(207,7,0,0.4)";
                      e.currentTarget.style.color = "var(--t-text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--t-border-card)";
                      e.currentTarget.style.color = "var(--t-text-secondary)";
                    }}
                  >
                    {statusLoading ? <Spinner /> : (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Actualizar
                      </>
                    )}
                  </button>
                </div>

                {statusError && (
                  <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(207,7,0,0.08)", border: "1px solid rgba(207,7,0,0.25)", color: "#e73137" }}>
                    {statusError}
                  </div>
                )}

                {statusLoading && !statusData && (
                  <div className="flex items-center justify-center py-12">
                    <Spinner size="lg" />
                  </div>
                )}

                {statusData && (
                  <>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
                      >
                        {statusData.total} {statusData.total === 1 ? "procesado" : "procesados"}
                      </span>
                    </div>
                    {statusData.total === 0 ? (
                      <EmptyState label="Ningún archivo ha sido procesado aún" />
                    ) : (
                      <div className="space-y-3">
                        {statusData.archivos_limpios.map((f) => (
                          <div
                            key={f.filename}
                            className="rounded-xl p-4"
                            style={{ background: "var(--t-bg-subtle)", border: "1px solid rgba(34,197,94,0.2)" }}
                          >
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(34,197,94,0.1)" }}>
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                  </svg>
                                </div>
                                <p className="text-sm font-medium truncate" style={{ color: "var(--t-text-primary)" }} title={f.filename}>
                                  {f.filename}
                                </p>
                              </div>
                              <span
                                className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium"
                                style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
                              >
                                Limpio
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <MetricCell label="Filas limpias" value={f.filas_limpias.toLocaleString()} color="green" />
                              <MetricCell label="Columnas" value={f.columnas_limpias.toString()} color="green" />
                            </div>

                            <details className="group">
                              <summary className="text-xs cursor-pointer list-none flex items-center gap-1 select-none" style={{ color: "var(--t-text-muted)" }}>
                                <span className="group-open:hidden">▶</span>
                                <span className="hidden group-open:inline">▼</span>
                                Ver columnas ({f.columnas.length})
                              </summary>
                              <div className="mt-2 flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                                {f.columnas.map((col) => (
                                  <span
                                    key={col}
                                    className="text-[11px] px-2 py-0.5 rounded font-mono"
                                    style={{
                                      background: "var(--t-bg-card)",
                                      border: "1px solid var(--t-border-card)",
                                      color: "var(--t-text-secondary)",
                                    }}
                                  >
                                    {col}
                                  </span>
                                ))}
                              </div>
                            </details>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/* ── Sub-components ── */

function MenuOption({
  id, icon, label, sublabel, active, onClick,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const highlighted = active || hovered;
  return (
    <button
      id={id}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
      style={{
        background: active ? "rgba(207,7,0,0.12)" : hovered ? "rgba(207,7,0,0.07)" : "transparent",
        border: `1px solid ${active ? "rgba(207,7,0,0.28)" : "transparent"}`,
        color: highlighted ? "var(--t-text-primary)" : "var(--t-text-secondary)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ color: active ? "#cf0700" : highlighted ? "var(--t-text-primary)" : "var(--t-text-muted)" }}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{label}</p>
        {sublabel && (
          <p className="text-[11px] truncate" style={{ color: "var(--t-text-muted)" }}>{sublabel}</p>
        )}
      </div>
    </button>
  );
}

function PanelHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="font-semibold text-base" style={{ color: "var(--t-text-primary)" }}>{title}</h2>
      <p className="text-xs mt-0.5" style={{ color: "var(--t-text-muted)" }}>{description}</p>
    </div>
  );
}

function DropZone({
  selectedFile,
  fileInputRef,
  onFileChange,
}: {
  selectedFile: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <label
      htmlFor="file-input"
      className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all"
      style={{
        borderColor: selectedFile ? "rgba(207,7,0,0.6)" : hover ? "rgba(207,7,0,0.35)" : "var(--t-border-card)",
        background: selectedFile ? "rgba(207,7,0,0.05)" : hover ? "rgba(207,7,0,0.03)" : "transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {selectedFile ? (
        <>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(207,7,0,0.12)" }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#cf0700" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "var(--t-text-primary)" }}>{selectedFile.name}</p>
            <p className="text-xs mt-1" style={{ color: "var(--t-text-muted)" }}>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--t-bg-subtle)" }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--t-text-muted)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "var(--t-text-secondary)" }}>Arrastra o selecciona un archivo</p>
            <p className="text-xs mt-1" style={{ color: "var(--t-text-muted)" }}>.xls · .xlsx · .csv — máx 50 MB</p>
          </div>
        </>
      )}
      <input
        id="file-input"
        ref={fileInputRef}
        type="file"
        accept=".xls,.xlsx,.csv"
        className="hidden"
        onChange={onFileChange}
      />
    </label>
  );
}

function ResultCard({
  title, color, children,
}: {
  title: string;
  color: "blue" | "green";
  children: React.ReactNode;
}) {
  const cfg = {
    blue:  { bg: "rgba(14,165,233,0.06)",  border: "rgba(14,165,233,0.2)",  icon: "#0ea5e9",  text: "#38bdf8" },
    green: { bg: "rgba(34,197,94,0.06)",   border: "rgba(34,197,94,0.2)",   icon: "#22c55e",  text: "#4ade80" },
  }[color];
  return (
    <div className="rounded-xl p-4 space-y-2.5" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <div className="flex items-center gap-2">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={cfg.icon} strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-sm font-semibold" style={{ color: cfg.text }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span style={{ color: "var(--t-text-muted)" }}>{label}</span>
      <span className="font-medium" style={{ color: "var(--t-text-secondary)" }}>{value}</span>
    </div>
  );
}

function MetricCell({ label, value, color }: { label: string; value: string; color?: "green" }) {
  return (
    <div
      className="rounded-lg px-3 py-2"
      style={{ background: "var(--t-bg-card)", border: "1px solid var(--t-border-subtle)" }}
    >
      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "var(--t-text-muted)" }}>{label}</p>
      <p className="text-sm font-bold tabular-nums mt-0.5" style={{ color: color === "green" ? "#22c55e" : "var(--t-text-primary)" }}>
        {value}
      </p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--t-bg-subtle)" }}>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: "var(--t-text-muted)", opacity: 0.4 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
        </svg>
      </div>
      <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>{label}</p>
    </div>
  );
}

function StepIndicator({ step, label, done, active }: { step: number; label: string; done: boolean; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{
          background: done ? "#22c55e" : active ? "#cf0700" : "var(--t-bg-subtle)",
          color: done || active ? "#ffffff" : "var(--t-text-muted)",
          border: done || active ? "none" : "1px solid var(--t-border-card)",
        }}
      >
        {done ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : step}
      </div>
      <p
        className="text-sm flex-1"
        style={{
          color: done ? "var(--t-text-muted)" : active ? "var(--t-text-primary)" : "var(--t-text-muted)",
          textDecoration: done ? "line-through" : "none",
        }}
      >
        {label}
      </p>
      {active && <Spinner />}
    </div>
  );
}

function Spinner({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <svg
      className={`animate-spin shrink-0 ${size === "lg" ? "w-6 h-6" : "w-3.5 h-3.5"}`}
      style={{ color: "#cf0700" }}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
    </svg>
  );
}
