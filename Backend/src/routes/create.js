// src/routes/crud.js
import express from "express";
import { execute, oracledb } from "../db.js";

const router = express.Router();

/**
 * POST /api/crud
 * Crea un nuevo departamento.
 * Body esperado (JSON):
 *   { usuarioId, asunto, descripcion?, prioridad, estado? }
 * Notas:
 *   - TIC_Ticket se genera con la secuencia HDK_TICKET_SEQ (ya creada).
 *   - Estado por defecto: 'Abierto'
 */
router.post("/", async (req, res) => {
    /*
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
    */

  try {
    const sql = `BEGIN USP_CREATE( :p_jsonObjeto, :id); END;`;
    const jsonObjeto = JSON.stringify(req.body);
    const binds = {p_jsonObjeto: jsonObjeto,                    
                   id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                };

    const r = await execute(sql, binds, { autoCommit: true });
    const newId = r?.outBinds?.id?.[0];

    res.status(201).json({ id: newId, message: "Departamento creado" });
  } catch (err) {
    console.error("POST /api/crud error:", err);
    res.status(500).json({ error: "Error creando departamento" });
  }
});

export default router;
