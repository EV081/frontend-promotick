"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, isLoading, login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const formPanelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      formPanelRef.current,
      { x: 20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    );
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

  // ── Theme tokens ────────────────────────────────────────────────────────────
  const pageBg      = isDark ? "#0a0a0a" : "#f0f0f0";
  const leftBg      = isDark ? "#0a0a0a" : "#e8e8e8";
  const leftBorder  = isDark ? "rgba(207,7,0,0.2)" : "rgba(207,7,0,0.15)";
  const rightBg     = isDark ? "#111111" : "#ffffff";
  const textPrimary = isDark ? "#ffffff" : "#111111";
  const textSub     = isDark ? "#bababa" : "#555555";
  const textMuted   = isDark ? "#4d4d4d" : "#999999";
  const inputBg     = isDark ? "#1a1a1a" : "#f5f5f5";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
  const inputText   = isDark ? "#ffffff" : "#111111";
  const inputPlaceholder = isDark ? "#555555" : "#aaaaaa";
  const credsBg     = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const credsBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const credsLabel  = isDark ? "#bababa" : "#444444";
  const credsVal    = isDark ? "#4d4d4d" : "#888888";
  const dotColor    = isDark ? "#ffffff" : "#333333";

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(207,7,0,0.6)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(207,7,0,0.1)";
  };
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = inputBorder;
    e.currentTarget.style.boxShadow = "none";
  };

  const inputStyle = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: inputText,
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div className="min-h-screen flex" style={{ background: pageBg }}>

      {/* Panel izquierdo — branding */}
      <div
        className="hidden md:flex md:w-2/5 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: leftBg, borderRight: `1px solid ${leftBorder}` }}
      >
        {/* Textura de puntos */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            opacity: isDark ? 0.03 : 0.06,
          }}
        />
        {/* Gradiente de viñeta */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)"
              : "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.05) 100%)",
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
          <h1 className="text-4xl font-black tracking-tight mb-3" style={{ color: textPrimary }}>Promotick</h1>
          <p className="text-base leading-relaxed" style={{ color: textSub }}>
            Sistema de gestión de<br />tickets y soporte técnico
          </p>
          <div
            className="mt-10 mx-auto w-16 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #cf0700, transparent)" }}
          />
          <p className="mt-6 text-xs tracking-widest uppercase" style={{ color: textMuted }}>
            Plataforma de análisis
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div
        ref={formPanelRef}
        className="flex-1 flex items-center justify-center px-6 py-12 relative"
        style={{ background: rightBg }}
      >
        {/* Theme toggle — top-right */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
            color: isDark ? "#bababa" : "#555555",
          }}
        >
          {isDark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>

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
            <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Promotick</h1>
          </div>

          <h2 className="text-xl font-bold mb-1" style={{ color: textPrimary }}>Iniciar sesión</h2>
          <p className="text-sm mb-8" style={{ color: textSub }}>
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: textSub }}
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
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{ ...inputStyle, "::placeholder": { color: inputPlaceholder } } as React.CSSProperties}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: textSub }}
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
                className="w-full px-4 py-3 rounded-lg outline-none"
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
            style={{ background: credsBg, border: `1px solid ${credsBorder}` }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: textMuted }}>
              Credenciales de prueba
            </p>
            <div className="space-y-1 text-xs" style={{ color: credsVal }}>
              <p>
                <span className="font-medium" style={{ color: credsLabel }}>Gerente:</span>{" "}
                gerente@promotick.com / gerente123
              </p>
              <p>
                <span className="font-medium" style={{ color: credsLabel }}>Soporte:</span>{" "}
                soporte@promotick.com / soporte123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
