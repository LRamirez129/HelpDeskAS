import React, { useState } from 'react';
import './historial.css';

const mockTickets = [
    {
        id: 1,
        title: 'Configuración de correo electrónico',
        description: 'Nuevo empleado necesita configuración de correo corporativo.',
        status: 'terminado',
        category: 'software',
        assignedTo: 'Ana Silva',
        date: '20/1/2025',
        time: '11:30'
    },
    {
        id: 2,
        title: 'Instalación de software especializado',
        description: 'Instalar AutoCAD en 5 equipos del departamento de diseño',
        status: 'abierto',
        category: 'software',
        assignedTo: 'Roberto Díaz',
        date: '20/1/2025',
        time: '11:00'
    },
    {
        id: 3,
        title: 'Fallo en la red de la oficina',
        description: 'Intermitencia en la conexión a internet en el departamento de contabilidad.',
        status: 'en-proceso',
        category: 'hardware',
        assignedTo: 'Luis Mendoza',
        date: '19/1/2025',
        time: '10:00'
    },
    {
        id: 4,
        title: 'Reparación de impresora',
        description: 'La impresora no enciende y no da señal de vida.',
        status: 'cerrado',
        category: 'hardware',
        assignedTo: 'Juan Perez',
        date: '18/1/2025',
        time: '15:00'
    },
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
        <div className="tickets-module">
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
                <div className="date-filter">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Fecha de actualiza...</span>
                    <i className="fas fa-chevron-down"></i>
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
                    <p className="no-tickets">No hay tickets para mostrar con este filtro.</p>
                )}
            </div>
        </div>
    );
};

export default TicketsModule;