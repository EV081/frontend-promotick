"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface BarChartHorizontalProps {
  data: { nombre: string; count: number }[];
  titulo: string;
}

export default function BarChartHorizontal({ data, titulo }: BarChartHorizontalProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-xl border border-promotick-gray-lighter p-5 shadow-sm">
      <p className="text-sm font-medium text-promotick-gray mb-3">{titulo}</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={sorted} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#dfdfdf" />
          <XAxis type="number" tick={{ fill: "#666666" }} />
          <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11, fill: "#666666" }} width={110} />
          <Tooltip />
          <Bar dataKey="count" fill="#da1e0b" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
