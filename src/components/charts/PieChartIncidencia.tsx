"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@/context/ThemeContext";

const COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#f43f5e", "#8b5cf6"];

interface PieChartIncidenciaProps {
  data: { cat: string; value: number }[];
  titulo: string;
}

export default function PieChartIncidencia({ data, titulo }: PieChartIncidenciaProps) {
  const { isDark } = useTheme();
  const tooltipStyle = {
    background: isDark ? "#1a1a1a" : "#ffffff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}`,
    borderRadius: "8px",
  };
  const itemStyle = { color: isDark ? "#bababa" : "#4d4d4d" };
  const labelStyle = { color: isDark ? "#ffffff" : "#111111" };

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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            nameKey="cat"
            label={({ cat, value }) => `${cat}: ${value}`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={labelStyle} />
          <Legend wrapperStyle={{ color: isDark ? "#bababa" : "#4d4d4d", fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
