import { Router } from "express";
import { execute } from "../db.js"; 

const router = Router();

// =======================================================
// 📌 RUTA GET /api/detalletickets/:id (Obtener Detalle)
// =======================================================
router.get("/:id", async (req, res) => {
    const rawTicketId = req.params.id;
    
    // 1. LÓGICA CRÍTICA: LIMPIEZA DEL ID A NÚMERO
    const ticketIdString = rawTicketId.replace(/[^0-9]/g, ''); 
    const numericTicketId = parseInt(ticketIdString); 

    if (isNaN(numericTicketId) || numericTicketId <= 0) { 
        return res.status(400).json({ message: "ID de ticket no numérico o inválido después de la limpieza." });
    }

    try {
        // --- A. Consulta de Datos PRINCIPALES del Ticket (CON DEPARTAMENTO) ---
        const SQL_DETALLE = `
            SELECT
                T.TIC_Ticket AS ID,
                T.TIC_Asunto AS TITULO,
                T.TIC_Descripcion AS DESCRIPCION,
                T.TIC_Estado AS ESTADO,
                T.TIC_Prioridad AS PRIORIDAD,
                TO_CHAR(T.TIC_FechaHCreacion, 'DD/MM/YYYY HH24:MI') AS FECHA_CREACION,
                
                U_CREA.USR_Nombre AS USUARIO_NOMBRE,
                U_CREA.USR_Correo AS CORREO,
                
                U_TECNICO.USR_Nombre AS TECNICO_ASIGNADO,
                
                D.DEP_Nombre AS DEPARTAMENTO_USUARIO
            FROM
                HDK_TICKET T
            INNER JOIN HDK_USUARIO U_CREA ON T.TIC_UsuarioCreacion = U_CREA.USR_Usuario
            LEFT JOIN HDK_USUARIO U_TECNICO ON T.TIC_TecnicoInicioAtencion = U_TECNICO.USR_Usuario
            INNER JOIN HDK_DEPARTAMENTO D ON U_CREA.DEP_Departamento = D.DEP_Departamento
            WHERE
                T.TIC_Ticket = :ticketId
        `;
        
        const ticketResult = await execute(SQL_DETALLE, { ticketId: numericTicketId });
        
        if (ticketResult.rows.length === 0) {
            return res.status(404).json({ message: `Ticket con ID ${rawTicketId} no encontrado.` });
        }
        
        const ticketData = ticketResult.rows[0];
        
        // --- B. Consulta del Historial/Comentarios ---
        const SQL_HISTORIAL = `
            SELECT
                C.COM_Comentario AS FECHA_ID, 
                U.USR_Nombre AS AUTOR,
                C.COM_Contenido AS MENSAJE
            FROM
                HDK_TICKET_COMENTARIOS C
            INNER JOIN HDK_USUARIO U ON C.USR_Usuario = U.USR_Usuario
            WHERE
                C.TIC_Ticket = :ticketId
            ORDER BY
                C.COM_Comentario ASC 
        `;
        const historialResult = await execute(SQL_HISTORIAL, { ticketId: numericTicketId });
        
        // --- C. Consulta de Repuestos ---
        const SQL_REPUESTOS = `
            SELECT
                TRP.REP_Repuesto AS CODIGO,
                TRP.TRP_Descripcion AS NOMBRE,
                TRP.TRP_Cantidad AS CANTIDAD
            FROM
                HDK_TICKET_REPUESTOS TRP
            WHERE
                TRP.TIC_Ticket = :ticketId
        `;
        const repuestosResult = await execute(SQL_REPUESTOS, { ticketId: numericTicketId });

        // 2. Combinar y formatear la data
        const finalTicket = {
            id: ticketData.ID,
            titulo: ticketData.TITULO,
            estado: ticketData.ESTADO,
            prioridad: ticketData.PRIORIDAD,
            fechaCreacion: ticketData.FECHA_CREACION, 
            
            descripcion: ticketData.DESCRIPCION,
            usuarioNombre: ticketData.USUARIO_NOMBRE,
            departamentoUsuario: ticketData.DEPARTAMENTO_USUARIO,
            
            correo: ticketData.CORREO,
            
            historial: historialResult.rows.map(h => ({
                fecha: `ID: ${h.FECHA_ID}`, 
                autor: h.AUTOR,
                mensaje: h.MENSAJE
            })),
            repuestos: repuestosResult.rows.map(r => ({
                codigo: r.CODIGO,
                nombre: r.NOMBRE,
                cantidad: r.CANTIDAD
            })),
            
            tecnicoAsignado: ticketData.TECNICO_ASIGNADO
        };

        res.json(finalTicket);

    } catch (err) {
        console.error(`Error al procesar el detalle del ticket ${rawTicketId}:`, err);
        res.status(500).json({ 
            message: "Error interno del servidor al consultar el detalle del ticket.", 
            details: err.message
        });
    }
});

