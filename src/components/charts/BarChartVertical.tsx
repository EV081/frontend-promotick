"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface BarChartVerticalProps {
  data: { categoria: string; count: number }[];
  titulo: string;
}

export default function BarChartVertical({ data, titulo }: BarChartVerticalProps) {
  return (
    <div className="bg-white rounded-xl border border-promotick-gray-lighter p-5 shadow-sm">
      <p className="text-sm font-medium text-promotick-gray mb-3">{titulo}</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfdfdf" />
          <XAxis dataKey="categoria" tick={{ fontSize: 11, fill: "#666666" }} />
          <YAxis tick={{ fill: "#666666" }} />
          <Tooltip />
          <Bar dataKey="count" fill="#cf0700" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
