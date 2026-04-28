"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, isLoading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      if (user.role === "gerente") {
        router.replace("/dashboard/gerencial");
      } else {
        router.replace("/dashboard/operacional");
      }
    }
  }, [user, isLoading, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const result = login(email, password);
    if (result.success) {
      const stored = localStorage.getItem("promotick_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user.role === "gerente") {
          router.push("/dashboard/gerencial");
        } else {
          router.push("/dashboard/operacional");
        }
      }
    } else {
      setError(result.error || "Error al iniciar sesion");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-promotick-black">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-promotick-red rounded-xl mb-4">
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <h1 className="text-2xl font-bold text-promotick-charcoal">Promotick</h1>
            <p className="text-promotick-gray mt-1">Dashboard de Tickets</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-promotick-dark mb-1">
                Correo electronico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@promotick.com"
                className="w-full px-4 py-3 border border-promotick-gray-lighter rounded-lg focus:ring-2 focus:ring-promotick-red focus:border-promotick-red outline-none transition text-promotick-dark"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-promotick-dark mb-1">
                Contrasena
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="w-full px-4 py-3 border border-promotick-gray-lighter rounded-lg focus:ring-2 focus:ring-promotick-red focus:border-promotick-red outline-none transition text-promotick-dark"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-promotick-red-accent text-promotick-red-dark px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-promotick-red text-white py-3 rounded-lg font-semibold hover:bg-promotick-red-bright transition cursor-pointer"
            >
              Iniciar Sesion
            </button>
          </form>

          {/* Credenciales demo */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-promotick-gray-lightest">
            <p className="text-xs font-semibold text-promotick-gray mb-2">Credenciales de prueba:</p>
            <div className="space-y-1 text-xs text-promotick-gray-dark">
              <p><span className="font-medium">Gerente:</span> gerente@promotick.com / gerente123</p>
              <p><span className="font-medium">Soporte:</span> soporte@promotick.com / soporte123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
