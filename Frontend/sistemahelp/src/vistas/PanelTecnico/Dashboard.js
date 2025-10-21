import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { FaBell, FaTicketAlt, FaFolderOpen, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

// URL de tu API para obtener todos los tickets
const API_URL = 'http://localhost:3001/api/tickets'; // ¡AJUSTA ESTA URL!

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  // 1. ESTADOS PARA DATOS DINÁMICOS
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total: 0,
    abiertos: 0,
    enProceso: 0,
    cerrados: 0,
    atrasados: 0, // Añadimos una métrica para SLA
  });

  // Ejemplo de notificaciones (pueden seguir siendo estáticas por ahora)
  const notifications = [
    { id: 1, message: "Nuevo ticket asignado", status: "info" },
    { id: 2, message: "Ticket en proceso retrasado", status: "alerta" },
    { id: 3, message: "Ticket cerrado correctamente", status: "success" },
  ];
  
  // ----------------------------------------------------
  // FUNCIÓN PARA OBTENER Y PROCESAR DATOS
  // ----------------------------------------------------
  const cargarTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Fallo la carga de tickets desde el servidor.');
      }
      const data = await response.json();
      
      setTickets(data);
      
      // Procesar métricas
      const calculatedMetrics = data.reduce((acc, ticket) => {
        acc.total += 1;
        
        // Asume que los estados de la DB son 'NUEVO', 'EN PROCESO', 'RESUELTO', 'CERRADO'
        if (ticket.TIC_ESTADO === 'NUEVO') {
            acc.abiertos += 1;
        } else if (ticket.TIC_ESTADO === 'EN PROCESO') {
            acc.enProceso += 1;
        } else if (ticket.TIC_ESTADO === 'RESUELTO' || ticket.TIC_ESTADO === 'CERRADO') {
            acc.cerrados += 1;
        }

        // Lógica simple para Tickets Atrasados (SLA violado)
        const limiteSolucion = new Date(ticket.TIC_FECHAH_LIMITE_SOLUCION);
        const hoy = new Date();
        if (limiteSolucion < hoy && (ticket.TIC_ESTADO === 'NUEVO' || ticket.TIC_ESTADO === 'EN PROCESO')) {
            acc.atrasados += 1;
        }

        return acc;
      }, { total: 0, abiertos: 0, enProceso: 0, cerrados: 0, atrasados: 0 });
      
      setMetrics(calculatedMetrics);

    } catch (error) {
      console.error("Error cargando tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarTickets();
  }, []); 

  // Función auxiliar para obtener la clase CSS del estado
  const getStatusClass = (status) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('nuevo')) return 'status-tag abierto';
    if (lowerStatus.includes('proceso')) return 'status-tag en-proceso';
    if (lowerStatus.includes('resuelto') || lowerStatus.includes('cerrado')) return 'status-tag cerrado';
    return 'status-tag';
  };

  // Función para formatear la fecha límite
  const formatSlaDate = (dateString) => {
      const date = new Date(dateString);
      if (isNaN(date)) return 'N/A';
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return <div className="loading-state">Cargando Dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      
      {/* Barra superior con notificaciones (dejamos el ejemplo estático) */}
      <div className="dashboard-header">
        <h1>Panel Técnico</h1>
        <div className="notification-wrapper">
          <FaBell
            className="notification-icon"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {/* ... resto del código del popup de notificaciones ... */}
        </div>
      </div>

      {/* Recuadros de métricas DINÁMICAS */}
      <div className="metrics-grid">
        {/* Total Tickets */}
        <div className="metric-card total">
          <FaTicketAlt className="metric-icon" />
          <div className="metric-info">
            <h2>{metrics.total}</h2>
            <p>Total Tickets</p>
          </div>
        </div>
        {/* Abiertos / Nuevos */}
        <div className="metric-card abiertos">
          <FaFolderOpen className="metric-icon" />
          <div className="metric-info">
            <h2>{metrics.abiertos}</h2>
            <p>Nuevos</p>
          </div>
        </div>
        {/* En Proceso */}
        <div className="metric-card enproceso">
          <FaClock className="metric-icon" />
          <div className="metric-info">
            <h2>{metrics.enProceso}</h2>
            <p>En Proceso</p>
          </div>
        </div>
        {/* SLA Atrasados (Nueva Métrica Importante) */}
        <div className="metric-card atrasados">
          <FaExclamationTriangle className="metric-icon" />
          <div className="metric-info">
            <h2>{metrics.atrasados}</h2>
            <p>Tickets Atrasados</p>
          </div>
        </div>
      </div>


      {/* Lista de Tickets - Reemplazamos 'recentTickets' */}
      <div className="recent-tickets">
        <h2>Tickets Activos ({tickets.length})</h2>
        <div className="tickets-list">
          {tickets.map((ticket) => (
            <div key={ticket.TIC_TICKET} className="ticket-card">
              <h4>{ticket.TIC_ASUNTO}</h4>
              <p className="ticket-meta">
                <strong>#{ticket.TIC_TICKET}</strong> | Solicitante: {ticket.SOLICITANTE_NOMBRE} | Asignado a: {ticket.TECNICO_NOMBRE || 'Nadie'}
              </p>
              <p className="ticket-meta">
                **Límite Solución:** {formatSlaDate(ticket.TIC_FECHAH_LIMITE_SOLUCION)}
              </p>
              <span className={getStatusClass(ticket.TIC_ESTADO)}>
                {ticket.TIC_ESTADO}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





