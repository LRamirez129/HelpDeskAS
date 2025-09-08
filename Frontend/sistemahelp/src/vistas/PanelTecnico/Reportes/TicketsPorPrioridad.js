import React, { useState } from 'react';


const mockTicketsPendientes = [
    { id: 'T-020', title: 'Problema de acceso a email', priority: 'alta', user: 'Laura Castro' },
    { id: 'T-021', title: 'Instalación de software de diseño', priority: 'media', user: 'Pedro Soto' },
    { id: 'T-023', title: 'Pantalla de PC parpadeando', priority: 'baja', user: 'Diana Ruiz' },
    { id: 'T-028', title: 'Solicitud de nueva cuenta', priority: 'media', user: 'Carlos Pérez' },
];

function ReporteTicketsPendientes() {
    const [filterPriority, setFilterPriority] = useState('todos');

    const filteredTickets = mockTicketsPendientes.filter(ticket =>
        filterPriority === 'todos' || ticket.priority === filterPriority
    );

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'alta':
                return 'bi-arrow-up-circle-fill';
            case 'media':
                return 'bi-dash-circle-fill';
            case 'baja':
                return 'bi-arrow-down-circle-fill';
            default:
                return 'bi-list-task';
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}><i className="bi bi-exclamation-circle-fill me-2"></i>Tickets por Prioridad</h2>
            <p style={styles.subtitle}>Lista de tickets que aún no han sido resueltos.</p>

            <div style={styles.filterSection}>
                <div style={styles.filterGroup}>
                    {['todos', 'alta', 'media', 'baja'].map(priority => (
                        <button
                            key={priority}
                            style={{ ...styles.filterButton, ...(filterPriority === priority ? styles.activeButton : {}) }}
                            onClick={() => setFilterPriority(priority)}
                        >
                            <i className={`bi ${getPriorityIcon(priority)} me-1`}></i>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div style={styles.list}>
                {filteredTickets.length > 0 ? (
                    filteredTickets.map(ticket => (
                        <div key={ticket.id} style={{ ...styles.card, ...styles.cardPendientes }}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardId}>
                                    <i className="bi bi-hash me-1"></i>#{ticket.id}
                                </span>
                                <span style={{ ...styles.priorityTag, ...styles[ticket.priority] }}>
                                    <i className={`bi ${getPriorityIcon(ticket.priority)} me-1`}></i>
                                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                </span>
                            </div>
                            <h3 style={styles.cardTitle}>
                                <i className="bi bi-file-earmark-text-fill me-2"></i>{ticket.title}
                            </h3>
                            <p style={styles.cardInfo}>
                                <i className="bi bi-person-fill me-2"></i>Solicitante: <strong style={styles.userName}>{ticket.user}</strong>
                            </p>
                        </div>
                    ))
                ) : (
                    <p style={styles.noData}>
                        <i className="bi bi-exclamation-circle me-2"></i>
                        No hay tickets pendientes con esa prioridad.
                    </p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' },
    title: { fontSize: '1.8em', marginBottom: '5px', color: '#333' },
    subtitle: { fontSize: '0.9em', color: '#777', marginBottom: '20px' },
    filterSection: { marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }, // Alineado a la izquierda
    filterGroup: { display: 'flex', gap: '10px' },
    filterButton: {
        padding: '12px 18px', // Más grande
        border: '1px solid #007bff',
        borderRadius: '8px',
        backgroundColor: '#e9f5ff', // Azul claro
        cursor: 'pointer',
        fontSize: '1em', // Más grande
        color: '#007bff',
        transition: 'background-color 0.3s, color 0.3s',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    activeButton: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    card: {
        backgroundColor: 'white',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    cardPendientes: { borderLeft: '5px solid #007bff' },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    cardId: { fontWeight: 'bold', color: '#495057', display: 'flex', alignItems: 'center', gap: '5px' },
    priorityTag: {
        fontSize: '0.8em',
        padding: '3px 8px',
        borderRadius: '12px',
        color: 'white',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    alta: { backgroundColor: '#dc3545' },
    media: { backgroundColor: '#fd7e14' },
    baja: { backgroundColor: '#0dcaf0' },
    cardTitle: { fontSize: '1.2em', margin: '0', display: 'flex', alignItems: 'center', gap: '10px' },
    cardInfo: { fontSize: '0.9em', color: '#6c757d', display: 'flex', alignItems: 'center', gap: '10px' },
    userName: { fontWeight: 'bold' },
    noData: { textAlign: 'center', color: '#adb5bd', fontStyle: 'italic', marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
};

export default ReporteTicketsPendientes;