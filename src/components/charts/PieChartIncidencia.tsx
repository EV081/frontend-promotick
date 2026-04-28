"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#cf0700", "#da1e0b", "#e73137", "#af272f", "#ec2527"];

interface PieChartIncidenciaProps {
  data: { cat: string; value: number }[];
  titulo: string;
}

export default function PieChartIncidencia({ data, titulo }: PieChartIncidenciaProps) {
  return (
    <div className="bg-white rounded-xl border border-promotick-gray-lighter p-5 shadow-sm">
      <p className="text-sm font-medium text-promotick-gray mb-3">{titulo}</p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            nameKey="cat"
            label={({ cat, value }) => `${cat}: ${value}`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
