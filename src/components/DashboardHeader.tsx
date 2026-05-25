"use client";

import { useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import FilesMenu from "@/components/FilesMenu";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const btnBase: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
};
const btnHoverIn = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.background = "rgba(207,7,0,0.15)";
  e.currentTarget.style.borderColor = "rgba(207,7,0,0.4)";
};
const btnHoverOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
};

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(headerRef.current, { y: -60, opacity: 0, duration: 0.6, ease: "power3.out" });
  }, { scope: headerRef });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      ref={headerRef}
      className="border-b-3 px-6 py-4 sticky top-0 z-60"
      style={{
        background: "var(--t-header-bg)",
        borderBottomColor: "var(--t-header-border)",
        
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FilesMenu />
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #cf0700 0%, #da1e0b 100%)",
              boxShadow: "0 0 14px rgba(207,7,0,0.45)",
            }}
          >
            <span className="text-white font-bold text-sm tracking-tight">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--t-text-primary)" }}>
              Promotick
            </h1>
            <p className="text-xs tracking-wide uppercase" style={{ color: "var(--t-text-muted)" }}>
              {user?.role === "gerente" ? "Dashboard Gerencial" : "Dashboard Operacional"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold" style={{ color: "var(--t-text-primary)" }}>
              {user?.nombre}
            </p>
            <p className="text-xs tracking-wide uppercase" style={{ color: "var(--t-text-muted)" }}>
              {user?.role}
            </p>
          </div>

          {/* Toggle de tema */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={isDark ? "Modo claro" : "Modo oscuro"}
            className="p-2 rounded-lg transition-all cursor-pointer"
            style={{ ...btnBase, color: "var(--t-text-primary)" }}
            onMouseEnter={btnHoverIn}
            onMouseLeave={btnHoverOut}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm rounded-lg transition-all cursor-pointer font-medium"
            style={{ ...btnBase, color: "var(--t-text-primary)" }}
            onMouseEnter={btnHoverIn}
            onMouseLeave={btnHoverOut}
          >
            Cerrar Sesion
          </button>
        </div>
      </div>
    </header>
  );
}
