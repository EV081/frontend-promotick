# Promotick — Frontend

Dashboard web para la gestión y visualización de tickets de soporte, construido con **Next.js 15**, **TypeScript** y **Tailwind CSS**.

---

## Requisitos previos

- Node.js 18 o superior
- [pnpm](https://pnpm.io/) instalado globalmente (`npm install -g pnpm`)
- El backend **Promotick Data API** corriendo (ver su propio README)

---

## Instalación y ejecución

**1. Instalar dependencias:**

```bash
pnpm install
```

**2. Configurar variables de entorno:**

Copia el archivo de ejemplo y ajusta la URL del backend:

```bash
cp .env.example .env
```

Edita `.env` y asegúrate de que `NEXT_PUBLIC_BACKEND_URL` apunte al backend:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

> Si el backend corre en un puerto o host diferente, actualiza este valor antes de levantar el frontend.

**3. Levantar el servidor de desarrollo:**

```bash
pnpm run dev
```

La aplicación estará disponible en:

```
http://localhost:3000
```

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | URL base del backend FastAPI | `http://localhost:8000` |

> El prefijo `NEXT_PUBLIC_` es necesario para que Next.js exponga la variable tanto en el servidor como en el navegador.

---

## Estructura del proyecto

```
src/
├── app/                  # Rutas y páginas (App Router)
│   ├── dashboard/
│   │   ├── gerencial/    # Dashboard vista gerencial
│   │   └── operacional/  # Dashboard vista operacional
│   ├── login/            # Página de autenticación
│   └── layout.tsx        # Layout raíz
├── components/
│   ├── DashboardHeader.tsx   # Header con menú de archivos
│   ├── FilesMenu.tsx         # Menú hamburguesa — gestión de archivos
│   ├── charts/               # Componentes de gráficos (Recharts)
│   └── ui/                   # Componentes UI reutilizables
├── context/
│   └── AuthContext.tsx       # Contexto de autenticación
├── interfaces/
│   └── api.ts                # Interfaces TypeScript del backend
├── services/
│   ├── config.ts             # URL base del backend
│   ├── uploadService.ts      # POST /upload/file · GET /upload/files
│   ├── cleanService.ts       # POST /clean/run · GET /clean/download · GET /clean/status
│   ├── apiService.ts         # GET / · GET /health
│   └── index.ts              # Barrel de exportaciones
├── data/                     # Datos de ejemplo para los dashboards
└── types/                    # Tipos de dominio (roles, usuarios, etc.)
```

---

## Funcionalidades principales

### Menú de Archivos (hamburguesa)

Accesible desde el header del dashboard. Contiene tres paneles:

| Panel | Descripción |
|---|---|
| **Subir archivo** | Sube un `.xls`, `.xlsx` o `.csv` y ejecuta automáticamente el pipeline de limpieza |
| **Archivos cargados** | Lista los archivos actualmente en memoria del backend |
| **Estado de limpiezas** | Muestra los archivos que ya fueron procesados con sus columnas resultantes |

### Dashboards

| Rol | Ruta | Descripción |
|---|---|---|
| `soporte` | `/dashboard/operacional` | KPIs operacionales, SLA, tickets por agente y categoría |
| `gerente` | `/dashboard/gerencial` | Tendencias, backlog crítico, comparativos y demanda por empresa |