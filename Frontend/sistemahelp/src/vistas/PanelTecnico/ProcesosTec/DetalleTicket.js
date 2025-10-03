import React, { useState } from 'react';
import './detalle.css';

// Iconos
import historiaIcon from '../../../Iconos/historia.png';
import repuestosIcon from '../../../Iconos/repuestos.png';
import usuarioIcon from '../../../Iconos/usuario.png';
import equipoIcon from '../../../Iconos/equipo.png';
import ubicacionIcon from '../../../Iconos/ubicacion.png';
import cambiarIcon from '../../../Iconos/cambiar.png'; 
import terminarIcon from '../../../Iconos/terminar.png'; 

/**
 * Props esperadas:
 * - ticket: {
 *     id, titulo, estado, prioridad, fechaCreacion,
 *     descripcion, usuarioNombre, ubicacion, equipo,
 *     correo, usuarioId,
 *     historial: [{fecha, autor, mensaje}],  // opcional
 *     repuestos: [{codigo, nombre, cantidad}] // opcional
 *   }
 * - setActiveModule?: (id) => void  // para botón "Volver"
 */
const DetalleTicketPage = ({ ticket, setActiveModule }) => {
  const [activeTab, setActiveTab] = useState('historial');

  // Fallback para evitar crash si no llega nada
  const t = ticket || {};

  const titulo          = t.titulo || 'Título del Ticket';
  const ticketId        = t.id ? `Ticket #${t.id}` : 'Ticket #000';
  const estado          = t.estado || 'Estado';
  const prioridad       = t.prioridad || 'Prioridad';
  const fechaCreacion   = t.fechaCreacion || '--/--/----';

  const descripcion     = t.descripcion || 'Descripción del problema';
  const usuarioNombre   = t.usuarioNombre || t.usuario || 'Nombre del Usuario';
  const ubicacion       = t.ubicacion || 'Ubicación';
  const equipo          = t.equipo || 'Equipo';

  const historial       = Array.isArray(t.historial) ? t.historial : [];
  const repuestos       = Array.isArray(t.repuestos) ? t.repuestos : [];

  return (
    <div className="detalle-ticket-container">
      {/* Botón volver (opcional) */}
      {typeof setActiveModule === 'function' && (
        <div style={{ marginBottom: 12 }}>
          <button className="btn-action" onClick={() => setActiveModule('tickets')}>
            ← Volver a Tickets
          </button>
        </div>
      )}

      {/* Header del Ticket */}
      <div className="ticket-header-panel">
        <div className="ticket-info">
          <h2>{titulo}</h2>
          <span className="ticket-id">{ticketId}</span>
        </div>
        <div className="ticket-badges">
          <span className="badge">{estado}</span>
          <span className="badge">{prioridad}</span>
          <span className="badge-fecha">Creado: {fechaCreacion}</span>
        </div>
      </div>
      
      <div className="main-content-wrapper">
        {/* Contenido principal (Descripción, Historial, Repuestos) */}
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
                <img src={ubicacionIcon} alt="Ubicación" className="detail-icon" />
                <span>{ubicacion}</span>
              </div>
              <div className="detail-item">
                <img src={equipoIcon} alt="Equipo" className="detail-icon" />
                <span>{equipo}</span>
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
                  {historial.length === 0 ? (
                    <li className="timeline-empty">Sin eventos registrados.</li>
                  ) : (
                    historial.map((h, idx) => (
                      <li key={idx} className="timeline-item">
                        <div className="timeline-date">{h.fecha || '--/--/----'}</div>
                        <div className="timeline-content">
                          <div className="timeline-author">{h.autor || 'Sistema'}</div>
                          <div className="timeline-message">{h.mensaje || ''}</div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}

              {activeTab === 'repuestos' && (
                <ul className="repuestos-list">
                  {repuestos.length === 0 ? (
                    <li className="repuesto-empty">Sin repuestos registrados.</li>
                  ) : (
                    repuestos.map((r, idx) => (
                      <li key={idx} className="repuesto-item">
                        <span className="rep-codigo">{r.codigo || '—'}</span>
                        <span className="rep-nombre">{r.nombre || 'Repuesto'}</span>
                        <span className="rep-cantidad">x{r.cantidad ?? 1}</span>
                      </li>
                    ))
                  )}
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
                <button
                  className="action-button"
                  data-tooltip="Cambiar Estado"
                  onClick={() => console.log('Cambiar estado (stub)')}
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
              </div>
            </div>
          </div>

          <div className="panel">
            <h3>Agregar Comentario</h3>
            <textarea rows="4" placeholder="Escribe aquí tu actualización..."></textarea>
            <button className="btn-action primary" onClick={() => console.log('Agregar comentario (stub)')}>
              Agregar Comentario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleTicketPage;
