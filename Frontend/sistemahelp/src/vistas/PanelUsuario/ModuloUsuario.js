import React, { useState } from 'react';
import '../modulo.css';

// Importa los iconos
import dashboardIcon from '../../Iconos/dashboard.png';
import historyIcon from '../../Iconos/history.png';
import reportsIcon from '../../Iconos/reports.png';
import ticketsIcon from '../../Iconos/tickets.gif';


const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: dashboardIcon },
  { id: 'tickets', label: 'Tickets', icon: ticketsIcon },
  { id: 'detalle', label: 'Historial de Tickets', icon: historyIcon },
  { id: 'informes', label: 'Informes', icon: reportsIcon },
];

function ModuloUsuario() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        
        return <div>Contenido del Dashboard de Usuario</div>;
      case 'tickets':
        
        return <div>Contenido de Tickets de Usuario</div>;
      case 'detalle':
        
        return <div>Contenido del Historial de Tickets de Usuario</div>;
      case 'informes':
       
        return <div>Contenido de Informes de Usuario</div>;
      default:
        return <div>Seleccione un módulo</div>;
    }
  };

  return (
    <div className="app-container">
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
            >
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

export default ModuloUsuario;