"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";

interface GroupedBarChartProps {
  data: { mes: string; actual: number; anterior: number }[];
  titulo: string;
}

export default function GroupedBarChart({ data, titulo }: GroupedBarChartProps) {
  const { isDark } = useTheme();
  const axisColor = isDark ? "#4d4d4d" : "#888888";
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const tooltipStyle = {
    background: "var(--t-tooltip-bg)",
    border: "1px solid var(--t-tooltip-border)",
    borderRadius: "8px",
    color: "var(--t-tooltip-color)",
  };

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--t-bg-card)",
        border: "1px solid var(--t-border-card)",
        boxShadow: "var(--t-shadow-card)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--t-text-muted)" }}>
        {titulo}
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis dataKey="mes" tick={{ fontSize: 12, fill: axisColor }} />
          <YAxis tick={{ fill: axisColor }} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }} />
          <Legend wrapperStyle={{ color: isDark ? "#bababa" : "#4d4d4d", fontSize: "12px" }} />
          <Bar dataKey="actual" fill="#6366f1" name="Mes Actual" radius={[4, 4, 0, 0]} />
          <Bar dataKey="anterior" fill="#64748b" name="Mes Anterior" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
