"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface StackedBarChartProps {
  data: { empresa: string; alta: number; media: number; baja: number }[];
  titulo: string;
}

export default function StackedBarChart({ data, titulo }: StackedBarChartProps) {
  return (
    <div className="bg-white rounded-xl border border-promotick-gray-lighter p-5 shadow-sm">
      <p className="text-sm font-medium text-promotick-gray mb-3">{titulo}</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfdfdf" />
          <XAxis dataKey="empresa" tick={{ fontSize: 11, fill: "#666666" }} />
          <YAxis tick={{ fill: "#666666" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="alta" stackId="a" fill="#cf0700" name="Alta" />
          <Bar dataKey="media" stackId="a" fill="#e73137" name="Media" />
          <Bar dataKey="baja" stackId="a" fill="#bababa" name="Baja" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
