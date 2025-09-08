import React, { useState } from 'react';

const mockTicketsSLA = [
    { id: 'T-008', title: 'Fallo de servidor', technician: 'María Soto', slaStatus: 'superado-24h' },
    { id: 'T-015', title: 'Problema de conectividad', technician: 'Luis Gómez', slaStatus: 'superado-12h' },
    { id: 'T-019', title: 'Error de base de datos', technician: 'María Soto', slaStatus: 'superado-24h' },
    { id: 'T-022', title: 'Fallo de red Wi-Fi', technician: 'Ana López', slaStatus: 'superado-12h' },
];

function ReporteTicketsSLA() {
    const [filterStatus, setFilterStatus] = useState('todos');

    const filteredTickets = mockTicketsSLA.filter(ticket =>
        filterStatus === 'todos' || ticket.slaStatus === filterStatus
    );

    return (
        <div style={styles.container}>
            <h2>Tickets que Superan el SLA</h2>
            <p style={styles.subtitle}>Tickets que han excedido el tiempo de resolución acordado.</p>

            <div style={styles.filterSection}>
                <label>Filtrar por estado: </label>
                <select style={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="superado-12h">Superado por +12h</option>
                    <option value="superado-24h">Superado por +24h</option>
                </select>
            </div>
            
            <p><strong>Total de tickets con SLA superado:</strong> {filteredTickets.length}</p>

            <div style={styles.list}>
                {filteredTickets.length > 0 ? (
                    filteredTickets.map(ticket => (
                        <div key={ticket.id} style={{ ...styles.card, ...styles.cardSLA }}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardId}>#{ticket.id}</span>
                                <span style={styles.slaStatusTag}>{ticket.slaStatus}</span>
                            </div>
                            <h3 style={styles.cardTitle}>{ticket.title}</h3>
                            <p style={styles.cardInfo}>Técnico asignado: <strong>{ticket.technician}</strong></p>
                        </div>
                    ))
                ) : (
                    <p style={styles.noData}>¡Excelente! No hay tickets superando el SLA con ese estado.</p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    subtitle: { fontSize: '0.9em', color: '#777', marginBottom: '20px' },
    filterSection: { marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    filterSelect: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    card: { backgroundColor: '#fff0f0', border: '1px solid #f5c6cb', borderRadius: '8px', padding: '15px' },
    cardSLA: { borderLeft: '5px solid #dc3545' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    cardId: { fontWeight: 'bold', color: '#495057' },
    slaStatusTag: { fontSize: '0.8em', padding: '3px 8px', borderRadius: '12px', color: 'white', textTransform: 'uppercase', backgroundColor: '#dc3545' },
    cardTitle: { fontSize: '1.2em', margin: '0' },
    cardInfo: { fontSize: '0.9em', color: '#6c757d' },
    noData: { textAlign: 'center', color: '#adb5bd', fontStyle: 'italic', marginTop: '50px' },
};

export default ReporteTicketsSLA;