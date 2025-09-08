import React, { useState } from 'react';

const mockActividadDiaria = {
    '2025-08-29': {
        totalTicketsResueltos: 5,
        totalHorasTrabajadas: 8,
        comentariosAgregados: 12,
        ticketsResueltos: [
            { id: 'T-001', title: 'Configuración de software' },
            { id: 'T-002', title: 'Fallo de impresora' },
        ]
    },
    '2025-08-28': {
        totalTicketsResueltos: 3,
        totalHorasTrabajadas: 6,
        comentariosAgregados: 8,
        ticketsResueltos: [
            { id: 'T-005', title: 'Problema de red' },
        ]
    },
};

function ReporteActividadDiaria() {
    const [selectedDate, setSelectedDate] = useState('2025-08-29');
    const activityData = mockActividadDiaria[selectedDate] || {
        totalTicketsResueltos: 0,
        totalHorasTrabajadas: 0,
        comentariosAgregados: 0,
        ticketsResueltos: []
    };

    return (
        <div style={styles.container}>
            <h2>Actividad Diaria</h2>
            <p style={styles.subtitle}>Resumen de la actividad del técnico para una fecha específica.</p>

            <div style={styles.filterSection}>
                <label>Seleccionar Fecha: </label>
                <input
                    type="date"
                    style={styles.filterInput}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>
            
            <div style={styles.summaryGrid}>
                <div style={styles.summaryItem}>
                    <span style={styles.itemValue}>{activityData.totalTicketsResueltos}</span>
                    <span style={styles.itemLabel}>Tickets Resueltos</span>
                </div>
                <div style={styles.summaryItem}>
                    <span style={styles.itemValue}>{activityData.totalHorasTrabajadas}</span>
                    <span style={styles.itemLabel}>Horas Trabajadas</span>
                </div>
                <div style={styles.summaryItem}>
                    <span style={styles.itemValue}>{activityData.comentariosAgregados}</span>
                    <span style={styles.itemLabel}>Comentarios Agregados</span>
                </div>
            </div>

            <h3 style={styles.listTitle}>Tickets Resueltos en la fecha: {selectedDate}</h3>
            <div style={styles.list}>
                {activityData.ticketsResueltos.length > 0 ? (
                    activityData.ticketsResueltos.map(ticket => (
                        <div key={ticket.id} style={{ ...styles.card, ...styles.cardActividad }}>
                            <span style={styles.cardId}>#{ticket.id}</span>
                            <h3 style={styles.cardTitle}>{ticket.title}</h3>
                        </div>
                    ))
                ) : (
                    <p style={styles.noData}>No hay tickets resueltos en esta fecha.</p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    subtitle: { fontSize: '0.9em', color: '#777', marginBottom: '20px' },
    filterSection: { marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    filterInput: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc' },
    summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' },
    summaryItem: { backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '8px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    itemValue: { fontSize: '2.5em', fontWeight: 'bold', color: '#3498db' },
    itemLabel: { display: 'block', fontSize: '0.9em', color: '#6c757d' },
    listTitle: { marginTop: '30px' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    card: { backgroundColor: '#e9f5ff', border: '1px solid #cce5ff', borderRadius: '8px', padding: '15px' },
    cardActividad: { borderLeft: '5px solid #007bff' },
    cardId: { fontWeight: 'bold', color: '#495057' },
    cardTitle: { fontSize: '1.2em', margin: '0' },
    noData: { textAlign: 'center', color: '#adb5bd', fontStyle: 'italic', marginTop: '50px' },
};

export default ReporteActividadDiaria;