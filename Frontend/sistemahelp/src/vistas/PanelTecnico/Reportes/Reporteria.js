import React, { useState } from 'react';


import ReporteTicketsAsignados from './TicketsAsignados';
import ReporteTicketsResueltos from './TicketsResueltos';
import ReporteTiempoResolucion from './TiempoResolucion';
import ReporteTicketsPorCategoria from './TicketsPorCategoria';
import ReporteTicketsPendientes from './TicketsPendientes';
import ReporteTicketsPorPrioridad from './TicketsPorPrioridad';
import ReporteSatisfaccion from './Satisfaccion';
import ReporteTicketsSLA from './TicketsSLA';
import ReporteActividadDiaria from './ActividadDiaria';
import '../../../estilos/reporteria.css';

// Array de configuración para las tarjetas de reporte con iconos de Bootstrap
const reportCards = [
    {
        id: 'ticketsAsignados',
        title: 'Tickets Asignados',
        icon: 'bi-clipboard-check'
    },
    {
        id: 'ticketsResueltos',
        title: 'Tickets Resueltos',
        icon: 'bi-check-circle'
    },
    {
        id: 'tiempoResolucion',
        title: 'Tiempo de Resolución',
        icon: 'bi-stopwatch'
    },
    {
        id: 'ticketsPorCategoria',
        title: 'Por Categoría',
        icon: 'bi-tags'
    },
    {
        id: 'ticketsPendientes',
        title: 'Tickets Pendientes',
        icon: 'bi-clock-history'
    },
    {
        id: 'ticketsPorPrioridad',
        title: 'Por Prioridad',
        icon: 'bi-exclamation-triangle'
    },
    {
        id: 'satisfaccion',
        title: 'Satisfacción',
        icon: 'bi-emoji-smile'
    },
    {
        id: 'ticketsSLA',
        title: 'Tickets SLA',
        icon: 'bi-alarm'
    },
    {
        id: 'actividadDiaria',
        title: 'Actividad Diaria',
        icon: 'bi-calendar-date'
    },
];

function Reporteria() {
    const [reporteActual, setReporteActual] = useState(null);
    const idDelTecnico = '123';
    const fechaActual = '2025-08-29';
    const fechaInicio = '2025-08-01';
    const fechaFin = '2025-08-31';

    const renderReporte = () => {
        switch (reporteActual) {
            case 'ticketsAsignados':
                return <ReporteTicketsAsignados tecnicoId={idDelTecnico} />;
            case 'ticketsResueltos':
                return <ReporteTicketsResueltos tecnicoId={idDelTecnico} fechaInicio={fechaInicio} fechaFin={fechaFin} />;
            case 'tiempoResolucion':
                return <ReporteTiempoResolucion tecnicoId={idDelTecnico} />;
            case 'ticketsPorCategoria':
                return <ReporteTicketsPorCategoria tecnicoId={idDelTecnico} />;
            case 'ticketsPendientes':
                return <ReporteTicketsPendientes tecnicoId={idDelTecnico} />;
            case 'ticketsPorPrioridad':
                return <ReporteTicketsPorPrioridad tecnicoId={idDelTecnico} />;
            case 'satisfaccion':
                return <ReporteSatisfaccion tecnicoId={idDelTecnico} />;
            case 'ticketsSLA':
                return <ReporteTicketsSLA tecnicoId={idDelTecnico} />;
            case 'actividadDiaria':
                return <ReporteActividadDiaria tecnicoId={idDelTecnico} fecha={fechaActual} />;
            default:
                // Muestra la cuadrícula de tarjetas con el nuevo diseño simplificado
                return (
                    <div className="report-cards-container">
                        {reportCards.map(card => (
                            <div
                                key={card.id}
                                className="report-card"
                                onClick={() => setReporteActual(card.id)}
                            >
                                <i className={`bi ${card.icon} card-icon`}></i>
                                <h3 className="card-title">{card.title}</h3>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="reporteria-container">
            {reporteActual && (
                <button
                    className="back-button"
                    onClick={() => setReporteActual(null)}
                >
                    ← Volver a Reportes
                </button>
            )}
            <div className="reporteria-content">
                {renderReporte()}
            </div>
        </div>
    );
}

export default Reporteria;
