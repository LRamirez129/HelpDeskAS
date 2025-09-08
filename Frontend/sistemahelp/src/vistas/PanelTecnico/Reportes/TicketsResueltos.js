import React, { useState } from 'react';


const mockTicketsResueltos = [
    { id: 'T-001', title: 'Configuración de software', resolutionDate: '2025-08-05' },
    { id: 'T-003', title: 'Fallo de disco duro', resolutionDate: '2025-08-10' },
    { id: 'T-006', title: 'Mantenimiento de red', resolutionDate: '2025-08-15' },
    { id: 'T-010', title: 'Problema de licencia', resolutionDate: '2025-08-20' },
    { id: 'T-013', title: 'Actualización de sistema', resolutionDate: '2025-09-01' },
];

function ReporteTicketsResueltos() {
    const [startDate, setStartDate] = useState('2025-08-01');
    const [endDate, setEndDate] = useState('2025-08-31');

    const filteredTickets = mockTicketsResueltos.filter(ticket =>
        ticket.resolutionDate >= startDate && ticket.resolutionDate <= endDate
    );

    return (
        <div style={styles.container}>
            <h2 style={styles.title}><i className="bi bi-check-circle-fill me-2"></i>Tickets Resueltos</h2>
            <p style={styles.subtitle}>Reporte de tickets completados en un período específico.</p>

            <div style={styles.filterSection}>
                <label style={styles.filterLabel}><i className="bi bi-calendar-date me-1"></i>Desde: </label>
                <input
                    type="date"
                    style={styles.filterInput}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label style={styles.filterLabel}><i className="bi bi-calendar-date me-1"></i>Hasta: </label>
                <input
                    type="date"
                    style={styles.filterInput}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <p style={styles.totalText}>
                <strong><i className="bi bi-graph-up me-2"></i>Total de tickets resueltos:</strong> {filteredTickets.length}
            </p>

            <div style={styles.list}>
                {filteredTickets.length > 0 ? (
                    filteredTickets.map(ticket => (
                        <div key={ticket.id} style={{ ...styles.card, ...styles.cardResueltos }}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardId}><i className="bi bi-hash me-1"></i>#{ticket.id}</span>
                                <span style={styles.statusTag}>
                                    <i className="bi bi-check-lg me-1"></i>Resuelto
                                </span>
                            </div>
                            <h3 style={styles.cardTitle}>
                                <i className="bi bi-file-earmark-text-fill me-2"></i>{ticket.title}
                            </h3>
                            <p style={styles.cardInfo}>
                                <i className="bi bi-calendar-check-fill me-2"></i>Fecha de resolución: 
                                <strong style={styles.dateText}>{ticket.resolutionDate}</strong>
                            </p>
                        </div>
                    ))
                ) : (
                    <p style={styles.noData}>
                        <i className="bi bi-exclamation-circle me-2"></i>
                        No se encontraron tickets en el período seleccionado.
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
    filterSection: { marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    filterLabel: { color: '#495057', display: 'flex', alignItems: 'center', gap: '5px' },
    filterInput: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' },
    totalText: { fontSize: '1.1em', color: '#333', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    card: { backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    cardResueltos: { borderLeft: '5px solid #007bff' }, // Borde azul para coincidir
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    cardId: { fontWeight: 'bold', color: '#495057', display: 'flex', alignItems: 'center', gap: '5px' },
    statusTag: { 
        fontSize: '0.8em', 
        padding: '3px 8px', 
        borderRadius: '12px', 
        color: 'white', 
        textTransform: 'uppercase', 
        backgroundColor: '#007bff', // Color azul para coincidir
        display: 'flex', 
        alignItems: 'center',
        gap: '5px'
    },
    cardTitle: { fontSize: '1.2em', margin: '0', display: 'flex', alignItems: 'center', gap: '10px' },
    cardInfo: { fontSize: '0.9em', color: '#6c757d', display: 'flex', alignItems: 'center', gap: '10px' },
    dateText: { fontWeight: 'bold' },
    noData: { textAlign: 'center', color: '#adb5bd', fontStyle: 'italic', marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
};

export default ReporteTicketsResueltos;