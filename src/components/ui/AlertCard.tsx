"use client";

import { useTheme } from "@/context/ThemeContext";

interface AlertCardProps {
  titulo: string;
  valor: string | number;
  mensaje?: string;
}

export default function AlertCard({ titulo, valor, mensaje }: AlertCardProps) {
  const { isDark } = useTheme();

  const bg = isDark
    ? "linear-gradient(135deg, #1a0505 0%, #0f0f0f 100%)"
    : "linear-gradient(135deg, #fff0f0 0%, #ffe4e4 100%)";

  const border = isDark
    ? "1px solid rgba(207,7,0,0.45)"
    : "1px solid rgba(207,7,0,0.30)";

  const shadow = isDark
    ? "0 0 28px rgba(207,7,0,0.18), 0 4px 24px rgba(0,0,0,0.5)"
    : "0 0 20px rgba(207,7,0,0.10), 0 4px 16px rgba(0,0,0,0.06)";

  const valorColor = isDark ? "#ffffff" : "#8b0000";
  const mensajeColor = isDark ? "rgba(231,49,55,0.75)" : "rgba(180,0,0,0.65)";

  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden"
      style={{ background: bg, border, boxShadow: shadow }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(207,7,0,0.6), transparent)" }}
      />
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#e73137" }}>
        {titulo}
      </p>
      <p className="text-4xl font-bold tabular-nums" style={{ color: valorColor }}>
        {valor}
      </p>
      {mensaje && (
        <p className="text-xs mt-2" style={{ color: mensajeColor }}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
