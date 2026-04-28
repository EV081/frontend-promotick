"use client";

import { PieChart, Pie, Cell } from "recharts";

interface GaugeChartProps {
  value: number;
  titulo: string;
}

export default function GaugeChart({ value, titulo }: GaugeChartProps) {
  const data = [
    { value: value },
    { value: 100 - value },
  ];

  const getColor = (val: number) => {
    if (val >= 90) return "#22C55E";
    if (val >= 70) return "#e73137";
    return "#cf0700";
  };

  return (
    <div className="bg-white rounded-xl border border-promotick-gray-lighter p-5 shadow-sm flex flex-col items-center">
      <p className="text-sm font-medium text-promotick-gray mb-2">{titulo}</p>
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
          <Cell fill="#dfdfdf" />
        </Pie>
      </PieChart>
      <p className="text-2xl font-bold text-promotick-dark -mt-2">{value}%</p>
    </div>
  );
}
