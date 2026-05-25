"use client";

import { PieChart, Pie, Cell } from "recharts";
import { useTheme } from "@/context/ThemeContext";

interface GaugeChartProps {
  value: number;
  titulo: string;
}

export default function GaugeChart({ value, titulo }: GaugeChartProps) {
  const { isDark } = useTheme();
  const data = [{ value }, { value: 100 - value }];

  const getColor = (val: number) => {
    if (val >= 90) return "#22c55e";
    if (val >= 70) return "#e73137";
    return "#cf0700";
  };

  return (
    <div
      className="rounded-xl p-5 flex flex-col items-center"
      style={{
        background: "var(--t-bg-card)",
        border: "1px solid var(--t-border-card)",
        boxShadow: "var(--t-shadow-card)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--t-text-muted)" }}>
        {titulo}
      </p>
      <PieChart width={180} height={100}>
        <Pie
          data={data}
          cx={90}
          cy={90}
          startAngle={180}
          endAngle={0}
          innerRadius={55}
          outerRadius={80}
          dataKey="value"
          stroke="none"
        >
          <Cell fill={getColor(value)} />
          <Cell fill={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} />
        </Pie>
      </PieChart>
      <p className="text-2xl font-bold tabular-nums -mt-2" style={{ color: "var(--t-text-primary)" }}>
        {value}%
      </p>
    </div>
  );
}
