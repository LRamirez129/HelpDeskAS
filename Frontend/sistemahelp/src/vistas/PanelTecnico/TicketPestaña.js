import React from 'react';
import './TicketPestaña.css';
import abrirIcono from '../../Iconos/abrir.png';
import slaIcono from '../../Iconos/sla.png';

const TicketPestana = ({ setActiveModule }) => {
    // Datos de ejemplo para la lista de tickets
    const ticketsDeEjemplo = [
        { id: 'T001', titulo: 'Problema con la impresora', prioridad: 'Alta', estado: 'Abierto', sla: '2h restantes' },
        { id: 'T002', titulo: 'Solicitud de software', prioridad: 'Baja', estado: 'Asignado', sla: '12h restantes' },
        { id: 'T003', titulo: 'Fallo en la conexión de red', prioridad: 'Crítica', estado: 'En progreso', sla: '30min restantes' },
    ];

    const handleAbrirTicket = (ticketId) => {
        console.log(`Abriendo ticket: ${ticketId}`);
        setActiveModule('detalleTicket');
    };

    const handleSla = (ticketId) => {
        console.log(`Solicitando más tiempo para SLA del ticket: ${ticketId}`);
        setActiveModule('slaPage');
    };

    return (
        <div className="ticket-list-container">
            <header className="ticket-list-header">
                <h2>Tickets Asignados</h2>
            </header>
            <div className="ticket-cards-grid">
                {ticketsDeEjemplo.map(ticket => (
                    <div key={ticket.id} className="ticket-card">
                        <div className="ticket-card-header">
                            <span className="ticket-id">{ticket.id}</span>
                            <span className={`ticket-estado estado-${ticket.estado.replace(' ', '-').toLowerCase()}`}>{ticket.estado}</span>
                        </div>
                        <div className="ticket-card-body">
                            <h3 className="ticket-titulo">{ticket.titulo}</h3>
                            <div className="ticket-details">
                                <p><strong>Prioridad:</strong> <span className={`prioridad-${ticket.prioridad.toLowerCase()}`}>{ticket.prioridad}</span></p>
                                <p><strong>SLA:</strong> {ticket.sla}</p>
                            </div>
                        </div>
                        <div className="ticket-card-actions">
                            <button className="action-button abrir-button" onClick={() => handleAbrirTicket(ticket.id)} data-tooltip="Detalle">
                                <center><img src={abrirIcono} alt="Abrir" /></center>
                            </button>
                            <button className="action-button sla-button" onClick={() => handleSla(ticket.id)} data-tooltip="SLA">
                                <center><img src={slaIcono} alt="SLA" /></center>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketPestana;