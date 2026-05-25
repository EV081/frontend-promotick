"use client";

interface KpiCardProps {
  titulo: string;
  valor: string | number;
  color?: "default" | "green" | "red" | "yellow" | "dark";
  className?: string;
}

const colorConfig = {
  default: { border: "var(--t-border-card)",  value: "var(--t-text-primary)", glow: "rgba(0,0,0,0)",        leftStripe: "#4d4d4d" },
  green:   { border: "rgba(34,197,94,0.25)",  value: "#22c55e",               glow: "rgba(34,197,94,0.10)",  leftStripe: "#22c55e" },
  red:     { border: "rgba(207,7,0,0.35)",    value: "#e73137",               glow: "rgba(207,7,0,0.12)",    leftStripe: "#cf0700" },
  yellow:  { border: "rgba(245,158,11,0.30)", value: "#f59e0b",               glow: "rgba(245,158,11,0.10)", leftStripe: "#f59e0b" },
  dark:    { border: "var(--t-border-card)",  value: "var(--t-text-primary)", glow: "rgba(0,0,0,0)",         leftStripe: "#cf0700" },
};

export default function KpiCard({ titulo, valor, color = "default", className }: KpiCardProps) {
  const cfg = colorConfig[color];
  return (
    <div
      className={`rounded-xl p-5 relative overflow-hidden ${className ?? ""}`}
      style={{
        background: "var(--t-bg-card)",
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 0 20px ${cfg.glow}, var(--t-shadow-card)`,
        borderLeft: `3px solid ${cfg.leftStripe}`,
      }}
    >
      <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--t-text-secondary)" }}>
        {titulo}
      </p>
      <p className="text-3xl font-bold tabular-nums" style={{ color: cfg.value }}>
        {valor}
      </p>
    </div>
  );
}
