// src/vistas/PanelUsuario/ModuloUsuario.js
import React, { useState, useEffect } from "react";
import "../modulo.css";

// Detalle del técnico (lo reutilizamos)
import DetalleTicketTecnico from "../PanelTecnico/ProcesosTec/DetalleTicket";

// Historial del tecnico (lo reutilizamos)
import Historial from "../PanelTecnico/Ticket";

// Formulario real para reportar fallas
import ReportarFalla from "./componentes/reportarfalla";

// Iconos
import ticketsIcon from '../../Iconos/tickets.gif';
import historyIcon from '../../Iconos/history.png';
import reportsIcon from '../../Iconos/reports.png';

// Vista de tarjetas del técnico (con filtro y onAbrirTicket)
import TicketPestaña from "../PanelTecnico/TicketPestaña";

/* ===========================================================
   Helpers para identificar al usuario y filtrar sus tickets
   =========================================================== */

// Lee identidad desde localStorage (ajusta las keys si usas otras)
const obtenerUsuarioActual = () => {
  const id =
    localStorage.getItem('usuarioId') ||
    localStorage.getItem('userId') ||
    localStorage.getItem('idUsuario') ||
    null;

  const correo =
    localStorage.getItem('correo') ||
    localStorage.getItem('email') ||
    null;

  return {
    id: id ? String(id) : null,
    correo: correo ? String(correo).toLowerCase() : null,
  };
};

// Estados visibles para el usuario (agrega 'asignado' o 'cerrado' si lo necesitas)
const ESTADOS_VISIBLES_USUARIO = new Set([
  'abierto',
  'en progreso',
  'en-progreso',
]);

// Coincidencia por id o correo (ajusta campos según tu shape real de ticket)
const coincideUsuario = (ticket, usuario) => {
  const uid = usuario.id;
  const mail = usuario.correo;

  const candidatosId = [
    ticket.usuarioId,
    ticket.solicitanteId,
    ticket.creadorId,
    ticket.clienteId,
    ticket.userId,
  ].filter(Boolean).map(v => String(v));

  const candidatosMail = [
    ticket.correo,
    ticket.email,
    ticket.correoSolicitante,
  ].filter(Boolean).map(v => String(v).toLowerCase());

  const okId = uid ? candidatosId.includes(String(uid)) : false;
  const okMail = mail ? candidatosMail.includes(String(mail)) : false;

  return okId || okMail;
};

// Filtro final que pasaremos a TicketPestaña
const filtroTicketsUsuario = (ticket) => {
  const usuario = obtenerUsuarioActual();

  // estados en TicketPestaña de ejemplo: "Abierto", "Asignado", "En progreso"
  const estado = String(ticket.estado || ticket.status || '').toLowerCase().replace('_', ' ');
  const esEstadoVisible = ESTADOS_VISIBLES_USUARIO.has(estado);
  const esDelUsuario = coincideUsuario(ticket, usuario);

  return esDelUsuario && esEstadoVisible;
};

/* ===========================
   Módulo principal del Usuario
   =========================== */

function ModuloUsuario({ onToggleBackButton }) {
  // Opciones del sidebar
  const navItems = [
    { id: 'tickets',   label: 'Tickets',         icon: ticketsIcon },
    { id: 'historial', label: 'Historial',       icon: historyIcon },
    { id: 'reportar',  label: 'Reportar Falla',  icon: reportsIcon },
  ];

  // Estado de navegación local
  const [activeModule, setActiveModule] = useState('tickets');
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

  // Mantener el comportamiento de tu app (mostrar botón regresar según tu lógica)
  useEffect(() => {
    if (typeof onToggleBackButton === 'function') onToggleBackButton(true);
    return () => {
      if (typeof onToggleBackButton === 'function') onToggleBackButton(true);
    };
  }, [onToggleBackButton]);

  // Render de contenido central según la opción
  const renderContenido = () => {
    switch (activeModule) {
      case 'tickets':
        return (
          <TicketPestaña
            titulo="Mis Tickets"
            filtro={filtroTicketsUsuario}
            mostrarSLA={false}
            onAbrirTicket={(ticket) => {
              setTicketSeleccionado(ticket);
              setActiveModule('detalleTicket');
            }}
            // Pasamos setActiveModule para compatibilidad con su navegación interna
            setActiveModule={setActiveModule}
          />
        );

      case 'detalleTicket':
        // Reutiliza el mismo detalle del técnico con los datos del ticket elegido
        return (
          <DetalleTicketTecnico
            ticket={ticketSeleccionado}
            setActiveModule={setActiveModule}
          />
        );

      case 'historial':
        return (
          <Historial
            ticket={ticketSeleccionado}
            setActiveModule={setActiveModule}
          />
        );

      case 'reportar':
        // 👉 Aquí ya mostramos el formulario real para reportar fallas

        return <ReportarFalla onCancelar={() => setActiveModule('tickets')} />;

      default:
        return <div>Seleccione una opción del menú</div>;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar con el mismo look & feel que los otros paneles */}
      <div className="sidebar">
        <div className="logo">
          <p>Panel Usuario</p>
          <p className="help-desk-text">HelpDesk Pro</p>
        </div>

        <nav className="nav-menu">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeModule === item.id ? 'active' : ''}`}
              onClick={() => setActiveModule(item.id)}
              title={item.label}
            >
              <img src={item.icon} alt={item.label} className="nav-icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido principal */}
      <main className="main-content">
        {renderContenido()}
      </main>
    </div>
  );
}

export default ModuloUsuario;


// (estilos inline opcionales que ya tenías)
const inputStyle = {
  width: "100%",
  marginTop: 6,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  outline: "none",
};

const btnPri = {
  background: "var(--primary, #0d3b66)",
  color: "#fff",
  border: "none",
  padding: "10px 14px",
  borderRadius: 10,
  cursor: "pointer",
};

const btnSec = {
  background: "transparent",
  color: "var(--primary, #0d3b66)",
  border: "1px solid var(--primary, #0d3b66)",
  padding: "10px 14px",
  borderRadius: 10,
  cursor: "pointer",
};
