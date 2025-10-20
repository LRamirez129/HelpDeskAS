// src/routes/categorias.js
import express from 'express';
import { execute } from '../db.js'; 

const router = express.Router();

// =======================================================
// CORRECCIÓN CLAVE para el error ORA-02291
// =======================================================
const parseNumber = (val) => {
    // Si el valor es null, undefined, o una cadena vacía (''), lo tratamos como NULL para la DB.
    if (val === '' || val === null || val === undefined) {
        return null;
    }
    
    const num = Number(val);
    
    // Si la conversión falla (es NaN) o el número es 0 o negativo, 
    // lo forzamos a NULL, ya que 0 o valores no numéricos no son IDs válidos.
    if (isNaN(num) || num <= 0) { 
        return null;
    }
    
    return num; 
};

// =======================================================
// GET /api/categorias (LISTAR TODAS las categorías)
// =======================================================
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT
                CAT_CATEGORIA        AS ID,
                CAT_CATEGORIAPADRE   AS ID_PADRE,
                CAT_NOMBRE           AS NOMBRE,
                CAT_DESCRIPCION      AS DESCRIPCION,
                CAT_ICONO            AS ICONO,
                SLA_SLA              AS ID_SLA
            FROM 
                HDK_CATEGORIA   
            ORDER BY 
                CAT_NOMBRE ASC
        `;

        const r = await execute(sql, {});
        res.json(r.rows ?? []);
    } catch (err) {
        console.error("GET /api/categorias error:", err);
        res.status(500).json({ error: "Error al obtener el listado de categorías: " + err.message });
    }
});

// =======================================================
// POST /api/categorias (CREAR nueva categoría)
// =======================================================
router.post('/', async (req, res) => {
    const { NOMBRE, DESCRIPCION, ID_PADRE, ICONO, ID_SLA } = req.body; 

    if (!NOMBRE) {
        return res.status(400).json({ error: "El Nombre de la Categoría es obligatorio." });
    }

    try {
        const sql = `
            INSERT INTO HDK_CATEGORIA ( 
                CAT_CATEGORIAPADRE, 
                CAT_NOMBRE, 
                CAT_DESCRIPCION,
                CAT_ICONO,
                SLA_SLA
            )
            VALUES (
                :ID_PADRE, 
                :NOMBRE, 
                :DESCRIPCION,
                :ICONO,
                :ID_SLA
            )
        `;
        
        const binds = {
            NOMBRE, 
            DESCRIPCION: DESCRIPCION || null,
            ICONO: ICONO || null,
            // Usa la función corregida para asegurar que los padres sean NULL
            ID_PADRE: parseNumber(ID_PADRE), 
            ID_SLA: parseNumber(ID_SLA),     
        };

        await execute(sql, binds); 
        
        res.status(201).json({ message: "Categoría creada con éxito." });
    } catch (err) {
        console.error("POST /api/categorias error:", err);
        const oracleMessage = err.message || "Error desconocido en la BD.";
        res.status(500).json({ 
            error: "Error al crear la categoría: " + oracleMessage 
        });
    }
});

// =======================================================
// PUT /api/categorias/:id (ACTUALIZAR)
// =======================================================
router.put('/:id', async (req, res) => {
    const id = parseNumber(req.params.id); 
    const { NOMBRE, DESCRIPCION, ID_PADRE, ICONO, ID_SLA } = req.body; 

    if (!id || !NOMBRE) {
        return res.status(400).json({ error: "ID de categoría y Nombre son obligatorios." });
    }

    try {
        const sql = `
            UPDATE HDK_CATEGORIA 
            SET 
                CAT_NOMBRE = :NOMBRE,
                CAT_DESCRIPCION = :DESCRIPCION,
                CAT_CATEGORIAPADRE = :ID_PADRE,
                CAT_ICONO = :ICONO,
                SLA_SLA = :ID_SLA
            WHERE 
                CAT_CATEGORIA = :id
        `;

        const binds = {
            id,
            NOMBRE,
            DESCRIPCION: DESCRIPCION || null,
            ICONO: ICONO || null,
            // Usa la función corregida
            ID_PADRE: parseNumber(ID_PADRE),
            ID_SLA: parseNumber(ID_SLA), 
        };

        const r = await execute(sql, binds);

        if (r.rowsAffected === 0) {
            return res.status(404).json({ error: "Categoría no encontrada para actualizar." });
        }

        res.json({ message: `Categoría ${id} actualizada con éxito.` });
    } catch (err) {
        console.error(`PUT /api/categorias/${id} error:`, err);
        res.status(500).json({ error: "Error al actualizar la categoría: " + err.message });
    }
});

// =======================================================
// DELETE /api/categorias/:id (ELIMINAR)
// =======================================================
router.delete('/:id', async (req, res) => {
    const id = parseNumber(req.params.id); 

    if (!id) {
        return res.status(400).json({ error: "El ID de la categoría es obligatorio." });
    }

    try {
        const sql = `
            DELETE FROM HDK_CATEGORIA  
            WHERE CAT_CATEGORIA = :id
        `;
        
        const r = await execute(sql, { id });

        if (r.rowsAffected === 0) {
            return res.status(404).json({ error: "Categoría no encontrada para eliminar." });
        }

        res.json({ message: `Categoría ${id} eliminada con éxito.` });
    } catch (err) {
        console.error(`DELETE /api/categorias/${id} error:`, err);
        if (err.message.includes('foreign key')) {
             return res.status(409).json({ error: "No se puede eliminar la categoría porque está siendo utilizada por otros registros." });
        }
        const oracleMessage = err.message || "Error al eliminar la categoría.";
        res.status(500).json({ error: oracleMessage });
    }
});

export default router;