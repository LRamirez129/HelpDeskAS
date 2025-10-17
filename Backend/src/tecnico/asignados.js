import { Router } from "express";
// RUTA CORREGIDA: Subimos tres niveles para llegar a Backend/db.js
import { execute } from "../db.js"; 

const router = Router();

// =======================================================
// 📌 CONSULTA SQL CON LEFT JOIN (Para mostrar todos los tickets activos)
// =======================================================
// La función ahora no requiere ningún parámetro.
async function getTicketsAsignados() {
    
    const SQL_GET_TICKETS_ASIGNADOS = `
    SELECT
        T.TIC_Ticket AS ID_TICKET,
        T.TIC_Asunto AS ASUNTO,
        T.TIC_Estado AS ESTADO,
        T.TIC_Prioridad AS PRIORIDAD,
        T.TIC_SLA AS SLA_HORAS_BASE,
        -- Cálculo de SLA que funciona en Oracle (resta de fechas * 24 * 60)
        CAST(
            ( (T.TIC_FechaHCreacion + (T.TIC_SLA / 24)) - SYSDATE ) * 24 * 60
        AS NUMBER(10, 0)) AS SLA_MINUTOS_RESTANTES,
        -- 💡 U_ASIGNADO.USR_Nombre puede ser NULL si el ticket no tiene técnico
        U_ASIGNADO.USR_Nombre AS TECNICO_ASIGNADO,
        CP.CAT_Nombre AS CATEGORIA_PRINCIPAL
    FROM
        HDK_TICKET T
    -- 🏆 CAMBIO CLAVE: Usamos LEFT JOIN para no perder tickets sin asignación.
    LEFT JOIN 
        HDK_USUARIO U_ASIGNADO ON T.TIC_TecnicoInicioAtencion = U_ASIGNADO.USR_Usuario
    INNER JOIN
        HDK_CATEGORIA C ON T.TIC_Categoria = C.CAT_Categoria
    LEFT JOIN
        HDK_CATEGORIA CP ON C.CAT_CategoriaPadre = CP.CAT_Categoria
    WHERE
        -- Filtro: Trae todos los tickets activos, sin importar el técnico
        T.TIC_Estado IN ('Abierto', 'Asignado', 'En progreso')
    ORDER BY
        CASE T.TIC_Prioridad 
            WHEN 'Crítica' THEN 1
            WHEN 'Alta' THEN 2
            WHEN 'Media' THEN 3
            WHEN 'Baja' THEN 4
            ELSE 5 
        END,
        T.TIC_FechaHCreacion ASC
    `;

    try {
        // Ejecutamos la consulta sin pasar parámetros de enlace
        const result = await execute(SQL_GET_TICKETS_ASIGNADOS, {}); 
        return result.rows;
    } catch (error) {
        console.error("Error en la ejecución de la consulta de Oracle:", error.message || error);
        throw new Error(error.message || "Fallo en la base de datos al obtener tickets.");
    }
}


// =======================================================
// 🌐 RUTA EXPRESS: GET /api/asignados
// =======================================================
router.get("/", async (req, res) => {
    try {
        // Ya no necesitamos leer req.query.tecnicoId
        
        const tickets = await getTicketsAsignados();
        
        // Mapea y formatea la data para el frontend
        const ticketsFormateados = tickets.map(t => {
            let slaTexto = '';
            // Usamos un valor seguro (0) si es nulo
            const minutos = Math.floor(t.SLA_MINUTOS_RESTANTES || 0); 

            // Lógica para formatear el tiempo restante
            if (minutos <= 0) {
                slaTexto = 'Vencido';
            } else if (minutos < 60) {
                slaTexto = `${minutos}min restantes`;
            } else {
                const horas = Math.floor(minutos / 60);
                const minutosRestantes = minutos % 60;
                slaTexto = minutosRestantes === 0 ? `${horas}h restantes` : `${horas}h ${minutosRestantes}min restantes`;
            }

            return {
                // Genera el ID formateado (T001)
                ID_TICKET: `T${String(t.ID_TICKET).padStart(3, '0')}`, 
                ASUNTO: t.ASUNTO,
                ESTADO: t.ESTADO,
                PRIORIDAD: t.PRIORIDAD,
                // Si TECNICO_ASIGNADO es NULL, mostramos "Pendiente"
                TECNICO_ASIGNADO: t.TECNICO_ASIGNADO || 'Pendiente', 
                CATEGORIA_PRINCIPAL: t.CATEGORIA_PRINCIPAL,
                SLA_RESTANTE_MINUTOS: minutos,
                SLA_RESTANTE_TEXTO: slaTexto, 
            };
        });

        res.json(ticketsFormateados);
    } catch (err) {
        // Captura el error de la función getTicketsAsignados y lo devuelve como JSON
        const errorMessage = err.message || "Error desconocido en el servidor.";
        console.error("Error al manejar la solicitud /api/asignados:", errorMessage);
        res.status(500).json({ 
            message: "Error interno del servidor al obtener tickets asignados.", 
            details: errorMessage
        });
    }
});
export default router;
