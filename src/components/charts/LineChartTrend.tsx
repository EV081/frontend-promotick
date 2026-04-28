"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface LineChartTrendProps {
  data: { fecha: string; tickets: number }[];
  titulo: string;
}

export default function LineChartTrend({ data, titulo }: LineChartTrendProps) {
  return (
    <div className="bg-white rounded-xl border border-promotick-gray-lighter p-5 shadow-sm">
      <p className="text-sm font-medium text-promotick-gray mb-3">{titulo}</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfdfdf" />
          <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: "#666666" }} />
          <YAxis tick={{ fill: "#666666" }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="tickets"
            stroke="#cf0700"
            strokeWidth={2}
            dot={{ r: 4, fill: "#cf0700" }}
            activeDot={{ r: 6, fill: "#da1e0b" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
