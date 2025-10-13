// src/routes/read.js
import express from "express";
import { execute, oracledb } from "../db.js";

const router = express.Router();

/**
 * GET /api/read
 * Lista read con filtros opcionales:
 *   - usuarioId: ID del usuario creador (HDK_USUARIO.USR_Usuario)
 *   - email: correo del usuario creador (HDK_USUARIO.USR_Correo)
 *   - estados: lista separada por comas (ej: Abierto,En progreso,Cerrado)
 */
router.get("/", async (req, res) => {
  const { entidad, id } = req.query;
  const odbConnection = await oracledb.getConnection();
  
  if (!entidad) {
    return res.status(400).json({ error: "El parámetro 'entidad' es requerido" });
  }

  try {
    const sql = `BEGIN USP_READ(:CUR_OBJETO, :P_ENTIDAD, :P_ID); END;`;   
    
    const binds = {
      CUR_OBJETO: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      P_ENTIDAD: entidad,
      P_ID: id ? Number(id) : null
    };

    const result = await odbConnection.execute(sql, binds);

    // Leer el cursor y devolver los datos como array de objetos
    const cursor = result.outBinds.CUR_OBJETO;
    const rows = [];
    let row;
    while ((row = await cursor.getRow())) {
      rows.push(row);
    }
    await cursor.close();

    res.json(rows);
  } catch (err) {
    console.error("GET /api/read error:", err);
    res.status(500).json({ error: "Error obteniendo datos" });
  }finally {
    // Step 2: Close connection using process.nextTick
    if (odbConnection) {
      process.nextTick(() => {
        odbConnection.close().catch(err => console.error('Error closing connection:', err));
      });
    }
  }
});

export default router;
