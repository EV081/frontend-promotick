"use client";

interface KpiCardProps {
  titulo: string;
  valor: string | number;
  color?: "default" | "green" | "red" | "yellow" | "dark";
}

const borderClasses = {
  default: "border-promotick-gray-lighter",
  green: "border-green-500",
  red: "border-promotick-red",
  yellow: "border-yellow-500",
  dark: "border-promotick-charcoal",
};

const valueClasses = {
  default: "text-promotick-dark",
  green: "text-green-600",
  red: "text-promotick-red",
  yellow: "text-yellow-600",
  dark: "text-promotick-charcoal",
};

export default function KpiCard({ titulo, valor, color = "default" }: KpiCardProps) {
  return (
    <div className={`rounded-xl border-2 bg-white p-5 shadow-sm ${borderClasses[color]}`}>
      <p className="text-sm font-medium text-promotick-gray mb-1">{titulo}</p>
      <p className={`text-3xl font-bold ${valueClasses[color]}`}>{valor}</p>
    </div>
  );
}
