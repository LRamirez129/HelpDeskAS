import React, { useState } from 'react';

const mockData = [
    { id: 'T-001', technicianId: 'tech-001', user: 'Carlos Méndez', resolutionTimeMinutes: 120 },
    { id: 'T-002', technicianId: 'tech-001', user: 'Juan Pérez', resolutionTimeMinutes: 180 },
    { id: 'T-003', technicianId: 'tech-002', user: 'Ana Torres', resolutionTimeMinutes: 90 },
    { id: 'T-004', technicianId: 'tech-002', user: 'Sofía Castro', resolutionTimeMinutes: 240 },
    { id: 'T-005', technicianId: 'tech-003', user: 'Pedro Vargas', resolutionTimeMinutes: 60 },
];

const technicians = ['tech-001', 'tech-002', 'tech-003'];

function ReporteTiempoResolucion() {
    const [selectedTechnician, setSelectedTechnician] = useState('');
    const [timeFilter, setTimeFilter] = useState('');

    const filteredData = mockData.filter(d => 
        (selectedTechnician === '' || d.technicianId === selectedTechnician) &&
        (timeFilter === '' || d.resolutionTimeMinutes.toString().includes(timeFilter))
    );

    const totalTickets = filteredData.length;
    const totalTime = filteredData.reduce((sum, d) => sum + d.resolutionTimeMinutes, 0);
    const averageTime = totalTickets > 0 ? (totalTime / totalTickets).toFixed(2) : 0;
    const averageHours = (averageTime / 60).toFixed(2);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}><i className="bi bi-clock-fill me-2"></i>Tiempo de Resolución</h2>
            <p style={styles.subtitle}>Análisis del tiempo de respuesta del técnico.</p>
            
            <div style={styles.filterSection}>
                <div style={styles.filterGroup}>
                    <label style={styles.filterLabel}><i className="bi bi-person-fill me-1"></i>Técnico:</label>
                    <select style={styles.filterSelect} value={selectedTechnician} onChange={(e) => setSelectedTechnician(e.target.value)}>
                        <option value="">Todos</option>
                        {technicians.map(tech => <option key={tech} value={tech}>{tech}</option>)}
                    </select>
                </div>
                <div style={styles.inputGroup}>
                    <i className="bi bi-search" style={styles.searchIcon}></i>
                    <input
                        type="text"
                        style={styles.filterInput}
                        placeholder="Filtrar por tiempo (minutos)..."
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                    />
                </div>
            </div>

            <p style={styles.totalText}>
                <strong><i className="bi bi-graph-up me-2"></i>Tiempo promedio:</strong> {averageHours} hrs ({averageTime} min)
            </p>

            <div style={styles.list}>
                {filteredData.length > 0 ? (
                    filteredData.map(ticket => (
                        <div key={ticket.id} style={{ ...styles.card, ...styles.cardResueltos }}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardId}><i className="bi bi-hash me-1"></i>#{ticket.id}</span>
                                <span style={styles.statusTag}>
                                    <i className="bi bi-person-fill me-1"></i>{ticket.technicianId}
                                </span>
                            </div>
                            <h3 style={styles.cardTitle}>
                                <i className="bi bi-user-fill me-2"></i>Usuario: {ticket.user}
                            </h3>
                            <p style={styles.cardInfo}>
                                <i className="bi bi-stopwatch-fill me-2"></i>Tiempo de Resolución: <strong>{ticket.resolutionTimeMinutes} min</strong>
                            </p>
                        </div>
                    ))
                ) : (
                    <p style={styles.noData}>
                        <i className="bi bi-exclamation-circle me-2"></i>
                        No se encontraron datos para los filtros seleccionados.
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
    filterSection: { marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' },
    filterGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
    filterLabel: { color: '#495057', display: 'flex', alignItems: 'center', gap: '5px' },
    filterSelect: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' },
    inputGroup: { position: 'relative', display: 'flex', alignItems: 'center', flexGrow: 1 },
    searchIcon: { position: 'absolute', left: '10px', color: '#888' },
    filterInput: { padding: '8px 8px 8px 35px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', outline: 'none' },
    totalText: { fontSize: '1.1em', color: '#333', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    card: { backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    cardResueltos: { borderLeft: '5px solid #007bff' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    cardId: { fontWeight: 'bold', color: '#495057', display: 'flex', alignItems: 'center', gap: '5px' },
    statusTag: { 
        fontSize: '0.8em', 
        padding: '3px 8px', 
        borderRadius: '12px', 
        color: 'white', 
        textTransform: 'uppercase', 
        backgroundColor: '#007bff',
        display: 'flex', 
        alignItems: 'center',
        gap: '5px'
    },
    cardTitle: { fontSize: '1.2em', margin: '0', display: 'flex', alignItems: 'center', gap: '10px' },
    cardInfo: { fontSize: '0.9em', color: '#6c757d', display: 'flex', alignItems: 'center', gap: '10px' },
    noData: { textAlign: 'center', color: '#adb5bd', fontStyle: 'italic', marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
};

export default ReporteTiempoResolucion;