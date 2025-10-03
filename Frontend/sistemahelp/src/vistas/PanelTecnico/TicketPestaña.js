import React from 'react';
import './TicketPestaña.css';
import abrirIcono from '../../Iconos/abrir.png';
import slaIcono from '../../Iconos/sla.png';

const TicketPestana = ({
  setActiveModule,
  filtro,
  titulo = 'Tickets Asignados',
  mostrarSLA = true,     // ← controla visibilidad del botón SLA
  onAbrirTicket,
}) => {
  // Datos de ejemplo (puedes reemplazar por datos reales cuando conecten backend)
  const ticketsDeEjemplo = [
    { id: 'T001', titulo: 'Problema con la impresora', prioridad: 'Alta',    estado: 'Abierto',      sla: '2h restantes',    usuarioId: 'u1', correo: 'ana@empresa.com' },
    { id: 'T002', titulo: 'Solicitud de software',      prioridad: 'Baja',    estado: 'Asignado',     sla: '12h restantes',   usuarioId: 'u2', correo: 'luis@empresa.com' },
    { id: 'T003', titulo: 'Fallo en la conexión de red',prioridad: 'Crítica', estado: 'En progreso',  sla: '30min restantes', usuarioId: 'u1', correo: 'ana@empresa.com' },
  ];

  // Aplica filtro si viene por props; si no, usa todos (comportamiento original)
  const baseTickets = Array.isArray(ticketsDeEjemplo)
    ? (typeof filtro === 'function' ? ticketsDeEjemplo.filter(filtro) : ticketsDeEjemplo)
    : [];

  const handleAbrirTicket = (ticketId) => {
    if (typeof onAbrirTicket === 'function') {
      onAbrirTicket(ticketId);
    } else if (setActiveModule) {
      setActiveModule('detalleTicket');
    }
  };

  const handleSla = (ticketId) => {
    if (setActiveModule) setActiveModule('slaPage');
  };

  const estadoClass = (estado) =>
    `ticket-estado estado-${String(estado).replace(/\s+/g, '-').toLowerCase()}`;

  const prioridadClass = (prioridad) =>
    `prioridad-${String(prioridad).toLowerCase()}`;

  return (
    <div className="ticket-list-container">
      <header className="ticket-list-header">
        <h2>{titulo || 'Tickets Asignados'}</h2>
      </header>

      <div className="ticket-cards-grid">
        {baseTickets.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-card-header">
              <span className="ticket-id">{ticket.id}</span>
              <span className={estadoClass(ticket.estado)}>{ticket.estado}</span>
            </div>

            <div className="ticket-card-body">
              <h3 className="ticket-titulo">{ticket.titulo}</h3>
              <div className="ticket-details">
                <p>
                  <strong>Prioridad:</strong>{' '}
                  <span className={prioridadClass(ticket.prioridad)}>{ticket.prioridad}</span>
                </p>
                <p><strong>SLA:</strong> {ticket.sla}</p>
              </div>
            </div>

            <div className="ticket-card-actions">
              <button
                className="action-button abrir-button"
                onClick={() => handleAbrirTicket(ticket.id)}
                data-tooltip="Detalle"
              >
                <center><img src={abrirIcono} alt="Abrir" /></center>
              </button>

              {mostrarSLA && (
                <button
                  className="action-button sla-button"
                  onClick={() => handleSla(ticket.id)}
                  data-tooltip="SLA"
                >
                  <center><img src={slaIcono} alt="SLA" /></center>
                </button>
              )}
            </div>
          </div>
        ))}

        {baseTickets.length === 0 && (
          <div className="ticket-card empty-state">
            <h3>No hay tickets para mostrar</h3>
            <p>Intenta cambiar los filtros o vuelve más tarde.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketPestana;
