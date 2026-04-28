"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  titulo: string;
}

export default function DonutChart({ data, titulo }: DonutChartProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500 mb-3">{titulo}</p>
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
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
