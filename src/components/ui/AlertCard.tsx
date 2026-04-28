"use client";

interface AlertCardProps {
  titulo: string;
  valor: string | number;
  mensaje?: string;
}

export default function AlertCard({ titulo, valor, mensaje }: AlertCardProps) {
  return (
    <div className="rounded-xl border-2 border-promotick-red bg-red-50 p-5 shadow-sm">
      <p className="text-sm font-semibold text-promotick-red-dark mb-1">{titulo}</p>
      <p className="text-4xl font-bold text-promotick-red">{valor}</p>
      {mensaje && <p className="text-xs text-promotick-red-accent mt-2">{mensaje}</p>}
    </div>
  );
}
