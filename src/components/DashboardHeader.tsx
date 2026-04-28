"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-promotick-charcoal border-b border-promotick-gray-dark px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-promotick-red rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Promotick</h1>
            <p className="text-xs text-promotick-gray-light">
              {user?.role === "gerente" ? "Dashboard Gerencial" : "Dashboard Operacional"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.nombre}</p>
            <p className="text-xs text-promotick-gray-light capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm border border-promotick-gray-dark rounded-lg hover:bg-promotick-gray-dark transition cursor-pointer text-white"
          >
            Cerrar Sesion
          </button>
        </div>
      </div>
    </header>
  );
}
