import { GerencialData } from "@/types";

export const gerencialData: GerencialData = {
  tendencia: [
    { fecha: "01-Ene", tickets: 45 },
    { fecha: "08-Ene", tickets: 52 },
    { fecha: "15-Ene", tickets: 38 },
    { fecha: "22-Ene", tickets: 65 },
    { fecha: "29-Ene", tickets: 48 },
    { fecha: "05-Feb", tickets: 55 },
    { fecha: "12-Feb", tickets: 42 },
  ],
  backlogCritico: 5,
  recurrentes: [
    { problema: "Enviar pedido no procesado", count: 50 },
    { problema: "Anular transaccion Benefit", count: 32 },
    { problema: "Canje en ClubOlimpo", count: 28 },
    { problema: "Copia en correos", count: 22 },
    { problema: "Curso Online", count: 18 },
  ],
  incidencia: [
    { cat: "Solicitud Operativa", value: 300 },
    { cat: "Consulta", value: 180 },
    { cat: "Incidente", value: 250 },
    { cat: "Requerimiento", value: 120 },
    { cat: "Cambio", value: 90 },
  ],
  saturacion: 85,
  demandaEmpresa: [
    { empresa: "Promotick Peru", alta: 30, media: 50, baja: 40 },
    { empresa: "Promotick Ecuador", alta: 15, media: 35, baja: 25 },
    { empresa: "Promotick Colombia", alta: 20, media: 40, baja: 30 },
  ],
  comparativo: [
    { mes: "Ene", actual: 400, anterior: 380 },
    { mes: "Feb", actual: 450, anterior: 420 },
    { mes: "Mar", actual: 380, anterior: 410 },
    { mes: "Abr", actual: 420, anterior: 390 },
  ],
  mejoraContinua: [
    "Tasa de resolucion en primer contacto (FCR): 75%",
    "Tickets escalados: 10%",
    "Satisfaccion del usuario (CSAT): 4.2/5",
    "Tasa de reapertura: 2.3%",
    "Tiempo promedio de cierre reducido en 15% vs mes anterior",
  ],
};
