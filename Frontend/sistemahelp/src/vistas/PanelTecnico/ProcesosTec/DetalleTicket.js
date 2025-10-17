import React, { useState, useEffect } from 'react';
import './detalle.css';

// Iconos (Asegúrate de que las rutas a tus imágenes sean correctas)
import historiaIcon from '../../../Iconos/historia.png';
import repuestosIcon from '../../../Iconos/repuestos.png';
// Iconos de detalles y acciones
import usuarioIcon from '../../../Iconos/usuario.png';
import equipoIcon from '../../../Iconos/equipo.png'; 
import ubicacionIcon from '../../../Iconos/ubicacion.png'; 
import cambiarIcon from '../../../Iconos/cambiar.png'; 
import terminarIcon from '../../../Iconos/terminar.png'; 

// URL de tu API
const API_BASE_URL = "http://localhost:4000/api/detalletickets"; 

// 🚨 IMPORTANTE: ID del técnico logueado. REEMPLAZA ESTA CONSTANTE POR EL ID REAL
const USUARIO_TECNICO_ID = 'T001'; 


const DetalleTicketPage = ({ ticketId, setActiveModule }) => {
    // 1. ESTADOS PARA MANEJO DE DATOS Y PESTAÑAS
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('historial');
    const [isUpdating, setIsUpdating] = useState(false); 
    
    // ESTADOS PARA LA FUNCIONALIDAD DE COMENTARIOS
    const [comentario, setComentario] = useState('');
    const [isCommenting, setIsCommenting] = useState(false); 
    
    // ✨ ESTADOS PARA LA FUNCIONALIDAD DE REPUESTOS
    const [repuestoData, setRepuestoData] = useState({
        codigo: '',
        descripcion: '',
        cantidad: 1,
    });
    const [isAddingRepuesto, setIsAddingRepuesto] = useState(false);


    // 2. FUNCIÓN DE FETCH para obtener el detalle del ticket
    const fetchTicketDetalle = async () => {
        if (!ticketId) {
            setError("No se proporcionó un ID de ticket válido.");
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/${ticketId}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setTicket(data);
        } catch (err) {
            console.error("Fallo al obtener detalle del ticket:", err);
            setError('Error al cargar detalles del ticket: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // 3. EFECTO para consumir la API
    useEffect(() => {
        fetchTicketDetalle();
    }, [ticketId]);


    // =======================================================
    // 🎯 FUNCIÓN DE ACTUALIZACIÓN DE ESTADO (PATCH)
    // =======================================================
    const actualizarEstadoTicket = async (nuevoEstado) => {
        if (!nuevoEstado || nuevoEstado === "-- Seleccionar --") {
            alert("Por favor, selecciona un estado válido.");
            return;
        }

        if (isUpdating) return; 

        setIsUpdating(true);
        setError(null);

        try {
            const url = `${API_BASE_URL}/${ticketId}/estado`;
            
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nuevoEstado: nuevoEstado,
                    usuarioTecnico: USUARIO_TECNICO_ID 
                })
            });

            if (response.ok) {
                await fetchTicketDetalle(); 
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

        } catch (err) {
            console.error("Fallo al actualizar el estado:", err);
            setError('Error al actualizar el estado: ' + err.message);
            alert('Fallo al actualizar: ' + err.message);
        } finally {
            setIsUpdating(false);
        }
    };
    
    // =======================================================
    // 📝 FUNCIÓN PARA AGREGAR COMENTARIO
    // =======================================================
    const agregarComentario = async () => {
        if (!comentario.trim()) {
            alert("El comentario no puede estar vacío.");
            return;
        }

        if (isCommenting) return;

        setIsCommenting(true);
        setError(null);

        try {
            const url = `${API_BASE_URL}/${ticketId}/comentarios`;
            
            const response = await fetch(url, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mensaje: comentario.trim(),
                    autor: (ticket && ticket.usuarioNombre) || 'Técnico', 
                    usuarioId: USUARIO_TECNICO_ID 
                })
            });

            if (response.ok) {
                setComentario(''); 
                await fetchTicketDetalle(); 
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

        } catch (err) {
            console.error("Fallo al agregar el comentario:", err);
            setError('Error al agregar el comentario: ' + err.message);
            alert('Fallo al agregar el comentario: ' + err.message);
        } finally {
            setIsCommenting(false);
        }
    };
    
    // =======================================================
    // ✨ FUNCIÓN PARA REGISTRAR REPUESTO
    // =======================================================
    const agregarRepuesto = async () => {
        if (!repuestoData.codigo.trim() || !repuestoData.descripcion.trim() || repuestoData.cantidad <= 0) {
            alert("Por favor, completa el Código, la Descripción y la Cantidad.");
            return;
        }

        if (isAddingRepuesto) return;
        setIsAddingRepuesto(true);
        setError(null);

        try {
            const url = `${API_BASE_URL}/${ticketId}/repuestos`; 
            const response = await fetch(url, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigo: repuestoData.codigo.trim(),
                    descripcion: repuestoData.descripcion.trim(),
                    cantidad: repuestoData.cantidad,
                    usuarioTecnico: USUARIO_TECNICO_ID 
                })
            });

            if (response.ok) {
                // Éxito: Limpiar formulario, recargar datos y cambiar a la pestaña de repuestos
                setRepuestoData({ codigo: '', descripcion: '', cantidad: 1 }); 
                await fetchTicketDetalle(); 
                setActiveTab('repuestos'); 
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

        } catch (err) {
            console.error("Fallo al agregar el repuesto:", err);
            setError('Error al solicitar el repuesto: ' + err.message);
            alert('Fallo al solicitar el repuesto: ' + err.message);
        } finally {
            setIsAddingRepuesto(false);
        }
    };


    // 4. RENDERIZADO CONDICIONAL: Carga y Errores
    if (loading) {
        return <div className="detalle-ticket-container loading-state">
            <h2>Cargando...</h2>
            <p>Obteniendo detalles completos del Ticket #{ticketId} de Oracle...</p>
        </div>;
    }
    
    if (error) {
        return <div className="detalle-ticket-container error-state">
            <h2>🚨 Error de Conexión 🚨</h2>
            <p>No se pudo cargar el ticket. Detalles: {error}</p>
        </div>;
    }
    
    if (!ticket) {
        return <div className="detalle-ticket-container error-state">
            <h2>Ticket no encontrado</h2>
            <p>El ID {ticketId} no existe.</p>
        </div>;
    }

    // 5. EXTRACCIÓN DE DATOS
    const t = ticket;
    const titulo = t.titulo || 'Título del Ticket';
    const ticketIdDisplay = t.id ? `Ticket #${String(t.id).padStart(4, '0')}` : 'Ticket #000';
    const fechaCreacion = t.fechaCreacion || '--/--/----';
    const descripcion = t.descripcion || 'Descripción del problema';
    const usuarioNombre = t.usuarioNombre || 'Nombre del Usuario';
    const departamentoUsuario = t.departamentoUsuario || 'N/A';
    const prioridadDisplay = t.prioridad || 'N/A'; 
    const historial = Array.isArray(t.historial) ? t.historial : [];
    const repuestos = Array.isArray(t.repuestos) ? t.repuestos : [];
    
    // 6. RENDERIZADO DE LA INTERFAZ
    return (
        <div className="detalle-ticket-container">
            {/* Botón volver */}
            {typeof setActiveModule === 'function' && (
                <div className="volver-posicion" style={{ marginBottom: 12 }}> 
        <button className="btn-action" onClick={() => setActiveModule('tickets')}>
            ← Volver
        </button>
    </div>
            )}

            {/* Header del Ticket MODIFICADO: Se eliminaron las insignias de estado y prioridad */}
            <div className="ticket-header-panel">
                <div className="ticket-info">
                    <h2>{titulo}</h2>
                    <span className="ticket-id">{ticketIdDisplay}</span>
                </div>
                <div className="ticket-badges">
                    <span className="badge-fecha">Creado: {fechaCreacion}</span>
                </div>
            </div>
            
            <div className="main-content-wrapper">
                {/* COLUMNA IZQUIERDA: Contenido principal (Descripción, Historial, Repuestos) */}
                <div className="ticket-content">
                    
                    {/* Panel de Descripción */}
                    <div className="panel">
                        <h3>Descripción del problema</h3>
                        <p>{descripcion}</p>
                        <div className="problem-details">
                            <div className="detail-item">
                                <img src={usuarioIcon} alt="Usuario" className="detail-icon" />
                                <span>{usuarioNombre}</span>
                            </div>
                            <div className="detail-item">
                                <img src={ubicacionIcon} alt="Departamento" className="detail-icon" />
                                <span>{departamentoUsuario}</span>
                            </div>
                            <div className="detail-item">
                                <img src={equipoIcon} alt="Prioridad" className="detail-icon" />
                                <span>{prioridadDisplay}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Panel de pestañas: Historial y Repuestos */}
                    <div className="panel panel-tabs">
                        <div className="tabs-navigation">
                            {/* Botón de Historial */}
                            <button
                                className={`tab-button ${activeTab === 'historial' ? 'active' : ''}`}
                                onClick={() => setActiveTab('historial')}
                                data-tooltip="Historial"
                            >
                                <img src={historiaIcon} alt="Historial" className="tab-icon" />
                            </button>
                            {/* Botón de Repuestos */}
                            <button
                                className={`tab-button ${activeTab === 'repuestos' ? 'active' : ''}`}
                                onClick={() => setActiveTab('repuestos')}
                                data-tooltip="Repuestos"
                            >
                                <img src={repuestosIcon} alt="Repuestos" className="tab-icon" />
                            </button>
                        </div>
                        
                        <div className="tab-content">
                            {/* Contenido de Historial */}
                            {activeTab === 'historial' && (
                                <ul className="timeline">
                                    {historial.length === 0 ? (
                                        <li className="timeline-empty">Sin eventos registrados.</li>
                                    ) : (
                                        historial.map((h, idx) => (
                                            <li key={idx} className="timeline-item">
                                                <div className="timeline-dot"></div>
                                                <div className="timeline-content"> 
                                                    <div className="timeline-header">
                                                        {/* Autor como título principal */}
                                                        <span className="timeline-autor">{h.autor || 'Sistema'}</span>
                                                        {/* ID y fecha/meta como información secundaria alineada */}
                                                        <span className="timeline-meta">
                                                          {h.fecha || '--/--/----'}
                                                        </span>
                                                    </div>
                                                    <p className="timeline-text">{h.mensaje || ''}</p>
                                                    {h.tipo && <span className="timeline-tipo">{h.tipo}</span>} 
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}

                            {/* Contenido de Repuestos */}
                            {activeTab === 'repuestos' && (
                                <ul className="repuestos-list">
                                    {repuestos.length === 0 ? (
                                        <li className="repuesto-empty">Sin repuestos registrados.</li>
                                    ) : (
                                        repuestos.map((r, idx) => (
                                            <li key={idx} className="repuestos-item">
                                                {/* Punto de estilo del historial */}
                                                <div className="repuesto-dot"></div> 
                                                <div className="repuesto-info">
                                                    <span className="nombre">
                                                        {r.descripcion || r.codigo || 'Repuesto sin nombre/código'}
                                                    </span>
                                                    <span className="codigo">
                                                        Cód: {r.codigo || '—'} | Cant: x{r.cantidad ?? 1}
                                                    </span>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                    
                    {/* PANEL SEPARADO: Registrar/Solicitar Repuesto */}
                    <div className="panel" style={{ marginTop: '20px' }}>
                        <h3>Registrar Repuesto</h3>
                        <div className="repuesto-form">
                            <div className="form-group">
                                <label htmlFor="rep-codigo">Código del Repuesto</label>
                                <input 
                                    id="rep-codigo"
                                    type="text" 
                                    placeholder="Ej. RAM-DDR4-8GB" 
                                    value={repuestoData.codigo}
                                    onChange={(e) => setRepuestoData({ ...repuestoData, codigo: e.target.value })}
                                    disabled={isAddingRepuesto}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="rep-descripcion">Descripción</label>
                                <input 
                                    id="rep-descripcion"
                                    type="text" 
                                    placeholder="Ej. Memoria RAM DDR4 8GB" 
                                    value={repuestoData.descripcion}
                                    onChange={(e) => setRepuestoData({ ...repuestoData, descripcion: e.target.value })}
                                    disabled={isAddingRepuesto}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="rep-cantidad">Cantidad</label>
                                <input 
                                    id="rep-cantidad"
                                    type="number" 
                                    min="1"
                                    value={repuestoData.cantidad}
                                    onChange={(e) => setRepuestoData({ ...repuestoData, cantidad: parseInt(e.target.value) || 1 })}
                                    disabled={isAddingRepuesto}
                                />
                            </div>
                            <button 
                                className="btn-action primary" 
                                onClick={agregarRepuesto}
                                disabled={isAddingRepuesto || !repuestoData.codigo.trim() || !repuestoData.descripcion.trim() || repuestoData.cantidad <= 0}
                            >
                                {isAddingRepuesto ? 'Registrando...' : 'Registrar Repuesto'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Sidebar de Acciones */}
                <div className="sidebar-actions">
                    {/* Panel de Estado */}
                    <div className="panel">
                        <h3>Acciones Rápidas</h3>
                        <div className="action-group status-actions">
                            <label htmlFor="select-estado">Cambiar Estado</label>
                            <select id="select-estado" className="status-select">
                                <option>-- Seleccionar --</option>
                                <option value="Abierto">Abierto</option>
                                <option value="En Progreso">En Progreso</option>
                                <option value="Cerrado">Cerrado</option>
                            </select>
                            <div className="action-icons-container">
                                <button
                                    className="action-button"
                                    data-tooltip="Cambiar Estado"
                                    onClick={() => {
                                        const selectElement = document.getElementById('select-estado');
                                        actualizarEstadoTicket(selectElement.value);
                                    }}
                                    disabled={isUpdating}
                                >
                                    <img src={cambiarIcon} alt="Cambiar" className="action-icon" />
                                </button>
                                <button
                                    className="action-button"
                                    data-tooltip="Terminar Ticket"
                                    onClick={() => console.log('Terminar ticket (stub)')}
                                >
                                    <img src={terminarIcon} alt="Completar" className="action-icon" />
                                </button>
                                {isUpdating && <span className="loading-text">Actualizando Estado...</span>}
                            </div>
                        </div>
                    </div>

                    {/* PANEL DE AGREGAR COMENTARIO */}
                    <div className="panel">
                        <h3>Agregar Comentario</h3>
                        <textarea 
                            rows="4" 
                            placeholder="Escribe aquí tu actualización..."
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)} 
                            disabled={isCommenting}
                        ></textarea>
                        <button 
                            className="btn-action primary" 
                            onClick={agregarComentario} 
                            disabled={isCommenting || comentario.trim().length === 0} 
                        >
                            {isCommenting ? 'Enviando...' : 'Agregar Comentario'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleTicketPage;