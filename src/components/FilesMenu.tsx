"use client";

import { useState, useRef } from "react";
import { uploadFile } from "@/services/uploadService";
import { runCleanPipeline } from "@/services/cleanService";
import { listUploadedFiles } from "@/services/uploadService";
import { getCleanStatus } from "@/services/cleanService";
import type {
  UploadFileResponse,
  ListFilesResponse,
  CleanRunResponse,
  CleanStatusResponse,
} from "@/interfaces/api";

type Panel = "upload" | "files" | "status" | null;

export default function FilesMenu() {
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

  return (
    <>
      <button
        id="files-menu-trigger"
        onClick={() => { setOpen(!open); if (open) setActivePanel(null); }}
        aria-label="Menú de archivos"
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-promotick-gray-dark hover:bg-promotick-gray-dark transition-colors cursor-pointer text-white text-sm"
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
        className={`fixed top-0 left-0 h-full z-50 flex transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <aside className="w-64 h-full bg-promotick-charcoal border-r border-promotick-gray-dark flex flex-col shadow-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-promotick-gray-dark">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-promotick-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
              <span className="text-white font-semibold text-sm">Archivos</span>
            </div>
            <button
              onClick={() => { setOpen(false); setActivePanel(null); }}
              className="text-promotick-gray-light hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 p-3 space-y-1">
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
              sublabel=""
              active={activePanel === "status"}
              onClick={() => openPanel("status")}
            />
          </nav>

          <div className="px-5 py-4 border-t border-promotick-gray-dark">
            <p className="text-xs text-promotick-gray-light">Promotick Data API</p>
            <p className="text-xs text-promotick-gray">v1.0.0</p>
          </div>
        </aside>

        {activePanel && (
          <div className="w-[420px] h-full bg-[#1a1a1a] border-r border-promotick-gray-dark overflow-y-auto shadow-2xl">
            {activePanel === "upload" && (
              <div className="p-6 space-y-5">
                <PanelHeader
                  title="Subir archivo"
                  description="El archivo se sube y se ejecuta automáticamente el pipeline de limpieza."
                />

                {!uploadResult && (
                  <div>
                    <label
                      htmlFor="file-input"
                      className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
                        selectedFile
                          ? "border-promotick-red bg-promotick-red/5"
                          : "border-promotick-gray-dark hover:border-promotick-gray text-promotick-gray-light"
                      }`}
                    >
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {selectedFile ? (
                        <div className="text-center">
                          <p className="text-white text-sm font-medium">{selectedFile.name}</p>
                          <p className="text-promotick-gray text-xs mt-1">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm font-medium">Arrastra o selecciona un archivo</p>
                          <p className="text-xs mt-1 text-promotick-gray">.xls · .xlsx · .csv — máx 50 MB</p>
                        </div>
                      )}
                      <input
                        id="file-input"
                        ref={fileInputRef}
                        type="file"
                        accept=".xls,.xlsx,.csv"
                        className="hidden"
                        onChange={(e) => {
                          setSelectedFile(e.target.files?.[0] ?? null);
                          setUploadError(null);
                        }}
                      />
                    </label>
                  </div>
                )}

                {!uploadResult && (
                  <div className="flex gap-3">
                    <button
                      id="upload-submit-btn"
                      onClick={handleUpload}
                      disabled={!selectedFile || uploading}
                      className="flex-1 py-2.5 rounded-lg bg-promotick-red hover:bg-promotick-red-bright disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Spinner /> {uploadResult ? "Limpiando…" : "Subiendo…"}
                        </span>
                      ) : (
                        "Subir y procesar"
                      )}
                    </button>
                    {selectedFile && (
                      <button
                        onClick={resetUpload}
                        className="px-4 py-2.5 rounded-lg border border-promotick-gray-dark text-promotick-gray-light hover:text-white hover:border-promotick-gray transition-colors text-sm"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                )}

                {uploadError && (
                  <div className="rounded-lg bg-red-900/30 border border-promotick-red/40 px-4 py-3 text-sm text-red-300">
                    {uploadError}
                  </div>
                )}

                {uploading && (
                  <div className="space-y-3">
                    <StepIndicator step={1} label="Subiendo archivo al servidor…" done={!!uploadResult} active={!uploadResult} />
                    <StepIndicator step={2} label="Ejecutando pipeline de limpieza…" done={!!cleanResult} active={!!uploadResult && !cleanResult} />
                  </div>
                )}
                {uploadResult && (
                  <ResultCard title="✓ Archivo subido" color="blue">
                    <InfoRow label="Nombre" value={uploadResult.filename} />
                    <InfoRow label="Tamaño" value={`${uploadResult.size_mb} MB`} />
                    <InfoRow label="Filas detectadas" value={uploadResult.filas_detectadas.toLocaleString()} />
                    <InfoRow label="Columnas" value={uploadResult.columnas_detectadas.toString()} />
                  </ResultCard>
                )}

                {cleanResult && (
                  <ResultCard title="✓ Limpieza completada" color="green">
                    <InfoRow label="Filas procesadas" value={cleanResult.resumen.filas.toLocaleString()} />
                    <InfoRow label="Columnas resultantes" value={cleanResult.resumen.columnas.toString()} />
                    <InfoRow label="Cumple SLA" value={cleanResult.resumen.metricas_negocio.total_cumple_sla.toLocaleString()} />
                    <InfoRow label="Incumple SLA" value={cleanResult.resumen.metricas_negocio.total_incumple_sla.toLocaleString()} />
                    <InfoRow label="Backlog crítico" value={cleanResult.resumen.metricas_negocio.total_backlog_critico.toLocaleString()} />
                    <div className="pt-2">
                      <a
                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${cleanResult.download_url}`}
                        download
                        className="inline-block text-xs px-3 py-1.5 rounded-lg bg-emerald-700/40 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/60 transition-colors"
                      >
                        ↓ Descargar CSV limpio
                      </a>
                    </div>
                  </ResultCard>
                )}

                {cleanResult && (
                  <button
                    onClick={resetUpload}
                    className="w-full py-2.5 rounded-lg border border-promotick-gray-dark text-promotick-gray-light hover:text-white hover:border-promotick-gray transition-colors text-sm"
                  >
                    Subir otro archivo
                  </button>
                )}
              </div>
            )}

            {activePanel === "files" && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <PanelHeader
                    title="Archivos cargados"
                    description="Archivos actualmente en memoria del servidor."
                  />
                  <button
                    id="refresh-files-btn"
                    onClick={fetchFiles}
                    disabled={filesLoading}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-promotick-gray-dark text-promotick-gray-light hover:text-white transition-colors disabled:opacity-40"
                  >
                    {filesLoading ? <Spinner /> : "↺ Actualizar"}
                  </button>
                </div>

                {filesError && (
                  <div className="rounded-lg bg-red-900/30 border border-promotick-red/40 px-4 py-3 text-sm text-red-300">
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
                      <span className="text-xs px-2 py-0.5 rounded-full bg-promotick-red/20 text-promotick-red font-medium">
                        {filesData.total} {filesData.total === 1 ? "archivo" : "archivos"}
                      </span>
                    </div>
                    {filesData.total === 0 ? (
                      <EmptyState label="No hay archivos cargados" />
                    ) : (
                      <div className="space-y-3">
                        {filesData.archivos.map((f) => (
                          <div key={f.filename} className="rounded-xl border border-promotick-gray-dark bg-[#242424] p-4 space-y-2">
                            <p className="text-white text-sm font-medium truncate" title={f.filename}>
                              {f.filename}
                            </p>
                            <div className="flex gap-4">
                              <Chip label={`${f.filas.toLocaleString()} filas`} />
                              <Chip label={`${f.columnas} columnas`} />
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
                <div className="flex items-center justify-between">
                  <PanelHeader
                    title="Estado de limpiezas"
                    description="Archivos que ya pasaron por el pipeline y están disponibles para análisis."
                  />
                  <button
                    id="refresh-status-btn"
                    onClick={fetchStatus}
                    disabled={statusLoading}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-promotick-gray-dark text-promotick-gray-light hover:text-white transition-colors disabled:opacity-40"
                  >
                    {statusLoading ? <Spinner /> : "↺ Actualizar"}
                  </button>
                </div>

                {statusError && (
                  <div className="rounded-lg bg-red-900/30 border border-promotick-red/40 px-4 py-3 text-sm text-red-300">
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
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 font-medium border border-emerald-700/40">
                        {statusData.total} {statusData.total === 1 ? "procesado" : "procesados"}
                      </span>
                    </div>
                    {statusData.total === 0 ? (
                      <EmptyState label="Ningún archivo ha sido procesado aún" />
                    ) : (
                      <div className="space-y-3">
                        {statusData.archivos_limpios.map((f) => (
                          <div key={f.filename} className="rounded-xl border border-emerald-700/30 bg-emerald-900/10 p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-white text-sm font-medium truncate" title={f.filename}>
                                {f.filename}
                              </p>
                              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-emerald-700/40 text-emerald-300 border border-emerald-600/30">
                                Limpio
                              </span>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                              <Chip label={`${f.filas_limpias.toLocaleString()} filas`} color="green" />
                              <Chip label={`${f.columnas_limpias} columnas`} color="green" />
                            </div>
                            {/* Columnas colapsables */}
                            <details className="group">
                              <summary className="text-xs text-promotick-gray cursor-pointer hover:text-promotick-gray-light list-none flex items-center gap-1">
                                <span className="group-open:hidden">▶</span>
                                <span className="hidden group-open:inline">▼</span>
                                Ver columnas ({f.columnas.length})
                              </summary>
                              <div className="mt-2 flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                                {f.columnas.map((col) => (
                                  <span key={col} className="text-[11px] px-2 py-0.5 rounded bg-[#1a1a1a] border border-promotick-gray-dark text-promotick-gray-light font-mono">
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
  return (
    <button
      id={id}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
        active
          ? "bg-promotick-red/20 text-white border border-promotick-red/30"
          : "text-promotick-gray-light hover:bg-promotick-gray-dark hover:text-white border border-transparent"
      }`}
    >
      <span className={active ? "text-promotick-red" : ""}>{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{label}</p>
        {sublabel && <p className="text-[11px] text-promotick-gray truncate">{sublabel}</p>}
      </div>
    </button>
  );
}

function PanelHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-white font-semibold text-base">{title}</h2>
      <p className="text-promotick-gray text-xs mt-0.5">{description}</p>
    </div>
  );
}

function ResultCard({
  title, color, children,
}: {
  title: string;
  color: "blue" | "green";
  children: React.ReactNode;
}) {
  const styles = {
    blue: "border-sky-700/40 bg-sky-900/10",
    green: "border-emerald-700/40 bg-emerald-900/10",
  };
  const titleColors = { blue: "text-sky-300", green: "text-emerald-300" };
  return (
    <div className={`rounded-xl border p-4 space-y-2 ${styles[color]}`}>
      <p className={`text-sm font-semibold ${titleColors[color]}`}>{title}</p>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-promotick-gray">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function Chip({ label, color = "default" }: { label: string; color?: "default" | "green" }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border ${
        color === "green"
          ? "bg-emerald-900/30 border-emerald-700/40 text-emerald-400"
          : "bg-promotick-gray-dark/50 border-promotick-gray-dark text-promotick-gray-light"
      }`}
    >
      {label}
    </span>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-promotick-gray">
      <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
      <p className="text-sm">{label}</p>
    </div>
  );
}

function StepIndicator({ step, label, done, active }: { step: number; label: string; done: boolean; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          done
            ? "bg-emerald-600 text-white"
            : active
            ? "bg-promotick-red text-white"
            : "bg-promotick-gray-dark text-promotick-gray"
        }`}
      >
        {done ? "✓" : step}
      </div>
      <p className={`text-sm ${done ? "text-promotick-gray line-through" : active ? "text-white" : "text-promotick-gray"}`}>
        {label}
      </p>
      {active && <Spinner />}
    </div>
  );
}

function Spinner({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <svg
      className={`animate-spin ${size === "lg" ? "w-6 h-6" : "w-3.5 h-3.5"} text-promotick-red shrink-0`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
    </svg>
  );
}
