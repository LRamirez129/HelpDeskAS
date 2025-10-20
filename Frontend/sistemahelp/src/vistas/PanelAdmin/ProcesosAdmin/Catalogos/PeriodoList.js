import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PeriodoModal from './PeriodoModal'; 
// Importar iconos (ajusta las rutas si es necesario)
import updateIcon from '../../../../Iconos/editar.png';
import deleteIcon from '../../../../Iconos/eliminar.png';
import addIcon from '../../../../Iconos/add.png';
import searchIcon from '../../../../Iconos/buscar.png'; // 🚨 Agregamos el ícono de búsqueda para el diseño de tarjetas
import './Catalogos.css'; 

const API_URL = 'http://localhost:4000/api/periodos'; 

// === TUS FUNCIONES ORIGINALES DE FECHA ===
const displayDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Nota: toLocaleDateString usará el formato local, que puede ser dd/mm/aaaa
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
// ==========================================

const initialFormState = {
    PER_Nombre: '',
    PER_Descripcion: '',
    PER_FechaDesde: '',
    PER_FechaHasta: '',
    PER_Activo: 'S',
};

const PeriodosList = () => { // Cambiado de PeriodoList a PeriodosList (convención)
    // === TUS ESTADOS ORIGINALES ===
    const [periodos, setPeriodos] = useState([]);
    const [filteredPeriodos, setFilteredPeriodos] = useState([]); // Nuevo para manejar la búsqueda
    const [searchTerm, setSearchTerm] = useState(''); // Nuevo para manejar la búsqueda
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPeriodo, setCurrentPeriodo] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    // =============================


    useEffect(() => {
        fetchPeriodos();
    }, []);

    const fetchPeriodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);
            setPeriodos(response.data);
            handleSearch(response.data, searchTerm); // Llama a la búsqueda después de cargar
        } catch (err) {
            setError('Error al cargar los períodos: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };
    
    // === FUNCIÓN DE BÚSQUEDA (Necesaria para el diseño de tarjetas) ===
    const handleSearch = (data, term) => {
        setSearchTerm(term);
        if (term === '') {
            setFilteredPeriodos(data);
        } else {
            const filtered = data.filter(p =>
                (p.NOMBRE || '').toLowerCase().includes(term.toLowerCase()) || 
                (p.DESCRIPCION || '').toLowerCase().includes(term.toLowerCase()) ||
                p.ID.toString().includes(term)
            );
            setFilteredPeriodos(filtered);
        }
    };
    // ==============================================================

    const handleCreate = () => {
        setCurrentPeriodo(initialFormState);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEdit = (periodo) => {
        // === TU LÓGICA ORIGINAL DE EDICIÓN ===
        const formattedPeriodo = {
            ...periodo,
            PER_Nombre: periodo.NOMBRE,
            PER_Descripcion: periodo.DESCRIPCION || '',
            PER_FechaDesde: formatDateForInput(periodo.FECHA_DESDE),
            PER_FechaHasta: periodo.FECHA_HASTA ? formatDateForInput(periodo.FECHA_HASTA) : '',
            PER_Activo: periodo.ACTIVO,
            PER_Periodo: periodo.ID 
        };
        // ======================================
        
        setCurrentPeriodo(formattedPeriodo);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`¿Estás seguro de eliminar el período ${id}?`)) return;
        
        setError(null);
        try {
            await axios.delete(`${API_URL}/${id}`);
            alert('Período eliminado con éxito.');
            fetchPeriodos(); 
        } catch (err) {
            setError('Error al eliminar: ' + (err.response?.data?.error || err.message));
        }
    };
    
    const handleCloseModal = (refresh = false) => {
        setIsModalOpen(false);
        setCurrentPeriodo(initialFormState);
        setIsEditing(false);
        if (refresh) fetchPeriodos();
    }

    if (loading) return <div>Cargando períodos...</div>;

    return (
        <div className="catalogos-list-container">
            <div className="catalog-items-list">
                
                {/* CABECERA CON BÚSQUEDA Y BOTÓN DE CREAR (Diseño de Repuestos) */}
                <div className="catalog-header">
                    <div><h3>Gestión de Períodos</h3></div>
                    <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        {/* Barra de búsqueda */}
                        <div className="search-container">
                            <img src={searchIcon} alt="Buscar" className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o ID..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(periodos, e.target.value)}
                                className="search-input"
                            />
                        </div>
                        {/* Botón de Añadir nuevo período */}
                        <button onClick={handleCreate} className="btn-create" data-tooltip="Crear nuevo período">
                            <img src={addIcon} alt="Nuevo" className="action-icon-white" />
                        </button>
                    </div>
                </div>
            
                {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                {/* El modal ahora usa isOpen y es controlado aquí */}
                <PeriodoModal
                    isOpen={isModalOpen}
                    isEditing={isEditing}
                    initialData={currentPeriodo}
                    onClose={handleCloseModal} // Pasa la función para cerrar y refrescar
                    setError={setError}
                />

                {/* LISTADO DE PERÍODOS EN FORMATO DE TARJETAS */}
                <div className="items-list">
                    {filteredPeriodos.map((p) => {
                        const esActivo = p.ACTIVO === 'S';
                        const statusText = esActivo ? 'Activo' : 'Inactivo';
                        
                        return (
                            <div className="item-card" key={p.ID}>
                                
                                {/* Contenido principal de la tarjeta */}
                                <div>
                                    <span className="item-title">{p.NOMBRE || `Período ID ${p.ID}`}</span>&nbsp;&nbsp;
                                    {/* Muestra el estado Activo/Inactivo con su punto */}
                                    <span className={`status-tag ${esActivo ? "active":"inactive"}`}>
                                        {/* Usamos el status-dot, asumiendo que Catalogos.css lo define */}
                                        {esActivo ? 
                                            <span className="status-dot active"></span> : 
                                            <span className="status-dot inactive"></span>
                                        }
                                        {statusText}
                                    </span><br />
                                    {/* Muestra ID y Fechas */}
                                    <span className="item-meta">
                                        <strong>ID: {p.ID}</strong> | Desde: {displayDate(p.FECHA_DESDE)} | Hasta: {p.FECHA_HASTA ? displayDate(p.FECHA_HASTA) : 'N/A'}
                                    </span>
                                    {/* Muestra la descripción (si existe) */}
                                    {p.DESCRIPCION && <p className="item-meta">{p.DESCRIPCION}</p>}
                                </div>
                                
                                {/* Botones de Acción (Editar/Eliminar) */}
                                <div style={{marginLeft: 'auto', alignSelf: 'center'}}>
                                    <button 
                                        className="action-button abrir-button" 
                                        onClick={() => handleEdit(p)} 
                                        data-tooltip="Editar Período"
                                    >
                                        <center><img src={updateIcon} alt="Editar" /></center>
                                    </button> &nbsp;
                                    <button 
                                        className="action-button sla-button" 
                                        onClick={() => handleDelete(p.ID)} 
                                        data-tooltip="Eliminar Período"
                                    >
                                        <center><img src={deleteIcon} alt="Eliminar" /></center>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {filteredPeriodos.length === 0 && !loading && (
                        <div className="no-results">
                            No se encontraron períodos que coincidan con la búsqueda.
                        </div>
                    )}
                </div> {/* Fin items-list */}

            </div>
        </div>
    );
};

export default PeriodosList;