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
// GET /api/departamentos (LISTAR TODOS los departamentos ACTIVOS)
// =======================================================
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT
                DEP_Departamento    AS ID,
                DEP_Nombre          AS NOMBRE,
                DEP_Ubicacion       AS UBICACION,
                DEP_Activo          AS ACTIVO
            FROM 
                HDK_DEPARTAMENTO  -- Nombre de tabla corregido
            WHERE
                DEP_Activo = 'S'  -- Solo listar activos
            ORDER BY 
                DEP_Nombre ASC
        `;

        const r = await execute(sql, {});
        res.json(r.rows ?? []);
    } catch (err) {
        console.error("GET /api/departamentos error:", err);
        res.status(500).json({ error: "Error al obtener el listado de departamentos. " + err.message });
    }
});

// =======================================================
// GET /api/departamentos/:id (LEER un departamento específico)
// =======================================================
router.get('/:id', async (req, res) => {
    const id = parseNumber(req.params.id);

    if (!id) {
        return res.status(400).json({ error: "El ID del departamento es obligatorio y debe ser numérico." });
    }

    try {
        const sql = `
            SELECT
                DEP_Departamento    AS ID,
                DEP_Nombre          AS NOMBRE,
                DEP_Ubicacion       AS UBICACION,
                DEP_Activo          AS ACTIVO
            FROM 
                HDK_DEPARTAMENTO
            WHERE 
                DEP_Departamento = :id
        `;

        const r = await execute(sql, { id });

        if (!r.rows || r.rows.length === 0) {
            return res.status(404).json({ error: "Departamento no encontrado." });
        }

        res.json(r.rows[0]);
    } catch (err) {
        console.error(`GET /api/departamentos/${id} error:`, err);
        res.status(500).json({ error: "Error al obtener el departamento. " + err.message });
    }
});


// =======================================================
// POST /api/departamentos (CREAR nuevo departamento)
// =======================================================
router.post('/', async (req, res) => {
    // Solo necesitamos NOMBRE y UBICACION. El ID y ACTIVO se generan automáticamente.
    const { DEP_NOMBRE, DEP_UBICACION } = req.body; 

    if (!DEP_NOMBRE) {
        return res.status(400).json({ error: "El Nombre del Departamento es obligatorio." });
    }

    try {
        const sql = `
            INSERT INTO HDK_DEPARTAMENTO ( 
                DEP_Nombre, 
                DEP_Ubicacion
            )
            VALUES (
                :DEP_NOMBRE, 
                :DEP_UBICACION
            )
        `;
        
        const binds = {
            DEP_NOMBRE, 
            DEP_UBICACION: DEP_UBICACION || null,
        };

        await execute(sql, binds); 
        
        res.status(201).json({ message: "Departamento creado con éxito." });
    } catch (err) {
        console.error("POST /api/departamentos error:", err);
        const oracleMessage = err.message || "Error desconocido en la BD.";
        res.status(500).json({ 
            error: "Error al crear el departamento: " + oracleMessage 
        });
    }
});

// =======================================================
// PUT /api/departamentos/:id (ACTUALIZAR)
// =======================================================
router.put('/:id', async (req, res) => {
    const id = parseNumber(req.params.id); 
    // Ahora esperamos DEP_ACTIVO desde el frontend
    const { DEP_NOMBRE, DEP_UBICACION, DEP_ACTIVO } = req.body; 

    if (!id || !DEP_NOMBRE) {
        return res.status(400).json({ error: "ID de departamento y Nombre son obligatorios." });
    }
    
    // Aseguramos que ACTIVO sea 'S' o 'N'
    const activo = DEP_ACTIVO && ['S', 'N'].includes(DEP_ACTIVO.toUpperCase()) 
                   ? DEP_ACTIVO.toUpperCase() 
                   : 'S'; 

    try {
        const sql = `
            UPDATE HDK_DEPARTAMENTO
            SET 
                DEP_Nombre = :DEP_NOMBRE,
                DEP_Ubicacion = :DEP_UBICACION,
                DEP_Activo = :DEP_ACTIVO
            WHERE 
                DEP_Departamento = :id
        `;

        const binds = {
            id,
            DEP_NOMBRE,
            DEP_UBICACION: DEP_UBICACION || null,
            DEP_ACTIVO: activo 
        };

        const r = await execute(sql, binds);

        if (r.rowsAffected === 0) {
            return res.status(404).json({ error: "Departamento no encontrado para actualizar." });
        }

        res.json({ message: `Departamento ${id} actualizado con éxito.` });
    } catch (err) {
        console.error(`PUT /api/departamentos/${id} error:`, err);
        res.status(500).json({ error: "Error al actualizar el departamento: " + err.message });
    }
});

// =======================================================
// DELETE /api/departamentos/:id (BORRADO SUAVE - Inactivar)
// =======================================================
router.delete('/:id', async (req, res) => {
    const id = parseNumber(req.params.id); 

    if (!id) {
        return res.status(400).json({ error: "El ID del departamento es obligatorio." });
    }

    try {
        // Borrado Suave (soft delete)
        const sql = `
            UPDATE HDK_DEPARTAMENTO 
            SET 
                DEP_Activo = 'N' 
            WHERE 
                DEP_Departamento = :id
        `;
        
        const r = await execute(sql, { id });

        if (r.rowsAffected === 0) {
            return res.status(404).json({ error: "Departamento no encontrado para inactivar." });
        }

        res.json({ message: `Departamento ${id} inactivado (borrado suave) con éxito.` });
    } catch (err) {
        console.error(`DELETE /api/departamentos/${id} error:`, err);
        const oracleMessage = err.message || "Error al inactivar el departamento.";
        res.status(500).json({ error: oracleMessage });
    }
});


export default router;