"use client";

interface AlertCardProps {
  titulo: string;
  valor: string | number;
  mensaje?: string;
}

export default function AlertCard({ titulo, valor, mensaje }: AlertCardProps) {
  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a0505 0%, #0f0f0f 100%)",
        border: "1px solid rgba(207,7,0,0.45)",
        boxShadow: "0 0 28px rgba(207,7,0,0.18), 0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(207,7,0,0.6), transparent)" }}
      />
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#e73137" }}>
        {titulo}
      </p>
      <p className="text-4xl font-bold tabular-nums text-white">{valor}</p>
      {mensaje && (
        <p className="text-xs mt-2" style={{ color: "rgba(231,49,55,0.75)" }}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
