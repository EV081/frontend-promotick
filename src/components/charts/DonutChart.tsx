"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@/context/ThemeContext";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  titulo: string;
}

export default function DonutChart({ data, titulo }: DonutChartProps) {
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
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={labelStyle} />
          <Legend wrapperStyle={{ color: isDark ? "#bababa" : "#4d4d4d", fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
