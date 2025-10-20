import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth";
import ticketsRouter from "./routes/tickets"; // 👈 import de la ruta
import { initPool, pingDB, closePool } from "./config/db";

import statsRoutes from "./routes/stats";

const PORT = Number(process.env.PORT ?? 4000);
const ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const app = express();

// middlewares base
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use("/stats", statsRoutes);

// health básico
app.get("/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV ?? "development", time: new Date().toISOString() });
});

// health de DB (opcional)
app.get("/health/db", async (req, res) => {
  try {
    await initPool();
    const ok = await pingDB();
    res.json({ ok: true, db: ok });
  } catch (e: any) {
    (req as any).log?.error?.({ err: e }, "DB health error");
    res.status(500).json({ ok: false, error: e?.message ?? "DB error" });
  }
});

// rutas
app.use("/auth", authRouter);
//app.use("/tickets", ticketsRouter); // 👈 monta /tickets

// 404
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

// error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(typeof err?.status === "number" ? err.status : 500).json({ error: err?.message ?? "Internal Server Error" });
});

// start + cierre ordenado
const server = app.listen(PORT, () => console.log(`[READY] http://localhost:${PORT}`));
server.on("error", (err: any) => console.error("[FATAL] listen error:", err?.code || err?.message || err));

process.on("SIGINT", async () => { await closePool().catch(() => {}); server.close(() => process.exit(0)); });
process.on("SIGTERM", async () => { await closePool().catch(() => {}); server.close(() => process.exit(0)); });
