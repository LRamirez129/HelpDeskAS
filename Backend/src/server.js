// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initPool, execute } from "./db.js";
import ticketsRouter from "./routes/tickets.js";

dotenv.config();

const app = express();
const ALLOW_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: ALLOW_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/api/ping", async (req, res) => {
  try {
    await initPool();
    const r = await execute("SELECT 1 AS OK FROM dual");
    const ok = r.rows?.[0]?.OK ?? 1;
    res.json({ ok });
  } catch (err) {
    console.error("PING ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ⬇️ registra la ruta de tickets
app.use("/api/tickets", ticketsRouter);

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, async () => {
  try {
    await initPool();
    console.log(`API escuchando en http://localhost:${PORT}`);
    console.log(`CORS permitido: ${ALLOW_ORIGIN}`);
  } catch (err) {
    console.error("No se pudo inicializar el pool de Oracle:", err);
    process.exit(1);
  }
});
