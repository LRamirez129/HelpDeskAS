// src/routes/tickets.js
import express from "express";
import { execute, oracledb } from "../db.js";

const router = express.Router();

/**
 * GET /api/tickets
 * Lista tickets con filtros opcionales:
 *   - usuarioId: ID del usuario creador (HDK_USUARIO.USR_Usuario)
 *   - email: correo del usuario creador (HDK_USUARIO.USR_Correo)
 *   - estados: lista separada por comas (ej: Abierto,En progreso,Cerrado)
 */
router.get("/", async (req, res) => {
  const { usuarioId, email, estados } = req.query;

  try {
    const binds = {};
    const where = [];

    if (usuarioId) {
      where.push("t.TIC_UsuarioCreacion = :usuarioId");
      binds.usuarioId = Number(usuarioId);
    }

    if (email) {
      where.push("LOWER(u.USR_Correo) = LOWER(:email)");
      binds.email = String(email);
    }

    if (typeof estados === "string" && estados.trim().length > 0) {
      const arr = estados.split(",").map(s => s.trim());
      where.push(`t.TIC_Estado IN (${arr.map((_, i) => `:e${i}`).join(",")})`);
      arr.forEach((v, i) => (binds[`e${i}`] = v));
    }

    const sql = `
      SELECT
        t.TIC_Ticket           AS ID,
        t.TIC_Asunto           AS ASUNTO,
        t.TIC_Descripcion      AS DESCRIPCION,
        t.TIC_Estado           AS ESTADO,
        t.TIC_Prioridad        AS PRIORIDAD,
        t.TIC_SLA              AS SLA,
        t.TIC_FechaHCreacion   AS FECHA_CREACION
      FROM HDK_TICKET t
      JOIN HDK_USUARIO u
        ON u.USR_Usuario = t.TIC_UsuarioCreacion
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY t.TIC_Ticket DESC
    `;

    const r = await execute(sql, binds);
    res.json(r.rows ?? []);
  } catch (err) {
    console.error("GET /api/tickets error:", err);
    res.status(500).json({ error: "Error obteniendo tickets" });
  }
});

/**
 * POST /api/tickets
 * Crea un nuevo ticket.
 * Body esperado (JSON):
 *   { usuarioId, asunto, descripcion?, prioridad, estado? }
 * Notas:
 *   - TIC_Ticket se genera con la secuencia HDK_TICKET_SEQ (ya creada).
 *   - Estado por defecto: 'Abierto'
 */
router.post("/", async (req, res) => {
  const {
    usuarioId,
    asunto,
    descripcion = null,
    prioridad,
    estado = "Abierto",
    sla = null
  } = req.body || {};

  if (!usuarioId || !asunto || !prioridad) {
    return res.status(400).json({
      error: "usuarioId, asunto y prioridad son requeridos"
    });
  }

  try {
    const sql = `
      INSERT INTO HDK_TICKET
        (TIC_Ticket, TIC_Asunto, TIC_Descripcion, TIC_Estado, TIC_Prioridad, TIC_SLA, TIC_UsuarioCreacion, TIC_FechaHCreacion)
      VALUES
        (HDK_TICKET_SEQ.NEXTVAL, :asunto, :descripcion, :estado, :prioridad, :sla, :usuarioId, SYSTIMESTAMP)
      RETURNING TIC_Ticket INTO :id
    `;

    const binds = {
      asunto,
      descripcion,
      estado,
      prioridad,
      sla,
      usuarioId: Number(usuarioId),
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const r = await execute(sql, binds, { autoCommit: true });
    const newId = r?.outBinds?.id?.[0];

    res.status(201).json({ id: newId, message: "Ticket creado" });
  } catch (err) {
    console.error("POST /api/tickets error:", err);
    res.status(500).json({ error: "Error creando ticket" });
  }
});

export default router;
