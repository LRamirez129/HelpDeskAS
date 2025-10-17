import express from 'express';
// Ajusta la ruta a tu archivo de conexión a la base de datos si es necesario
import { execute } from "../db.js"; 

const reporteRepuestoRouter = express.Router();

// =======================================================
// GET /api/reportes/consumo-repuestos-solicitante
// Obtiene el consumo total de repuestos agrupado por solicitante, con filtros.
// =======================================================
reporteRepuestoRouter.get('/consumo-repuestos-solicitante', async (req, res) => {
    try {
        // 1. OBTENER PARÁMETROS DE FILTRO DESDE LA URL (req.query)
        const { 
            fechaInicio, 
            fechaFin, 
            solicitanteId 
        } = req.query;

        // 2. INICIALIZAR LA CONSULTA BASE Y LOS BINDINGS
        let sql = `
            SELECT
                U.USR_Nombre AS SOLICITANTE,
                R.REP_Repuesto AS CODIGO_REPUESTO,
                R.TRP_Descripcion AS DESCRIPCION_REPUESTO,
                SUM(R.TRP_Cantidad) AS CANTIDAD_TOTAL_CONSUMIDA,
                -- ✅ CORRECCIÓN: Usamos NVL para convertir NULL a 0 en el conteo de tickets
                NVL(COUNT(DISTINCT T.TIC_Ticket), 0) AS TICKETS_INVOLUCRADOS
            FROM
                HDK_USUARIO U
            JOIN
                HDK_TICKET T ON U.USR_Usuario = T.TIC_UsuarioCreacion
            JOIN
                HDK_TICKET_REPUESTOS R ON T.TIC_Ticket = R.TIC_Ticket
        `;
        
        const binds = {};
        const whereClauses = [];

        // 3. CONSTRUCCIÓN DE LA CLÁUSULA WHERE (Filtros Condicionales)

        // A. Filtro por Rango de Fechas
        if (fechaInicio && fechaFin) {
            whereClauses.push(`T.TIC_FechaHCreacion BETWEEN TO_TIMESTAMP(:fechaInicio, 'YYYY-MM-DD HH24:MI:SS') AND TO_TIMESTAMP(:fechaFin, 'YYYY-MM-DD HH24:MI:SS')`);
            
            // Asignamos los valores a los binds
            binds.fechaInicio = `${fechaInicio} 00:00:00`;
            binds.fechaFin = `${fechaFin} 23:59:59`;
        }

        // B. Filtro por Solicitante
        if (solicitanteId) {
            whereClauses.push(`U.USR_Usuario = :solicitanteId`);
            binds.solicitanteId = solicitanteId;
        }

        // 4. AÑADIR LA CLÁUSULA WHERE A LA CONSULTA FINAL
        if (whereClauses.length > 0) {
            sql += ` WHERE ` + whereClauses.join(' AND ');
        }
        
        // 5. CLÁUSULA GROUP BY
        sql += `
            GROUP BY
                U.USR_Nombre,
                R.REP_Repuesto,
                R.TRP_Descripcion
            ORDER BY
                U.USR_Nombre,
                R.REP_Repuesto
        `;

        // 6. EJECUCIÓN DE LA CONSULTA
        const result = await execute(sql, binds);
        
        res.json(result.rows);

    } catch (error) {
        console.error("Error al obtener el reporte de repuestos:", error);
        res.status(500).json({ 
            message: "Error al generar el reporte: " + error.message,
            details: error.message 
        });
    }
});

export default reporteRepuestoRouter;