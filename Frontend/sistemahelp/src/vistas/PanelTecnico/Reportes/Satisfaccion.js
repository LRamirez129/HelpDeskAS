import React, { useState } from 'react';

const mockRatings = [
    { id: 'S-01', rating: 5, comment: 'Excelente servicio, muy rápido.', ticketId: 'T-001' },
    { id: 'S-02', rating: 4, comment: 'El problema se resolvió, pero tomó más tiempo de lo esperado.', ticketId: 'T-003' },
    { id: 'S-03', rating: 5, comment: 'El técnico fue muy amable y resolvió el problema completamente.', ticketId: 'T-006' },
    { id: 'S-04', rating: 3, comment: 'Poco comunicativo.', ticketId: 'T-010' },
    { id: 'S-05', rating: 5, comment: 'Solución impecable.', ticketId: 'T-013' },
];

function ReporteSatisfaccion() {
    const [filterRating, setFilterRating] = useState('0');

    const filteredRatings = mockRatings.filter(r =>
        filterRating === '0' || r.rating === parseInt(filterRating)
    );

    const totalSurveys = filteredRatings.length;
    const totalRatingValue = filteredRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalSurveys > 0 ? (totalRatingValue / totalSurveys).toFixed(1) : 'N/A';

    return (
        <div style={styles.container}>
            <h2>Satisfacción del Cliente</h2>
            <p style={styles.subtitle}>Análisis del feedback de los usuarios sobre el servicio.</p>

            <div style={styles.filterSection}>
                <label>Filtrar por calificación: </label>
                <select style={styles.filterSelect} value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                    <option value="0">Todas las calificaciones</option>
                    <option value="5">5 Estrellas</option>
                    <option value="4">4 Estrellas</option>
                    <option value="3">3 Estrellas</option>
                    <option value="2">2 Estrellas</option>
                    <option value="1">1 Estrella</option>
                </select>
            </div>

            <div style={styles.summarySection}>
                <div style={styles.metricCard}>
                    <span style={styles.metricValue}>{averageRating}</span>
                    <span style={styles.metricLabel}>Promedio de Estrellas</span>
                </div>
                <div style={styles.metricCard}>
                    <span style={styles.metricValue}>{totalSurveys}</span>
                    <span style={styles.metricLabel}>Encuestas Analizadas</span>
                </div>
            </div>

            <h3 style={styles.listTitle}>Comentarios</h3>
            <div style={styles.list}>
                {filteredRatings.map(rating => (
                    <div key={rating.id} style={styles.ratingCard}>
                        <div style={styles.ratingHeader}>
                            <span style={styles.cardId}>Ticket #{rating.ticketId}</span>
                            <span style={styles.stars}>{'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}</span>
                        </div>
                        <p style={styles.ratingComment}>{rating.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    subtitle: { fontSize: '0.9em', color: '#777', marginBottom: '20px' },
    filterSection: { marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    filterSelect: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc' },
    summarySection: { display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px' },
    metricCard: { textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', padding: '20px 30px' },
    metricValue: { fontSize: '3em', fontWeight: 'bold', color: '#28a745' },
    metricLabel: { fontSize: '1em', color: '#6c757d' },
    listTitle: { marginTop: '30px' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    ratingCard: { backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '8px', padding: '15px' },
    ratingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    cardId: { fontWeight: 'bold', color: '#495057' },
    stars: { color: '#ffc107', fontSize: '1.2em' },
    ratingComment: { margin: 0, fontStyle: 'italic', color: '#495057' },
};

export default ReporteSatisfaccion;