// -------------------------------------------------------
// --- RUTA PATCH /api/detalletickets/:id/estado (Actualizar Estado)
// -------------------------------------------------------
router.patch("/:id/estado", async (req, res) => {
    const rawTicketId = req.params.id;
    const { nuevoEstado, usuarioTecnico } = req.body; 
    
    // 1. Limpieza de IDs
    const ticketIdString = rawTicketId.replace(/[^0-9]/g, '');
    const numericTicketId = parseInt(ticketIdString);
    const usuarioTecnicoString = String(usuarioTecnico).replace(/[^0-9]/g, '');
    const numericUsuarioTecnico = parseInt(usuarioTecnicoString);

    if (!nuevoEstado || isNaN(numericTicketId) || numericTicketId <= 0 || isNaN(numericUsuarioTecnico) || numericUsuarioTecnico <= 0) {
        return res.status(400).json({ message: "ID de ticket o de usuario técnico no numérico o inválido." });
    }

    try {
        // PASO 1: Actualizar el campo TIC_Estado en HDK_TICKET
        const SQL_UPDATE_TICKET = `
            UPDATE HDK_TICKET
            SET TIC_Estado = :estado
            WHERE TIC_Ticket = :ticketId
        `;
        await execute(SQL_UPDATE_TICKET, { 
            estado: nuevoEstado, 
            ticketId: numericTicketId 
        });

        // PASO 2: Registrar el cambio en HDK_TICKET_COMENTARIOS
        const mensajeHistorial = `Estado actualizado a: ${nuevoEstado}`;
        
        const SQL_INSERT_COMENTARIO = `
            INSERT INTO HDK_TICKET_COMENTARIOS 
                (COM_Comentario, TIC_Ticket, USR_Usuario, COM_Contenido) 
            VALUES 
                (DEFAULT, :ticketId, :usuarioTecnico, :contenido)
        `;
        
        await execute(SQL_INSERT_COMENTARIO, { 
            ticketId: numericTicketId, 
            usuarioTecnico: numericUsuarioTecnico, // Se usa el valor numérico limpio
            contenido: mensajeHistorial 
        });

        // Respuesta exitosa
        res.json({ success: true, message: `Ticket ${rawTicketId} actualizado a ${nuevoEstado} y registrado en historial.` });

    } catch (err) {
        console.error(`Error en la actualización de estado del ticket ${rawTicketId}:`, err); 
        res.status(500).json({ 
            message: "Error interno al actualizar el estado y/o registrar el historial.",
            details: err.message
        });
    }
});

// -------------------------------------------------------
// --- RUTA POST /api/detalletickets/:id/comentarios (Agregar Comentario Manual)
// -------------------------------------------------------
router.post("/:id/comentarios", async (req, res) => {
    const rawTicketId = req.params.id;
    const { mensaje, usuarioId } = req.body; 
    
    // 1. Limpieza de IDs
    const ticketIdString = rawTicketId.replace(/[^0-9]/g, '');
    const numericTicketId = parseInt(ticketIdString);
    const usuarioTecnicoString = String(usuarioId).replace(/[^0-9]/g, '');
    const numericUsuarioTecnico = parseInt(usuarioTecnicoString);

    if (!mensaje || mensaje.trim().length === 0 || isNaN(numericTicketId) || numericTicketId <= 0 || isNaN(numericUsuarioTecnico) || numericUsuarioTecnico <= 0) {
        return res.status(400).json({ message: "Datos de comentario incompletos o IDs inválidos." });
    }

    try {
        // PASO 1: Insertar el comentario manual en HDK_TICKET_COMENTARIOS
        const SQL_INSERT_COMENTARIO = `
            INSERT INTO HDK_TICKET_COMENTARIOS 
                (COM_Comentario, TIC_Ticket, USR_Usuario, COM_Contenido) 
            VALUES 
                (DEFAULT, :ticketId, :usuarioTecnico, :contenido)
        `;
        
        await execute(SQL_INSERT_COMENTARIO, { 
            ticketId: numericTicketId, 
            usuarioTecnico: numericUsuarioTecnico, 
            contenido: mensaje 
        });

        // Respuesta exitosa (201 Created es estándar para una creación)
        res.status(201).json({ 
            success: true, 
            message: `Comentario agregado al Ticket ${rawTicketId} exitosamente.` 
        });

    } catch (err) {
        console.error(`Error al insertar comentario en el ticket ${rawTicketId}:`, err); 
        res.status(500).json({ 
            message: "Error interno al agregar el comentario.",
            details: err.message
        });
    }
});

// -------------------------------------------------------
// ⚙️ RUTA POST /api/detalletickets/:id/repuestos (Registrar Repuesto - CORREGIDA)
// -------------------------------------------------------
router.post("/:id/repuestos", async (req, res) => {
    const rawTicketId = req.params.id;
    // Solo recibimos los detalles del repuesto
    const { codigo, descripcion, cantidad } = req.body; 
    
    const ticketIdString = rawTicketId.replace(/[^0-9]/g, '');
    const numericTicketId = parseInt(ticketIdString);
    const numericCantidad = parseInt(cantidad);
    
    // Verificación básica
    if (!codigo || !descripcion || numericCantidad <= 0 || isNaN(numericTicketId) || numericTicketId <= 0) {
        return res.status(400).json({ message: "Datos de repuesto incompletos o inválidos." });
    }

    try {
        // PASO 1: Insertar el nuevo repuesto en HDK_TICKET_REPUESTOS
        // La corrección clave: NO INCLUYE USR_USUARIO en la tabla HDK_TICKET_REPUESTOS.
        const SQL_INSERT_REPUESTO = `
            INSERT INTO HDK_TICKET_REPUESTOS 
                (TRP_Repuesto, TIC_Ticket, REP_Repuesto, TRP_Descripcion, TRP_Cantidad) 
            VALUES 
                (DEFAULT, :ticketId, :codigo, :descripcion, :cantidad)
        `; 
        
        await execute(SQL_INSERT_REPUESTO, { 
            ticketId: numericTicketId, 
            codigo: codigo,
            descripcion: descripcion,
            cantidad: numericCantidad
        });
        
        res.status(201).json({ 
            success: true, 
            message: `Repuesto ${codigo} agregado al Ticket ${rawTicketId} con éxito.` 
        });

    } catch (err) {
        console.error(`Error al registrar repuesto en el ticket ${rawTicketId}:`, err); 
        res.status(500).json({ 
            message: "Error interno al registrar el repuesto.",
            details: err.message
        });
    }
});


export default router;