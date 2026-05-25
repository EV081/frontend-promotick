"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";

interface LineChartTrendProps {
  data: { fecha: string; tickets: number }[];
  titulo: string;
}

export default function LineChartTrend({ data, titulo }: LineChartTrendProps) {
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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: axisColor }} />
          <YAxis tick={{ fill: axisColor }} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: gridStroke }} />
          <Line
            type="monotone"
            dataKey="tickets"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4, fill: "#6366f1" }}
            activeDot={{ r: 6, fill: "#8b5cf6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
