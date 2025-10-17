import React, { useState, useEffect, useMemo } from 'react';
import './TicketPestaña.css';
import abrirIcono from '../../Iconos/abrir.png';
import slaIcono from '../../Iconos/sla.png';

// Importamos los íconos de Bootstrap
import { 
    BsInfoCircleFill,          // Icono para Estado
    BsExclamationTriangleFill, // Icono para Prioridad
    BsTagsFill,                // Icono para Categoría
    BsSearch,                  // Icono para Búsqueda
    BsTrash                    // Icono para Limpiar Filtros
} from 'react-icons/bs'; 

// URL de tu API para obtener los tickets asignados
const API_URL = "http://localhost:4000/api/asignados"; 

const TicketPestana = ({
    setActiveModule,
    filtro, 
    titulo = 'Tickets Asignados',
    mostrarSLA = true,
    onTicketSelect, 
}) => {
    // 1. ESTADOS PARA MANEJO DE DATOS
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. ESTADOS PARA LOS VALORES DE FILTRO
    const [filterEstado, setFilterEstado] = useState('Todos');
    const [filterPrioridad, setFilterPrioridad] = useState('Todas');
    const [filterCategoria, setFilterCategoria] = useState('Todas');
    const [searchText, setSearchText] = useState('');

    /**
     * FUNCIÓN PARA REINICIAR TODOS LOS FILTROS
     */
    const handleClearFilters = () => {
        setFilterEstado('Todos');
        setFilterPrioridad('Todas');
        setFilterCategoria('Todas');
        setSearchText('');
    };

    // 3. EFECTO PARA CONSUMIR LA API (sin cambios)
    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                setTickets(Array.isArray(data) ? data : []);
                
            } catch (err) {
                console.error("Fallo al obtener tickets:", err);
                setError('Error al cargar tickets: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []); 

    // 4. LÓGICA DE FILTRADO (sin cambios, ya era correcta)
    const filteredTickets = useMemo(() => {
        let currentTickets = Array.isArray(tickets) ? tickets : [];

        // 4.1. Filtrar por Estado
        if (filterEstado !== 'Todos') {
            const normalizedFilter = filterEstado.toLowerCase().replace(/\s/g, '');
            currentTickets = currentTickets.filter(
                ticket => String(ticket.ESTADO).toLowerCase().replace(/\s/g, '') === normalizedFilter
            );
        }

        // 4.2. Filtrar por Prioridad
        if (filterPrioridad !== 'Todas') {
            currentTickets = currentTickets.filter(
                ticket => String(ticket.PRIORIDAD).toLowerCase() === filterPrioridad.toLowerCase()
            );
        }

        // 4.3. Filtrar por Categoría
        if (filterCategoria !== 'Todas') {
            currentTickets = currentTickets.filter(
                ticket => String(ticket.CATEGORIA_PRINCIPAL).toLowerCase() === filterCategoria.toLowerCase()
            );
        }

        // 4.4. Filtrar por Búsqueda de Texto
        if (searchText) {
            const lowercasedSearch = searchText.toLowerCase().trim();
            currentTickets = currentTickets.filter(ticket => {
                return (
                    String(ticket.ASUNTO).toLowerCase().includes(lowercasedSearch) ||
                    String(ticket.ID_TICKET).toLowerCase().includes(lowercasedSearch)
                );
            });
        }
        
        if (typeof filtro === 'function') {
             currentTickets = currentTickets.filter(filtro);
        }

        return currentTickets;
    }, [tickets, filterEstado, filterPrioridad, filterCategoria, searchText, filtro]);


    // 5. OBTENER OPCIONES DINÁMICAS (CORREGIDO: Garantiza que la opción por defecto esté siempre primero.)
    const getOptions = (key, defaultText) => {
        const unique = new Set(tickets.map(t => t[key]).filter(v => v));
        // Se asegura que el valor por defecto esté siempre en la lista
        return [defaultText, ...Array.from(unique)].filter(Boolean); 
    };

    const availablePrioridades = useMemo(() => getOptions('PRIORIDAD', 'Todas'), [tickets]);
    const availableCategorias = useMemo(() => getOptions('CATEGORIA_PRINCIPAL', 'Todas'), [tickets]);
    const availableEstados = useMemo(() => getOptions('ESTADO', 'Todos'), [tickets]);


    // 6. MANEJADORES Y CLASES (sin cambios)
    const handleAbrirTicket = (ticketId) => {
        if (typeof onTicketSelect === 'function' && ticketId) {
            onTicketSelect(ticketId); 
        } else {
            console.warn("Advertencia: No se pudo abrir el ticket. Asegúrese de que 'onTicketSelect' se pasa desde el componente padre y el ticket tiene un ID.");
        }
    };

    const handleSla = (ticketId) => {
        if (setActiveModule) setActiveModule('slaPage');
    };

    const estadoClass = (estado) =>
        `ticket-estado estado-${String(estado).replace(/\s+/g, '-').toLowerCase()}`;

    const prioridadClass = (prioridad) =>
        `prioridad-${String(prioridad).toLowerCase()}`;


    // 7. RENDERIZADO CONDICIONAL (loading y error) (sin cambios)
    if (loading) {
        return (
            <div className="ticket-list-container loading-state">
                <h2>{titulo || 'Tickets Asignados'}</h2>
                <div className="loading-spinner"></div>
                <p>Cargando tickets de Oracle...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ticket-list-container error-state">
                <h2>{titulo || 'Tickets Asignados'}</h2>
                <p className="error-message">🚨 ¡Error de conexión! 🚨</p>
                <p className="error-details">Detalles: {error}</p>
                <p>Verifique que el backend de Node.js esté corriendo en {API_URL}.</p>
            </div>
        );
    }


    // 8. RENDERIZADO DE TICKETS Y FILTROS (Bloque de filtros modificado)
    return (
        <div className="ticket-list-container">
            <header className="ticket-list-header">
                <h2>{titulo || 'Tickets Asignados'}</h2>
            </header>

            {/* BARRA DE FILTROS - DISEÑO MEJORADO CON DESPLEGABLES */}
            <div className="ticket-filters-bar">
                
                {/* 1. Búsqueda por Texto */}
                <div className="filter-wrapper filter-search-wrapper">
                    <BsSearch className="filter-icon" /> 
                    <input
                        type="text"
                        placeholder="Buscar por ID o Título..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="filter-input-search"
                    />
                </div>

                {/* 2. Filtro por Estado (Azul Claro) */}
                <div className="filter-wrapper filter-select-estado"> 
                    <BsInfoCircleFill className="filter-icon" title="Filtrar por Estado" /> 
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="filter-select"
                    >
                        {/* AHORA INCLUYE 'Todos' COMO OPCIÓN SELECCIONABLE */}
                        {availableEstados.map(estado => (
                            <option 
                                key={estado} 
                                value={estado}
                            >
                                {estado === 'Todos' ? 'Estado' : estado}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 3. Filtro por Prioridad (Amarillo Claro) */}
                <div className="filter-wrapper filter-select-prioridad">
                    <BsExclamationTriangleFill className="filter-icon" title="Filtrar por Prioridad" /> 
                    <select
                        value={filterPrioridad}
                        onChange={(e) => setFilterPrioridad(e.target.value)}
                        className="filter-select"
                    >
                        {/* AHORA INCLUYE 'Todas' COMO OPCIÓN SELECCIONABLE */}
                        {availablePrioridades.map(prioridad => (
                            <option 
                                key={prioridad} 
                                value={prioridad}
                            >
                                {prioridad === 'Todas' ? 'Prioridad' : prioridad}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 4. Filtro por Categoría (Verde Claro) */}
                <div className="filter-wrapper filter-select-categoria">
                    <BsTagsFill className="filter-icon" title="Filtrar por Categoría" /> 
                    <select
                        value={filterCategoria}
                        onChange={(e) => setFilterCategoria(e.target.value)}
                        className="filter-select"
                    >
                        {/* AHORA INCLUYE 'Todas' COMO OPCIÓN SELECCIONABLE */}
                        {availableCategorias.map(categoria => (
                            <option 
                                key={categoria} 
                                value={categoria}
                            >
                                {categoria === 'Todas' ? 'Categoría' : categoria}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 5. Botón de Limpiar Filtros */}
                <button 
                    className="action-button clear-filters-button"
                    onClick={handleClearFilters}
                    title="Limpiar Filtros"
                >
                    <BsTrash className="filter-icon" />
                </button>
            </div>
            {/* FIN DEL CONTENEDOR DE FILTROS */}


            <div className="ticket-cards-grid">
                {filteredTickets.map(ticket => (
                    <div key={ticket.ID_TICKET} className="ticket-card"> 
                        <div className="ticket-card-header">
                            <span className="ticket-id">{ticket.ID_TICKET}</span>
                            <span className={estadoClass(ticket.ESTADO)}>{ticket.ESTADO}</span>
                        </div>

                        <div className="ticket-card-body">
                            <h3 className="ticket-titulo">{ticket.ASUNTO}</h3>
                            <div className="ticket-details">
                                <p>
                                    <strong>Prioridad:</strong>{' '}
                                    <span className={prioridadClass(ticket.PRIORIDAD)}>{ticket.PRIORIDAD}</span>
                                </p>
                                <p><strong>SLA:</strong> {ticket.SLA_RESTANTE_TEXTO}</p> 
                                <p><strong>Técnico:</strong> {ticket.TECNICO_ASIGNADO}</p>
                                <p><strong>Categoría:</strong> {ticket.CATEGORIA_PRINCIPAL}</p>
                            </div>
                        </div>

                        <div className="ticket-card-actions">
                            {/* Botón Abrir (Detalle) */}
                            <button
                                className="action-button abrir-button"
                                onClick={() => handleAbrirTicket(ticket.ID_TICKET)}
                                data-tooltip="Detalle"
                            >
                                <center><img src={abrirIcono} alt="Abrir" /></center>
                            </button>

                            {/* Botón SLA */}
                            {mostrarSLA && (
                                <button
                                    className="action-button sla-button"
                                    onClick={() => handleSla(ticket.ID_TICKET)}
                                    data-tooltip="SLA"
                                >
                                    <center><img src={slaIcono} alt="SLA" /></center>
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Mensaje si no hay tickets después de aplicar filtros */}
                {filteredTickets.length === 0 && !loading && (
                    <div className="ticket-card empty-state">
                        <h3>No hay tickets que coincidan con los filtros</h3>
                        <p>Intenta ajustar los criterios de búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default TicketPestana;