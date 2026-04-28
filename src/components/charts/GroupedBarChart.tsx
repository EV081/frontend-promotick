"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface GroupedBarChartProps {
  data: { mes: string; actual: number; anterior: number }[];
  titulo: string;
}

export default function GroupedBarChart({ data, titulo }: GroupedBarChartProps) {
  return (
    <div className="bg-white rounded-xl border border-promotick-gray-lighter p-5 shadow-sm">
      <p className="text-sm font-medium text-promotick-gray mb-3">{titulo}</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfdfdf" />
          <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#666666" }} />
          <YAxis tick={{ fill: "#666666" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="actual" fill="#cf0700" name="Mes Actual" radius={[4, 4, 0, 0]} />
          <Bar dataKey="anterior" fill="#d5d5d5" name="Mes Anterior" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
