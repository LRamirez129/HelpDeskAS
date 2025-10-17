import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; 
import './ReUsuario.css'; 

// URL de tu API para el reporte
const API_URL = 'http://localhost:4000/api/reportes/consumo-repuestos-solicitante'; 

const RepuestoPorUsuario = () => {
    const [reporte, setReporte] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);
    
    // Filtros que se envían a la API (SQL)
    const [filters, setFilters] = useState({
        fechaInicio: '',
        fechaFin: '',
        solicitanteId: ''
    });
    
    // Filtros de texto para la tabla (Frontend)
    const [columnFilters, setColumnFilters] = useState({
        SOLICITANTE: '',
        CODIGO_REPUESTO: '',
        DESCRIPCION_REPUESTO: ''
    });

    // Función para obtener los datos del reporte con filtros de la API
    const fetchReporte = useCallback(async () => {
        // --- 1. VALIDACIÓN DE FECHAS ANTES DE LLAMAR A LA API ---
        if (filters.fechaInicio && filters.fechaFin) {
            const start = new Date(filters.fechaInicio);
            const end = new Date(filters.fechaFin);

            // Se agrega 1 día a la fecha fin para evitar problemas con la hora de medianoche
            if (start > end) {
                setError("La Fecha de Fin no puede ser anterior a la Fecha de Inicio.");
                setReporte([]);
                return; // Detiene la llamada a la API
            }
        }
        // --------------------------------------------------------

        setLoading(true);
        setError(null);
        
        const queryParams = new URLSearchParams(filters).toString();
        const url = `${API_URL}?${queryParams}`;

        try {
            const response = await axios.get(url);
            setReporte(response.data || []); 
        } catch (err) {
            console.error("Error al cargar el reporte:", err);
            // Intenta obtener el mensaje de error del backend
            const msg = err.response?.data?.message || "Error de conexión con el servidor.";
            setError(msg);
            setReporte([]);
        } finally {
            setLoading(false);
        }
    }, [filters]); 

    // Cargar el reporte inicial (sin filtros) al montar el componente.
    useEffect(() => {
        fetchReporte(); 
    }, [fetchReporte]); 

    const handleApplyFilters = () => {
        fetchReporte();
    };

    const handleClearFilters = () => {
        // Restablece filtros de API
        setFilters({ fechaInicio: '', fechaFin: '', solicitanteId: '' });
        // Restablece filtros de columna
        setColumnFilters({ SOLICITANTE: '', CODIGO_REPUESTO: '', DESCRIPCION_REPUESTO: '' }); 
        // Limpia el mensaje de error si existe
        setError(null);
    };

    // Función para aplicar el filtro de texto de la tabla (frontend)
    const handleColumnFilterChange = (columnName, value) => {
        setColumnFilters(prev => ({
            ...prev,
            [columnName]: value.toUpperCase() // Filtrar en mayúsculas para coincidencia
        }));
    };

    // Función para filtrar los datos en el frontend
    const filterData = () => {
        if (reporte.length === 0) return [];

        return reporte.filter(item => {
            const solicitanteMatch = item.SOLICITANTE 
                && item.SOLICITANTE.toUpperCase().includes(columnFilters.SOLICITANTE);
            
            const codigoMatch = item.CODIGO_REPUESTO 
                && item.CODIGO_REPUESTO.toUpperCase().includes(columnFilters.CODIGO_REPUESTO);
            
            const descripcionMatch = item.DESCRIPCION_REPUESTO 
                && item.DESCRIPCION_REPUESTO.toUpperCase().includes(columnFilters.DESCRIPCION_REPUESTO);

            return solicitanteMatch && codigoMatch && descripcionMatch;
        });
    };

    const filteredReporte = filterData();

    // Función de renderizado de la tabla (usa los datos filtrados)
    const renderTableContent = () => {
        if (loading) {
            return <tr><td colSpan="5" style={{textAlign: 'center'}}>Cargando reporte...</td></tr>;
        }

        if (error) {
            return (
                <tr>
                    <td colSpan="5" className="alert alert-danger" style={{textAlign: 'center'}}>
                        Error: **{error}**.
                    </td>
                </tr>
            );
        }
        
        if (filteredReporte.length === 0 && reporte.length > 0) {
            return <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No hay coincidencias con los filtros de columna aplicados.</td></tr>;
        }
        if (filteredReporte.length === 0 && reporte.length === 0) {
             return <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No se encontraron repuestos consumidos con los filtros de API aplicados.</td></tr>;
        }

        return (
            <>
                {filteredReporte.map((item, index) => {
                    // Conversión segura de números del backend
                    const ticketsInvolucrados = parseInt(item.TICKETS_INVOLUCRADOS) || 0;
                    const cantidadTotal = parseInt(item.CANTIDAD_TOTAL_CONSUMIDA) || 0;

                    return (
                        <tr key={index}>
                            <td>{item.SOLICITANTE}</td>
                            <td>{item.CODIGO_REPUESTO}</td>
                            <td>{item.DESCRIPCION_REPUESTO}</td>
                            <td style={{ textAlign: 'center' }}>{ticketsInvolucrados}</td>
                            <td style={{ textAlign: 'center' }}>
                                <strong>{cantidadTotal}</strong>
                            </td>
                        </tr>
                    );
                })}
            </>
        );
    };

    // --- RENDERIZADO PRINCIPAL ---
    return (
        <div className="reporte-container">
            <h2 className="reporte-titulo">Reporte de Consumo de Repuestos por Solicitante ⚙️</h2>

            {/* === ÁREA DE FILTROS Y CONTROLES (API) === */}
            <div className="filter-panel">
                <h4 style={{marginTop: '0'}}>Filtros de Búsqueda (API)</h4>
                <div className="filter-controls-group">
                    
                    {/* Filtro por Fecha de Inicio */}
                    <input 
                        type="date" 
                        value={filters.fechaInicio} 
                        onChange={(e) => setFilters(prev => ({...prev, fechaInicio: e.target.value}))}
                        title="Fecha de Inicio"
                    />
                    
                    {/* Filtro por Fecha de Fin */}
                    <input 
                        type="date" 
                        value={filters.fechaFin} 
                        min={filters.fechaInicio || ''} // Validación visual de HTML5
                        onChange={(e) => {
                            setFilters(prev => ({...prev, fechaFin: e.target.value}));
                            if (error) setError(null); 
                        }}
                        title="Fecha de Fin"
                    />

                    {/* Filtro por Solicitante ID */}
                    <input 
                        type="number" 
                        placeholder="ID Solicitante"
                        value={filters.solicitanteId}
                        onChange={(e) => setFilters(prev => ({...prev, solicitanteId: e.target.value}))}
                        title="Filtrar por ID de Usuario Solicitante"
                        style={{maxWidth: '150px'}}
                    />

                    <button 
                        onClick={handleApplyFilters} 
                        className="btn-primary" 
                        disabled={loading}
                    >
                        Aplicar Filtros
                    </button>
                    
                    <button 
                        onClick={handleClearFilters} 
                        className="btn-secondary" 
                        disabled={loading}
                    >
                        Limpiar Filtros
                    </button>
                    
                    {/* Botón de Exportar (Pendiente) */}
                    <button 
                        className="btn-export" 
                        disabled
                    >
                        Exportar a Excel 🚧
                    </button>
                </div>
            </div>
            {/* ==================================== */}

            <p className="reporte-meta">
                {reporte.length > 0 ? `Total de registros de la API: ${reporte.length}. Mostrando: ${filteredReporte.length}` : null}
            </p>

            <div className="reporte-tabla-scroll">
                <table className="reporte-tabla">
                    <thead>
                        <tr>
                            {/* Columna con Filtro: Solicitante */}
                            <th>
                                <div>Solicitante</div>
                                <div className="filter-input-group"> 
                                    <input 
                                        type="text" 
                                        placeholder="" 
                                        value={columnFilters.SOLICITANTE}
                                        onChange={(e) => handleColumnFilterChange('SOLICITANTE', e.target.value)}
                                    />
                                    <div className="filter-icon-button" title="Filtrar">
                                        &#x25BC; {/* Icono de triángulo */}
                                    </div>
                                </div>
                            </th>
                            
                            {/* Columna con Filtro: Código Repuesto */}
                            <th>
                                <div>Código Repuesto</div>
                                <div className="filter-input-group">
                                    <input 
                                        type="text" 
                                        placeholder="" 
                                        value={columnFilters.CODIGO_REPUESTO}
                                        onChange={(e) => handleColumnFilterChange('CODIGO_REPUESTO', e.target.value)}
                                    />
                                    <div className="filter-icon-button" title="Filtrar">
                                        &#x25BC;
                                    </div>
                                </div>
                            </th>
                            
                            {/* Columna con Filtro: Descripción Repuesto */}
                            <th>
                                <div>Descripción Repuesto</div>
                                <div className="filter-input-group">
                                    <input 
                                        type="text" 
                                        placeholder="" 
                                        value={columnFilters.DESCRIPCION_REPUESTO}
                                        onChange={(e) => handleColumnFilterChange('DESCRIPCION_REPUESTO', e.target.value)}
                                    />
                                    <div className="filter-icon-button" title="Filtrar">
                                        &#x25BC;
                                    </div>
                                </div>
                            </th>
                            
                            {/* Columnas sin filtro de texto */}
                            <th style={{ textAlign: 'center' }}>Tickets Involucrados</th>
                            <th style={{ textAlign: 'center' }}>Cantidad Total Consumida</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableContent()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RepuestoPorUsuario;