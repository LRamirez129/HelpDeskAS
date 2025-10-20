import express from "express";
import { execute, oracledb } from "../db.js";

const router = express.Router();

// ------------------------------------------
// R: READ - Obtener todos los tickets (con filtros)
// ------------------------------------------
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
        t.TIC_Ticket              AS ID,
        t.TIC_Asunto              AS ASUNTO,
        t.TIC_Descripcion         AS DESCRIPCION,
        t.TIC_Estado              AS ESTADO,
        t.TIC_Prioridad           AS PRIORIDAD,
        t.TIC_SLA                 AS SLA,
        t.TIC_FechaHCreacion      AS FECHA_CREACION
      FROM HDK_TICKET t
      JOIN HDK_USUARIO u
        ON u.USR_Usuario = t.TIC_UsuarioCreacion
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY t.TIC_Ticket DESC
    `;

    const r = await execute(sql, binds);
    res.json(r.rows ?? []);
  } catch (err) {
    console.error("GET /api/tickets error:", err.message, err.stack);
    res.status(500).json({ error: "Error obteniendo tickets" });
  }
});

// ------------------------------------------
// R: READ - Obtener un ticket por ID
// ------------------------------------------
router.get("/:id", async (req, res) => {
  const ticketId = req.params.id;

  try {
    const sql = `
      SELECT
        t.TIC_Ticket              AS ID,
        t.TIC_Asunto              AS ASUNTO,
        t.TIC_Descripcion         AS DESCRIPCION,
        t.TIC_Estado              AS ESTADO,
        t.TIC_Prioridad           AS PRIORIDAD,
        t.TIC_SLA                 AS SLA,
        t.TIC_FechaHCreacion      AS FECHA_CREACION
      FROM HDK_TICKET t
      WHERE t.TIC_Ticket = :ticketId
    `;
    const binds = { ticketId: Number(ticketId) };

    const r = await execute(sql, binds);

    if (r.rows.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(r.rows[0]);
  } catch (err) {
    console.error(`GET /api/tickets/${ticketId} error:`, err.message, err.stack);
    res.status(500).json({ error: "Error obteniendo ticket" });
  }
});

// ------------------------------------------
// C: CREATE - Crear un nuevo ticket
// ------------------------------------------
router.post("/", async (req, res) => {
  const {
    usuarioId,
    asunto,
    descripcion,
    prioridad,
    estado = "Abierto",
    sla
  } = req.body || {};

  // Validar campos obligatorios
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

    // Convertimos undefined a null explícitamente
    const binds = {
      asunto,
      descripcion: descripcion ?? null,
      estado,
      prioridad,
      sla: sla ?? null,
      usuarioId: Number(usuarioId),
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    console.log("INSERT binds:", binds);

    const r = await execute(sql, binds, { autoCommit: true });

    console.log("INSERT result:", r);

    const newId = r?.outBinds?.id?.[0];

    res.status(201).json({ id: newId, message: "Ticket creado" });
  } catch (err) {
    console.error("POST /api/tickets error:", err.message, err.stack);
    res.status(500).json({ error: "Error creando ticket" });
  }
});

// ------------------------------------------
// U: UPDATE - Actualizar un ticket
// ------------------------------------------
router.put("/:id", async (req, res) => {
  const ticketId = req.params.id;
  const { asunto, descripcion, prioridad, estado, sla } = req.body || {};

  if (!asunto && !descripcion && !prioridad && !estado && !sla) {
    return res.status(400).json({
      error: "Se requiere al menos un campo (asunto, descripcion, prioridad, estado o sla) para actualizar"
    });
  }

  try {
    const sets = [];
    const binds = { ticketId: Number(ticketId) };

    if (asunto) {
      sets.push("TIC_Asunto = :asunto");
      binds.asunto = asunto;
    }
    if (descripcion !== undefined) {
      sets.push("TIC_Descripcion = :descripcion");
      binds.descripcion = descripcion ?? null;
    }
    if (prioridad) {
      sets.push("TIC_Prioridad = :prioridad");
      binds.prioridad = prioridad;
    }
    if (estado) {
      sets.push("TIC_Estado = :estado");
      binds.estado = estado;
    }
    if (sla !== undefined) {
      sets.push("TIC_SLA = :sla");
      binds.sla = sla ?? null;
    }

    const sql = `
      UPDATE HDK_TICKET
      SET ${sets.join(", ")}
      WHERE TIC_Ticket = :ticketId
    `;

    const r = await execute(sql, binds, { autoCommit: true });

    if (r.rowsAffected === 0) {
      return res.status(404).json({ error: "Ticket no encontrado para actualizar" });
    }

    res.json({ message: "Ticket actualizado exitosamente" });
  } catch (err) {
    console.error(`PUT /api/tickets/${ticketId} error:`, err.message, err.stack);
    res.status(500).json({ error: "Error actualizando ticket" });
  }
});

// ------------------------------------------
// D: DELETE - Eliminar un ticket
// ------------------------------------------
router.delete("/:id", async (req, res) => {
  const ticketId = req.params.id;

  try {
    const sql = `DELETE FROM HDK_TICKET WHERE TIC_Ticket = :ticketId`;
    const binds = { ticketId: Number(ticketId) };

    const r = await execute(sql, binds, { autoCommit: true });

    if (r.rowsAffected === 0) {
      return res.status(404).json({ error: "Ticket no encontrado para eliminar" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(`DELETE /api/tickets/${ticketId} error:`, err.message, err.stack);
    res.status(500).json({ error: "Error eliminando ticket" });
  }
});

export default router;
