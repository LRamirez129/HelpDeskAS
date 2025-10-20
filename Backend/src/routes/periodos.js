import express from 'express';
import { execute } from '../db.js'; 

const router = express.Router();

// Función auxiliar para parsear números
const parseNumber = (val) => {
    const num = Number(val);
    return isNaN(num) ? null : num; 
};

// =======================================================
// GET /api/periodos (LISTAR TODOS los períodos)
// =======================================================
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT
                PER_Periodo     AS ID,
                PER_Nombre      AS NOMBRE,
                PER_Descripcion AS DESCRIPCION,
                PER_FechaDesde  AS FECHA_DESDE,
                PER_FechaHasta  AS FECHA_HASTA,
                PER_Activo      AS ACTIVO
            FROM HDK_PERIODOS
            ORDER BY PER_Periodo DESC
        `;

        const r = await execute(sql, {});
        res.json(r.rows ?? []);
    } catch (err) {
        console.error("GET /api/periodos error:", err);
        res.status(500).json({ error: "Error al obtener el listado de períodos. " + err.message });
    }
});

// ---------------------------------------------------------------------

// =======================================================
// POST /api/periodos (CREAR nuevo período) - CORREGIDO ORA-01858
// =======================================================
router.post('/', async (req, res) => {
    const { PER_Nombre, PER_Descripcion, PER_FechaDesde, PER_FechaHasta, PER_Activo } = req.body; 

    if (!PER_Nombre || !PER_FechaDesde) {
        return res.status(400).json({ error: "El Nombre y la Fecha Desde son obligatorios." });
    }

    try {
        const sql = `
            INSERT INTO HDK_PERIODOS (PER_Nombre, PER_Descripcion, PER_FechaDesde, PER_FechaHasta, PER_Activo)
            VALUES (:PER_Nombre, :PER_Descripcion, TO_DATE(:PER_FechaDesde, 'YYYY-MM-DD'), 
                    TO_DATE(:PER_FechaHasta, 'YYYY-MM-DD'), :PER_Activo)
        `;
        
        // CORRECCIÓN: Quitamos la concatenación de SQL. Solo enviamos la cadena de fecha o null.
        const binds = {
            PER_Nombre, 
            PER_Descripcion: PER_Descripcion || null,
            PER_FechaDesde, // Cadena 'YYYY-MM-DD'
            PER_FechaHasta: PER_FechaHasta || null, // Cadena 'YYYY-MM-DD' o null
            PER_Activo: PER_Activo ? (PER_Activo.toUpperCase() === 'N' ? 'N' : 'S') : 'S',
        };

        await execute(sql, binds); 
        
        res.status(201).json({ message: "Período creado con éxito." });
    } catch (err) {
        console.error("POST /api/periodos error:", err);
        const oracleMessage = err.message || "Error desconocido en la BD.";
        res.status(500).json({ 
            error: "Error al crear el período: " + oracleMessage 
        });
    }
});

// ---------------------------------------------------------------------

// =======================================================
// PUT /api/periodos/:id (ACTUALIZAR) - CORREGIDO ORA-01858
// =======================================================
router.put('/:id', async (req, res) => {
    const id = parseNumber(req.params.id); 
    const { PER_Nombre, PER_Descripcion, PER_FechaDesde, PER_FechaHasta, PER_Activo } = req.body; 

    if (!id || !PER_Nombre || !PER_FechaDesde) {
        return res.status(400).json({ error: "ID de período, Nombre y Fecha Desde son obligatorios." });
    }

    try {
        const sql = `
            UPDATE HDK_PERIODOS
            SET PER_Nombre = :PER_Nombre,
                PER_Descripcion = :PER_Descripcion,
                PER_FechaDesde = TO_DATE(:PER_FechaDesde, 'YYYY-MM-DD'),
                PER_FechaHasta = TO_DATE(:PER_FechaHasta, 'YYYY-MM-DD'),
                PER_Activo = :PER_Activo
            WHERE PER_Periodo = :id
        `;

        // CORRECCIÓN: Quitamos la concatenación de SQL. Solo enviamos la cadena de fecha o null.
        const binds = {
            id,
            PER_Nombre,
            PER_Descripcion: PER_Descripcion || null,
            PER_FechaDesde, // Cadena 'YYYY-MM-DD'
            PER_FechaHasta: PER_FechaHasta || null, // Cadena 'YYYY-MM-DD' o null
            PER_Activo: PER_Activo ? (PER_Activo.toUpperCase() === 'N' ? 'N' : 'S') : 'S',
        };

        const r = await execute(sql, binds);

        if (r.rowsAffected === 0) {
            return res.status(404).json({ error: "Período no encontrado para actualizar." });
        }

        res.json({ message: `Período ${id} actualizado con éxito.` });
    } catch (err) {
        console.error(`PUT /api/periodos/${id} error:`, err);
        res.status(500).json({ error: "Error al actualizar el período: " + err.message });
    }
});

// ---------------------------------------------------------------------

// =======================================================
// DELETE /api/periodos/:id (ELIMINAR)
// =======================================================
router.delete('/:id', async (req, res) => {
    const id = req.params.id; 

    if (!id) {
        return res.status(400).json({ error: "El ID del período es obligatorio." });
    }

    try {
        const sql = `DELETE FROM HDK_PERIODOS WHERE PER_Periodo = :id`;
        const r = await execute(sql, { id: id });

        if (r.rowsAffected === 0) {
            return res.status(404).json({ error: "Período no encontrado para eliminar." });
        }

        res.json({ message: `Período ${id} eliminado con éxito.` });
    } catch (err) {
        console.error(`DELETE /api/periodos/${id} error:`, err);
        const oracleMessage = err.message || "Error al eliminar el período.";
        res.status(500).json({ error: oracleMessage });
    }
});


export default router;