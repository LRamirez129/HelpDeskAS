import React, { useState } from 'react';
import '../modulo.css';

// Importa tus imágenes de iconos
import dashboardIcon from '../../Iconos/dashboard.png';
import historyIcon from '../../Iconos/history.png';
import reportsIcon from '../../Iconos/reports.png';
import ticketsIcon from '../../Iconos/tickets.gif';

import DashboardPage from './Dashboard';
import TicketsModule from './Ticket';
import DetalleTicketPage from './ProcesosTec/DetalleTicket';
import Reporteria from './Reportes/Reporteria';
import TicketPestana from './TicketPestaña';
import SLAPage from './ProcesosTec/BaseConocimiento'; 

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: dashboardIcon },
    { id: 'ticketsPestana', label: 'Tickets', icon: ticketsIcon },
    { id: 'historial', label: 'Historial de Tickets', icon: historyIcon },
    { id: 'informes', label: 'Informes', icon: reportsIcon },
];

function ModuloTecnico() {
    // 1. ESTADOS CLAVE
    const [activeModule, setActiveModule] = useState('ticketsPestana'); // Inicia en Tickets
    const [selectedTicketId, setSelectedTicketId] = useState(null); 
    // ^ ESTADO PARA GUARDAR EL ID DEL TICKET SELECCIONADO

    // 2. FUNCIÓN CENTRAL PARA ABRIR EL DETALLE
    const handleTicketSelect = (ticketId) => {
        // Validación: Solo guarda y cambia de vista si hay un ID válido.
        if (ticketId) {
            setSelectedTicketId(ticketId); // GUARDA EL ID
            setActiveModule('detalleTicket'); // CAMBIA LA VISTA
        } else {
            console.error("No se puede abrir el detalle: ID de ticket no válido recibido desde TicketPestana.");
        }
    };

    // 3. FUNCIÓN PARA VOLVER A LA LISTA
    const handleVolverATickets = () => {
        setSelectedTicketId(null); // Limpia el ID para la siguiente selección
        setActiveModule('ticketsPestana'); // Vuelve a la lista
    };


    const renderModule = () => {
        switch (activeModule) {
            case 'dashboard':
                return <DashboardPage />;
            
            case 'ticketsPestana':
                // IMPORTANTE: Pasamos la función 'handleTicketSelect' como prop 'onTicketSelect'.
                return (
                    <TicketPestana 
                        onTicketSelect={handleTicketSelect} 
                        setActiveModule={setActiveModule} 
                    />
                );
            
            case 'historial':
                return <TicketsModule />;
            
            case 'detalleTicket':
                // Validamos que el ID exista antes de renderizar DetalleTicketPage
                if (!selectedTicketId) {
                    return (
                        <div className="error-id-view">
                            <p>🚨 Error de Conexión 🚨</p>
                            <p>No se pudo cargar el ticket. Detalles: No se proporcionó un ID de ticket válido.</p>
                            <button className="volver-button" onClick={handleVolverATickets}>Volver a Tickets</button>
                        </div>
                    );
                }
                // ¡LA CLAVE! Le pasamos el ID almacenado a la página de detalle.
                return (
                    <DetalleTicketPage 
                        ticketId={selectedTicketId} 
                        setActiveModule={handleVolverATickets} // Usa la función de volver
                    />
                );
            
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
