// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initPool, execute } from "./db.js";

// ⬇️ IMPORTAR TODAS LAS RUTAS
import ticketsRouter from "./routes/tickets.js";
import repuestosRouter from './routes/repuestos.js'; 
import periodosRouter from './routes/periodos.js'; 
import departamentosRouter from './routes/departamentos.js'; // Ruta de Departamentos
import categoriasRouter from './routes/categorias.js';     // Ruta de Categorías

dotenv.config();

const app = express();
const ALLOW_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// MIDDLEWARES
app.use(cors({ origin: ALLOW_ORIGIN, credentials: true }));
app.use(express.json());

// RUTA DE PRUEBA DE CONEXIÓN A LA BASE DE DATOS
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

// ⬇️ REGISTRO DE RUTAS DE LA API
app.use("/api/tickets", ticketsRouter);
app.use("/api/repuestos", repuestosRouter); 
app.use("/api/periodos", periodosRouter);
app.use("/api/departamentos", departamentosRouter); // Registrar Departamentos
app.use("/api/categorias", categoriasRouter);     // Registrar Categorías


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
