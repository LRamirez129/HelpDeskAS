import React, { useState } from 'react';
import './historial.css';
// import emptyStateIcon from './assets/empty-state.png'; // Asegúrate de tener un icono aquí

const mockTickets = [
    // La lista de tickets está vacía para mostrar el estado
];

const TicketsModule = () => {
    const [selectedFilter, setSelectedFilter] = useState('Todos');

    const getTicketsByStatus = (status) => {
        if (status === 'Todos') {
            return mockTickets;
        }
        return mockTickets.filter(ticket => {
            if (status === 'Terminados') return ticket.status === 'terminado';
            if (status === 'Cerrados') return ticket.status === 'cerrado';
            if (status === 'Abiertos') return ticket.status === 'abierto';
            if (status === 'En Proceso') return ticket.status === 'en-proceso';
            return false;
        });
    };

    const getFilterCount = (filter) => {
        if (filter === 'Todos') {
            return mockTickets.length;
        }
        return getTicketsByStatus(filter).length;
    };

    const ticketsToDisplay = getTicketsByStatus(selectedFilter);

    const getTagClass = (tagType) => {
        switch (tagType) {
            case 'terminado': return 'status-tag terminado';
            case 'abierto': return 'status-tag abierto';
            case 'en-proceso': return 'status-tag en-proceso';
            case 'cerrado': return 'status-tag cerrado';
            case 'software': return 'type-tag software';
            case 'hardware': return 'type-tag hardware';
            default: return '';
        }
    };

    return (
        <div className="historial-container">
            <header className="tickets-header">
                <div className="header-info">
                    <h1>Historial de Tickets</h1>
                    <p>Gestiona y revisa todos los tickets del sistema organizados por estado</p>
                </div>
            </header>

            <div className="search-and-filter-section">
                <div className="search-bar">
                    <i className="fas fa-search search-icon"></i>
                    <input type="text" placeholder="Buscar por título, usuario o categoría..." />
                </div>
            </div>

            <div className="filter-buttons">
                {['Todos', 'Abiertos', 'En Proceso', 'Terminados', 'Cerrados'].map(filter => (
                    <button 
                        key={filter} 
                        className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
                        onClick={() => setSelectedFilter(filter)}
                    >
                        {filter} ({getFilterCount(filter)})
                    </button>
                ))}
            </div>

            <div className="ticket-list-info">
                <span>Mostrando {ticketsToDisplay.length} ticket(s)</span>
                <span className="sort-by">Ordenado por fecha</span>
            </div>

            <div className="ticket-list-container">
                {ticketsToDisplay.length > 0 ? (
                    ticketsToDisplay.map(ticket => (
                        <div key={ticket.id} className="ticket-item">
                            <div className="ticket-item-header">
                                <h4 className="ticket-title">{ticket.title}</h4>
                                <div className="ticket-item-tags">
                                    <span className="media-tag">media</span>
                                    <span className={getTagClass(ticket.status)}>{ticket.status}</span>
                                    <span className={getTagClass(ticket.category)}>{ticket.category}</span>
                                </div>
                            </div>
                            <p className="ticket-description">{ticket.description}</p>
                            <div className="ticket-info">
                                <p><i className="fas fa-user-circle"></i> Asignado a: {ticket.assignedTo}</p>
                                <p><i className="fas fa-calendar-alt"></i> Fecha: {ticket.date}, {ticket.time}</p>
                            </div>
                            <button className="view-detail-btn">
                                <i className="fas fa-eye"></i> Ver Detalle
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="empty-state-panel">
                        {/* <img src={emptyStateIcon} alt="Sin tickets" className="empty-state-icon" /> */}
                        <h3>No hay tickets en tu historial</h3>
                        <p>Cuando finalices tickets, aparecerán aquí.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketsModule;