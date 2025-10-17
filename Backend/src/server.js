// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initPool, execute } from "./db.js";
import ticketsRouter from "./routes/tickets.js";
import createRouter from "./routes/create.js"; 
import readRouter from "./routes/read.js"; 
import updateRouter from "./routes/update.js"; 
import deleteRouter from "./routes/delete.js"; 

import repuestosRouter from './routes/repuestos.js'; 
import periodosRouter from './routes/periodos.js'; 
import asignadosRouter from './tecnico/asignados.js'; 
import detalleTicketsRouter from './tecnico/detalletickets.js';
import reporteRepuestoRouter from './tecnico/reporterepuesto.js';


dotenv.config();

const app = express();
const ALLOW_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

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
// ⬇️ registra la ruta de create
app.use("/api/create", createRouter); 
// ⬇️ registra la ruta de read
app.use("/api/read", readRouter); 
// ⬇️ registra la ruta de update
app.use("/api/update", updateRouter); 
// ⬇️ registra la ruta de delete
app.use("/api/delete", deleteRouter); 
app.use("/api/repuestos", repuestosRouter); 
app.use("/api/periodos", periodosRouter);
app.use("/api/asignados", asignadosRouter);
app.use("/api/detalletickets", detalleTicketsRouter);
app.use("/api/reportes", reporteRepuestoRouter);


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
