import React, { useState } from 'react';
import '../modulo.css';

// Importa tus imágenes de iconos
import dashboardIcon from '../../Iconos/dashboard.png';
import historyIcon from '../../Iconos/history.png';
import reportsIcon from '../../Iconos/reports.png';
import ticketsIcon from '../../Iconos/tickets.gif';
import catalogsIcon from '../../Iconos/catalogs.png';

import DashboardPage from './Dashboard';
import TicketsModule from './Ticket';
import DetalleTicketPage from './ProcesosTec/DetalleTicket';
import Reporteria from './Reportes/Reporteria';
import Catalogo from './Catalogos/Catalogo';
import TicketPestana from './TicketPestaña';
import SLAPage from './ProcesosTec/BaseConocimiento'; 

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: dashboardIcon },
    { id: 'ticketsPestana', label: 'Tickets', icon: ticketsIcon },
    { id: 'catalogs', label: 'Catálogos', icon: catalogsIcon },
    { id: 'historial', label: 'Historial de Tickets', icon: historyIcon },
    { id: 'informes', label: 'Informes', icon: reportsIcon },
];

function ModuloTecnico() {
    const [activeModule, setActiveModule] = useState('dashboard');

    const renderModule = () => {
        switch (activeModule) {
            case 'dashboard':
                return <DashboardPage />;
            case 'ticketsPestana':
                return <TicketPestana setActiveModule={setActiveModule} />;
            case 'historial':
                return <TicketsModule />;
            case 'catalogs':
                return <Catalogo />;
            case 'detalleTicket':
                return <DetalleTicketPage setActiveModule={setActiveModule} />;
            case 'informes':
                return <Reporteria />;
            case 'slaPage':
                return <SLAPage setActiveModule={setActiveModule} />;
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

export default ModuloTecnico;