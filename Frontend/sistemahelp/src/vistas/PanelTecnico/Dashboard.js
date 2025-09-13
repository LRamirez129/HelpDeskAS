import React, { useState } from "react";
import "./dashboard.css";
import { FaBell, FaTicketAlt, FaFolderOpen, FaClock, FaCheckCircle } from "react-icons/fa";

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Ejemplo de métricas
  const metrics = {
    total: 124,
    abiertos: 35,
    enProceso: 22,
    cerrados: 67,
  };

  // Ejemplo de notificaciones
  const notifications = [
    { id: 1, message: "Nuevo ticket asignado", status: "info" },
    { id: 2, message: "Ticket en proceso retrasado", status: "alerta" },
    { id: 3, message: "Ticket cerrado correctamente", status: "success" },
  ];

  // Ejemplo de tickets recientes
  const recentTickets = [
    {
      id: "T-101",
      title: "Problema con impresora HP",
      status: "abierto",
      user: "María González",
      date: "12/09/2025",
    },
    {
      id: "T-102",
      title: "Fallo en conexión de red",
      status: "en-proceso",
      user: "Juan Pérez",
      date: "11/09/2025",
    },
    {
      id: "T-103",
      title: "Actualización de software",
      status: "cerrado",
      user: "Ana Martínez",
      date: "10/09/2025",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Recuadros de métricas */}
      <div className="metrics-grid">
        <div className="metric-card total">
          <FaTicketAlt className="metric-icon" />
          <div className="metric-info">
            <h2>{metrics.total}</h2>
            <p>Total Tickets</p>
          </div>
        </div>
        <div className="metric-card abiertos">
          <FaFolderOpen className="metric-icon" />
          <div className="metric-info">
            <h2>{metrics.abiertos}</h2>
            <p>Abiertos</p>
          </div>
        </div>
        <div className="metric-card enproceso">
          <FaClock className="metric-icon" />
          <div className="metric-info">
            <h2>{metrics.enProceso}</h2>
            <p>En Proceso</p>
          </div>
        </div>
        <div className="metric-card cerrados">
          <FaCheckCircle className="metric-icon" />
          <div className="metric-info">
            <h2>{metrics.cerrados}</h2>
            <p>Cerrados</p>
          </div>
        </div>
      </div>

      {/* Barra superior con notificaciones */}
      <div className="dashboard-header">
        <h1>Panel Técnico</h1>
        <div className="notification-wrapper">
          <FaBell
            className="notification-icon"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {showNotifications && (
            <div className="notifications-popup">
              <div className="popup-header">
                <h3>Notificaciones</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowNotifications(false)}
                >
                  ✕
                </button>
              </div>
              <ul>
                {notifications.map((notif) => (
                  <li key={notif.id} className={`notif-item ${notif.status}`}>
                    {notif.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Tickets recientes */}
      <div className="recent-tickets">
        <h2>Tickets Recientes</h2>
        <div className="tickets-list">
          {recentTickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <h4>{ticket.title}</h4>
              <p className="ticket-meta">
                <strong>#{ticket.id}</strong> | {ticket.user} | {ticket.date}
              </p>
              <span className={`status-tag ${ticket.status}`}>
                {ticket.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





