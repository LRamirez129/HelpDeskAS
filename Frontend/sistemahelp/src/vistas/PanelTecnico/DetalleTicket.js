import React, { useState } from 'react';
import './detalle.css';

const mockTicket = {
    id: 'T-002',
    title: 'Problema con impresora HP LaserJet',
    status: 'en-proceso',
    priority: 'alta',
    category: 'hardware',
    user: 'María González',
    technician: 'Carlos Rodríguez',
    estimatedTime: '2-3 horas',
    location: 'Piso 2, Oficina 201 - Departamento de Contabilidad',
    equipment: 'HP LaserJet Pro M404n (Serie: VNC3L25639)',
    creationDate: '20/1/2025',
    creationTime: '10:15',
    description: 'La impresora HP LaserJet Pro M404n ubicada en el departamento de contabilidad ha dejado de responder completamente. Los usuarios reportan que no aparece en la red y no se puede imprimir desde ningún equipo. Se ha verificado que el cable de red está conectado correctamente y la impresora enciende normalmente. Las luces de estado muestran un patrón de parpadeo que indica posible problema con la tarjeta de red interna.',
    history: [
        { by: 'María González', action: 'Ticket creado', message: 'Impresora no responde desde esta mañana', date: '20/1/2025', time: '8:30' },
        { by: 'Carlos Rodríguez', action: 'Ticket asignado', message: 'Asignado para revisión técnica', date: '20/1/2025', time: '9:15' },
        { by: 'Carlos Rodríguez', action: 'Diagnóstico inicial', message: 'Verificado conexión física. Problema parece ser de tarjeta de red interna.', date: '20/1/2025', time: '9:45' },
        { by: 'Carlos Rodríguez', action: 'Repuestos identificados', message: 'Se requiere reemplazo de tarjeta de red. Solicitando repuestos.', date: '20/1/2025', time: '10:15' },
    ],
    comments: [], 
};

const DetalleTicketPage = () => {
    const [comment, setComment] = useState('');
    const [activeTab, setActiveTab] = useState('historial');

    const handleAddComment = () => {
        if (comment.trim() !== '') {
            console.log('Comentario agregado:', comment);
            setComment('');
        }
    };

    return (
        <div className="detalle-ticket-container">
            {/* Encabezado del Ticket */}
            <div className="ticket-header-section">
                <div className="ticket-info-top">
                    <div className="ticket-title-group">
                        <i className="bi bi-printer-fill ticket-icon"></i>
                        <h1>{mockTicket.title}</h1>
                    </div>
                    <div className="ticket-meta-tags">
                        <span className={`status-tag ${mockTicket.status}`}>{mockTicket.status}</span>
                        <span className={`priority-tag ${mockTicket.priority}`}>{mockTicket.priority}</span>
                        <span className={`category-tag ${mockTicket.category}`}>{mockTicket.category}</span>
                    </div>
                </div>
                <div className="ticket-meta-details">
                    <p><i className="bi bi-ticket-detailed me-2"></i> Ticket #{mockTicket.id}</p>
                    <p><i className="bi bi-calendar3 me-2"></i> Creado: {mockTicket.creationDate}</p>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="ticket-main-content-grid">
                {/* Panel izquierdo */}
                <div className="ticket-details-panel">
                    <div className="ticket-details-summary">
                        <p><i className="bi bi-person-circle me-2"></i> Usuario: <strong>{mockTicket.user}</strong></p>
                        <p><i className="bi bi-person-badge me-2"></i> Técnico: <strong>{mockTicket.technician}</strong></p>
                        <p><i className="bi bi-hourglass-split me-2"></i> Tiempo estimado: <strong>{mockTicket.estimatedTime}</strong></p>
                        <p><i className="bi bi-geo-alt-fill me-2"></i> Ubicación: <strong>{mockTicket.location}</strong></p>
                        <p><i className="bi bi-hdd-network me-2"></i> Equipo: <strong>{mockTicket.equipment}</strong></p>
                        <p><i className="bi bi-clock-history me-2"></i> Actualizado: <strong>{mockTicket.creationDate}, {mockTicket.creationTime}</strong></p>
                    </div>

                    <div className="ticket-description-box">
                        <h3><i className="bi bi-info-circle-fill me-2"></i>Descripción del problema</h3>
                        <p>{mockTicket.description}</p>
                    </div>

                    {/* Historial y Repuestos */}
                    <div className="ticket-tabs">
                        <div className="tab-buttons">
                            <button
                                className={`tab-btn ${activeTab === 'historial' ? 'active' : ''}`}
                                onClick={() => setActiveTab('historial')}
                            >
                                <i className="bi bi-clock-history me-1"></i> Historial
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'repuestos' ? 'active' : ''}`}
                                onClick={() => setActiveTab('repuestos')}
                            >
                                <i className="bi bi-box-seam me-1"></i> Repuestos
                            </button>
                        </div>
                        <div className="tab-content">
                            {activeTab === 'historial' ? (
                                <>
                                    <h4 className="history-title"><i className="bi bi-journal-text me-2"></i>Historial de Actualizaciones</h4>
                                    {mockTicket.history.map((item, index) => (
                                        <div key={index} className="history-item">
                                            <div className="history-info">
                                                <span className="history-by"><i className="bi bi-person-fill me-1"></i>{item.by}</span>
                                                <span className="history-action"><i className="bi bi-arrow-right-circle me-1"></i>{item.action}</span>
                                                <span className="history-date"><i className="bi bi-calendar-event me-1"></i>{item.date}, {item.time}</span>
                                            </div>
                                            <p className="history-message">{item.message}</p>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="replacements-content">
                                    <h4><i className="bi bi-box2-fill me-2"></i>Repuestos Solicitados</h4>
                                    <p>No se han solicitado repuestos para este ticket.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="ticket-actions-panel">
                    <div className="card-actions">
                        <h3><i className="bi bi-lightning-charge-fill me-2 text-warning"></i>Acciones Rápidas</h3>
                        <div className="status-change-select">
                            <p><i className="bi bi-arrow-repeat me-2"></i>Cambiar Estado</p>
                            <select defaultValue={mockTicket.status}>
                                <option value="abierto">Abierto</option>
                                <option value="en-proceso">En Proceso</option>
                                <option value="terminado">Terminado</option>
                                <option value="cerrado">Cerrado</option>
                            </select>
                        </div>
                        <div className="action-buttons">
                            <button className="pause-btn"><i className="bi bi-pause-circle me-1"></i>Pausar</button>
                            <button className="resume-btn"><i className="bi bi-play-circle me-1"></i>Reanudar</button>
                        </div>
                        <button className="complete-btn"><i className="bi bi-check-circle me-1"></i>Completar Ticket</button>
                    </div>

                    <div className="card-add-comment">
                        <h3><i className="bi bi-chat-dots-fill me-2"></i>Agregar Comentario</h3>
                        <textarea
                            placeholder="Escribir nueva actualización..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <button className="add-comment-btn" onClick={handleAddComment}>
                            <i className="bi bi-plus-circle me-1"></i> Agregar Comentario
                        </button>
                    </div>

                    <div className="card-contact-info">
                        <h3><i className="bi bi-person-lines-fill me-2"></i>Información de Contacto</h3>
                        <p><strong>Usuario:</strong> {mockTicket.user}</p>
                        <p><strong>Ubicación:</strong> {mockTicket.location}</p>
                        <button className="contact-btn"><i className="bi bi-envelope me-1"></i>Contactar Usuario</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleTicketPage;
