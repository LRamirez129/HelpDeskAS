import React, { useState } from 'react';


function ReporteTicketsPorCategoria() {
    const [timeframe, setTimeframe] = useState('mensual');
    
    // Datos de ejemplo que cambiarían según el filtro de tiempo
    const mockData = {
        mensual: [
            { name: 'Hardware', value: 40, icon: 'cpu-fill' }, 
            { name: 'Software', value: 30, icon: 'file-earmark-code-fill' },
            { name: 'Redes', value: 15, icon: 'ethernet' }, 
            { name: 'Soporte General', value: 15, icon: 'person-workspace' }
        ],
        trimestral: [
            { name: 'Hardware', value: 35, icon: 'cpu-fill' }, 
            { name: 'Software', value: 40, icon: 'file-earmark-code-fill' },
            { name: 'Redes', value: 10, icon: 'ethernet' }, 
            { name: 'Soporte General', value: 15, icon: 'person-workspace' }
        ],
        anual: [
            { name: 'Hardware', value: 45, icon: 'cpu-fill' }, 
            { name: 'Software', value: 25, icon: 'file-earmark-code-fill' },
            { name: 'Redes', value: 20, icon: 'ethernet' }, 
            { name: 'Soporte General', value: 10, icon: 'person-workspace' }
        ]
    };

    const currentData = mockData[timeframe];

    return (
        <div style={styles.container}>
            <h2 style={styles.title}><i className="bi bi-tag-fill me-2"></i>Tickets por Categoría</h2>
            <p style={styles.subtitle}>Distribución de tickets por área de problema.</p>

            <div style={styles.filterSection}>
                <label style={styles.filterLabel}><i className="bi bi-calendar-range-fill me-1"></i>Período:</label>
                <select style={styles.filterSelect} value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                </select>
            </div>
            
            <p style={styles.totalText}>
                <strong><i className="bi bi-graph-up me-2"></i>Reporte del período:</strong> {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </p>

            <div style={styles.list}>
                {currentData.length > 0 ? (
                    currentData.map(cat => (
                        <div key={cat.name} style={{ ...styles.card, ...styles.cardCategory }}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardId}>
                                    <i className={`bi bi-${cat.icon} me-1`}></i>
                                    {cat.name}
                                </span>
                                <span style={styles.itemValue}>{cat.value}%</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={styles.noData}>
                        <i className="bi bi-exclamation-circle me-2"></i>
                        No hay datos disponibles para este período.
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
    filterSelect: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' },
    totalText: { fontSize: '1.1em', color: '#333', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    card: { backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    cardCategory: { borderLeft: '5px solid #007bff' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    cardId: { fontWeight: 'bold', color: '#495057', display: 'flex', alignItems: 'center', gap: '5px' },
    itemValue: { fontSize: '1.1em', fontWeight: 'bold', color: '#007bff' },
    noData: { textAlign: 'center', color: '#adb5bd', fontStyle: 'italic', marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
};

export default ReporteTicketsPorCategoria;