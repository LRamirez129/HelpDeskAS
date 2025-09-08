import React, { useState } from 'react';
import './modulo.css'; 

// Importa tus imágenes de iconos
import dashboardIcon from '../../Iconos/dashboard.png';
import historyIcon from '../../Iconos/history.png';
import reportsIcon from '../../Iconos/reports.png';
import ticketsIcon from '../../Iconos/tickets.gif';

import DashboardPage from './Dashboard';
import TicketsModule from './Ticket';
import DetalleTicketPage from './DetalleTicket';
import Reporteria from './Reportes/Reporteria';

// Se actualiza el array para usar las imágenes importadas
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: dashboardIcon },
  { id: 'tickets', label: 'Tickets', icon: ticketsIcon },
  { id: 'detalle', label: 'Historial de Tickets', icon: historyIcon },
  { id: 'informes', label: 'Informes', icon: reportsIcon },
];

// Se corrige el nombre de la función principal a ModuloTecnico
function ModuloTecnico() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tickets':
        return <TicketsModule />;
      case 'detalle':
        return <DetalleTicketPage />;
      case 'informes':
        return <Reporteria />;
      default:
        return <div>Seleccione un módulo</div>;
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo">
          <p>Panel Técnico</p>
          <p className="help-desk-text">HelpDesk Pro</p>
        </div>
        <nav className="nav-menu">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeModule === item.id ? 'active' : ''}`}
              onClick={() => setActiveModule(item.id)}
            >
              {/* Se reemplaza la etiqueta <i> con <img> para usar tus imágenes */}
              <img src={item.icon} alt={item.label} className="nav-icon" /> 
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <main className="main-content">
        {renderModule()}
      </main>
    </div>
  );
}

// Se exporta la función ModuloTecnico
export default ModuloTecnico;