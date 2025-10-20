import express from 'express';
import { execute } from '../db.js'; 

const router = express.Router();

// Función auxiliar para parsear números
const parseNumber = (val) => {
    const num = Number(val);
    // Retorna null si no es un número válido
    return isNaN(num) ? null : num; 
};

// =======================================================
// GET /api/repuestos (LISTAR TODOS los repuestos)
// =======================================================
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT
                TRP_Repuesto      AS ID,
                TIC_Ticket        AS TICKET_ID,
                REP_Repuesto      AS CODIGO_REPUESTO,
                TRP_Cantidad      AS CANTIDAD,
                TRP_Descripcion   AS DESCRIPCION
            FROM HDK_TICKET_REPUESTOS
            ORDER BY TRP_Repuesto DESC
        `;

        const r = await execute(sql, {});
        res.json(r.rows ?? []);
    } catch (err) {
        console.error("GET /api/repuestos error:", err);
        res.status(500).json({ error: "Error al obtener el listado general de repuestos. " + err.message });
    }
});

// =======================================================
// POST /api/repuestos (CREAR nuevo repuesto)
// =======================================================
router.post('/', async (req, res) => {
    const { TIC_Ticket, REP_Repuesto, TRP_Cantidad, TRP_Descripcion } = req.body; 

    if (!TIC_Ticket || !REP_Repuesto) {
        return res.status(400).json({ error: "El ID de Ticket y el Código de Repuesto son obligatorios." });
    }

    try {
        const sql = `
            INSERT INTO HDK_TICKET_REPUESTOS (TIC_Ticket, REP_Repuesto, TRP_Cantidad, TRP_Descripcion)
            VALUES (:TIC_Ticket, :REP_Repuesto, :TRP_Cantidad, :TRP_Descripcion)
        `;
        
        const binds = {
            // Enviamos los valores como strings/números crudos (sin parseNumber)
            TIC_Ticket: TIC_Ticket, 
            REP_Repuesto: REP_Repuesto,
            TRP_Cantidad: parseNumber(TRP_Cantidad) || 1, 
            TRP_Descripcion: TRP_Descripcion || null,
        };

        await execute(sql, binds); 
        
        res.status(201).json({ message: "Repuesto agregado con éxito." });
    } catch (err) {
        console.error("POST /api/repuestos error:", err);
        
        const oracleMessage = err.message || "Error desconocido en la BD.";
        res.status(500).json({ 
            error: "Error al agregar el repuesto: " + oracleMessage 
        });
    }
});

// =======================================================
// PUT /api/repuestos/:id (ACTUALIZAR)
// =======================================================
router.put('/:id', async (req, res) => {
    const id = parseNumber(req.params.id); 
    const { REP_Repuesto, TRP_Cantidad, TRP_Descripcion } = req.body; 

    if (!id || !REP_Repuesto) {
        return res.status(400).json({ error: "ID de repuesto y Código de repuesto son obligatorios." });
    }

    try {
        const sql = `
            UPDATE HDK_TICKET_REPUESTOS
            SET REP_Repuesto = :REP_Repuesto,
                TRP_Cantidad = :TRP_Cantidad,
                TRP_Descripcion = :TRP_Descripcion
            WHERE TRP_Repuesto = :id
        `;

        const binds = {
            id,
            REP_Repuesto,
            TRP_Cantidad: parseNumber(TRP_Cantidad) || 1,
            TRP_Descripcion: TRP_Descripcion || null,
        };

        const r = await execute(sql, binds);
        // El COMMIT lo maneja db.js

        if (r.rowsAffected === 0) {
            return res.status(404).json({ error: "Repuesto no encontrado para actualizar." });
        }

        res.json({ message: `Repuesto ${id} actualizado con éxito.` });
    } catch (err) {
        console.error(`PUT /api/repuestos/${id} error:`, err);
        res.status(500).json({ error: "Error al actualizar el repuesto: " + err.message });
    }
});

// =======================================================
// DELETE /api/repuestos/:id (ELIMINAR)
// =======================================================
router.delete('/:id', async (req, res) => {
    const id = req.params.id; // ID crudo

    if (!id) {
        return res.status(400).json({ error: "El ID del repuesto es obligatorio." });
    }

    try {
        const sql = `DELETE FROM HDK_TICKET_REPUESTOS WHERE TRP_Repuesto = :id`;
        const r = await execute(sql, { id: id });
        // El COMMIT lo maneja db.js

        if (r.rowsAffected === 0) {
            return res.status(404).json({ error: "Repuesto no encontrado para eliminar." });
        }

        res.json({ message: `Repuesto ${id} eliminado con éxito.` });
    } catch (err) {
        console.error(`DELETE /api/repuestos/${id} error:`, err);
        const oracleMessage = err.message || "Error al eliminar el repuesto.";
        res.status(500).json({ error: oracleMessage });
    }
});

// =======================================================
// GET /api/repuestos/listado-tickets (OBTENER TICKETS PARA SELECT)
// =======================================================
router.get('/listado-tickets', async (req, res) => {
    try {
        const sql = `
            SELECT 
                TIC_TICKET AS ID,    
                TIC_ASUNTO AS TITULO 
            FROM 
                HDK_TICKET
            ORDER BY 
                TIC_TICKET DESC
        `;
        const r = await execute(sql, {});
        res.json(r.rows ?? []);
    } catch (err) {
        console.error("GET /api/repuestos/listado-tickets error:", err);
        res.status(500).json({ error: "Error al obtener el listado de tickets." + err.message });
    }
});


export default router;