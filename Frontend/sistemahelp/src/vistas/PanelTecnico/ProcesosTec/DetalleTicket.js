import React, { useState } from 'react';
import './detalle.css';

// Importa los iconos
import historiaIcon from '../../../Iconos/historia.png';
import repuestosIcon from '../../../Iconos/repuestos.png';
import usuarioIcon from '../../../Iconos/usuario.png';
import equipoIcon from '../../../Iconos/equipo.png';
import ubicacionIcon from '../../../Iconos/ubicacion.png';
import cambiarIcon from '../../../Iconos/cambiar.png'; 
import terminarIcon from '../../../Iconos/terminar.png'; 

const DetalleTicketPage = () => {
    const [activeTab, setActiveTab] = useState('historial');
    
    return (
        <div className="detalle-ticket-container">
            {/* Header del Ticket */}
            <div className="ticket-header-panel">
                <div className="ticket-info">
                    <h2>Título del Ticket</h2>
                    <span className="ticket-id">Ticket #000</span>
                </div>
                <div className="ticket-badges">
                    <span className="badge">Estado</span>
                    <span className="badge">Prioridad</span>
                    <span className="badge-fecha">Creado: --/--/----</span>
                </div>
            </div>
            
            <div className="main-content-wrapper">
                {/* Contenido principal (Descripción, Historial, Repuestos) */}
                <div className="ticket-content">
                    {/* Panel de Descripción */}
                    <div className="panel">
                        <h3>Descripción del problema</h3>
                        <p>Descripción del problema</p>
                        <div className="problem-details">
                            <div className="detail-item">
                                <img src={usuarioIcon} alt="Usuario" className="detail-icon" />
                                <span>Nombre del Usuario</span>
                            </div>
                            <div className="detail-item">
                                <img src={ubicacionIcon} alt="Ubicación" className="detail-icon" />
                                <span>Ubicación</span>
                            </div>
                            <div className="detail-item">
                                <img src={equipoIcon} alt="Equipo" className="detail-icon" />
                                <span>Equipo</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Panel de pestañas: Historial y Repuestos */}
                    <div className="panel panel-tabs">
                        <div className="tabs-navigation">
                            <button
                                className={`tab-button ${activeTab === 'historial' ? 'active' : ''}`}
                                onClick={() => setActiveTab('historial')}
                                data-tooltip="Historial"
                            >
                                <img src={historiaIcon} alt="Historial" className="tab-icon" />
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'repuestos' ? 'active' : ''}`}
                                onClick={() => setActiveTab('repuestos')}
                                data-tooltip="Repuestos"
                            >
                                <img src={repuestosIcon} alt="Repuestos" className="tab-icon" />
                            </button>
                        </div>
                        
                        <div className="tab-content">
                            {activeTab === 'historial' && (
                                <ul className="timeline">
                                </ul>
                            )}
                            {activeTab === 'repuestos' && (
                                <ul className="repuestos-list">
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar de Acciones */}
                <div className="sidebar-actions">
                    <div className="panel">
                        <h3>Acciones Rápidas</h3>
                        <div className="action-group status-actions">
                            <label>Cambiar Estado</label>
                            <select className="status-select">
                                <option>-- Seleccionar --</option>
                                <option>En Proceso</option>
                                <option>Cerrado</option>
                            </select>
                            <div className="action-icons-container">
                                <img 
                                    src={cambiarIcon} 
                                    alt="Cambiar" 
                                    className="action-icon" 
                                    data-tooltip="Cambiar Estado" 
                                    // onClick={() => handleCambiarEstado()}
                                />
                                <img 
                                    src={terminarIcon} 
                                    alt="Completar" 
                                    className="action-icon" 
                                    data-tooltip="Terminar Ticket" 
                                    // onClick={() => handleCompletarTicket()}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <h3>Agregar Comentario</h3>
                        <textarea rows="4" placeholder="Escribe aquí tu actualización..."></textarea>
                        <button className="btn-action primary">Agregar Comentario</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleTicketPage;