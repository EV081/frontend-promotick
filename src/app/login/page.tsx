"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const formPanelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(formPanelRef.current, { x: 20, opacity: 0, duration: 0.7, ease: "power3.out" });
  }, { scope: formPanelRef });

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
        const parsed = JSON.parse(stored);
        if (parsed.role === "gerente") {
          router.push("/dashboard/gerencial");
        } else {
          router.push("/dashboard/operacional");
        }
      }
    } else {
      setError(result.error || "Error al iniciar sesion");
    }
  };

  const inputStyle = {
    background: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(207,7,0,0.6)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(207,7,0,0.1)";
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a0a" }}>
      {/* Panel izquierdo — branding */}
      <div
        className="hidden md:flex md:w-2/5 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "#0a0a0a", borderRight: "1px solid rgba(207,7,0,0.2)" }}
      >
        {/* Textura de puntos */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Gradiente de viñeta */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        <div className="relative z-10 text-center px-12">
          <div
            className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #cf0700 0%, #da1e0b 100%)",
              boxShadow: "0 0 60px rgba(207,7,0,0.35), 0 0 120px rgba(207,7,0,0.15)",
            }}
          >
            <span className="text-white font-black" style={{ fontSize: "3rem" }}>P</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">Promotick</h1>
          <p className="text-base leading-relaxed" style={{ color: "#bababa" }}>
            Sistema de gestión de<br />tickets y soporte técnico
          </p>
          <div
            className="mt-10 mx-auto w-16 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #cf0700, transparent)" }}
          />
          <p className="mt-6 text-xs tracking-widest uppercase" style={{ color: "#4d4d4d" }}>
            Plataforma de análisis
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div
        ref={formPanelRef}
        className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ background: "#111111" }}
      >
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="md:hidden text-center mb-8">
            <div
              className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #cf0700 0%, #da1e0b 100%)",
                boxShadow: "0 0 20px rgba(207,7,0,0.35)",
              }}
            >
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Promotick</h1>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">Iniciar sesión</h2>
          <p className="text-sm mb-8" style={{ color: "#bababa" }}>
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "#bababa" }}
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@promotick.com"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-promotick-gray outline-none"
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "#bababa" }}
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-promotick-gray outline-none"
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{
                  background: "rgba(207,7,0,0.12)",
                  border: "1px solid rgba(207,7,0,0.3)",
                  color: "#e73137",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #cf0700 0%, #da1e0b 100%)",
                boxShadow: "0 0 20px rgba(207,7,0,0.3)",
              }}
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Credenciales demo */}
          <div
            className="mt-6 rounded-lg p-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#666666" }}
            >
              Credenciales de prueba
            </p>
            <div className="space-y-1 text-xs" style={{ color: "#4d4d4d" }}>
              <p>
                <span className="font-medium" style={{ color: "#bababa" }}>Gerente:</span>{" "}
                gerente@promotick.com / gerente123
              </p>
              <p>
                <span className="font-medium" style={{ color: "#bababa" }}>Soporte:</span>{" "}
                soporte@promotick.com / soporte123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
