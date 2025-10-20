// CategoriasList.js
import React, { useState, useEffect } from 'react';
import CategoriaModal from './CategoriaModal'; 
import axios from 'axios'; 
import './Catalogos.css'; // Asegúrate de que este CSS esté enlazado

// Importar iconos (ajusta las rutas si es necesario)
import updateIcon from '../../../../Iconos/editar.png';
import deleteIcon from '../../../../Iconos/eliminar.png';
import addIcon from '../../../../Iconos/add.png';

const API_URL = 'http://localhost:4000/api/categorias'; 

// Función para generar el elemento <i> con la clase de Bootstrap Icons
const getIconElement = (iconName) => {
    if (iconName) {
        return <i className={`bi ${iconName} item-icon`} style={{ fontSize: '30px', color: '#0d3b66', marginBottom: '8px' }}></i>;
    }
    return <i className="bi bi-tag-fill item-icon" style={{ fontSize: '30px', color: '#0d3b66', marginBottom: '8px' }}></i>;
};


const CategoriasList = () => {
    // Este array contiene todas las categorías (Padre e Hija)
    const [categorias, setCategorias] = useState([]); 
    const [modalOpen, setModalOpen] = useState(false);
    const [currentCategoria, setCurrentCategoria] = useState(null); 
    const [mensaje, setMensaje] = useState('');

    const getErrorMessage = (error, defaultMsg) => {
        return error.response?.data?.error || error.message || defaultMsg;
    };
    
    const fetchCategorias = async () => { 
        setMensaje('');
        try {
            const response = await axios.get(API_URL); 
            setCategorias(response.data || []); 
        } catch (error) {
            const msg = getErrorMessage(error, "Error al cargar las categorías. Verifique la tabla HDK_CATEGORIA.");
            setMensaje(`Error: ${msg}`);
            console.error("Error al cargar categorías:", error);
        }
    };

    useEffect(() => {
        fetchCategorias(); 
    }, []);

    const handleCreate = () => {
        setCurrentCategoria(null); 
        setModalOpen(true);
        setMensaje('');
    };

    const handleEdit = (categoria) => {
        setCurrentCategoria(categoria); 
        setModalOpen(true);
        setMensaje('');
    };

    const handleSave = async (savedData) => {
        setMensaje('');
        setModalOpen(false); 

        const idToUpdate = savedData.ID; 
        
        const dataToSend = {
            NOMBRE: savedData.NOMBRE,
            DESCRIPCION: savedData.DESCRIPCION,
            // CLAVE ORA-02291: Enviar el ID_PADRE. El backend (parseNumber)
            // lo convertirá a NULL si está vacío ('') o si es 0, lo que resuelve el problema.
            ID_PADRE: savedData.ID_PADRE, 
            ICONO: savedData.ICONO, 
            ID_SLA: savedData.ID_SLA,
        };
        
        try {
            if (idToUpdate) {
                await axios.put(`${API_URL}/${idToUpdate}`, dataToSend);
                setMensaje('Categoría actualizada con éxito.');
            } else {
                await axios.post(API_URL, dataToSend);
                setMensaje('Categoría creada con éxito. ¡Ya puedes crear sus subcategorías!');
            }

            fetchCategorias(); 
        } catch (error) {
            const msg = getErrorMessage(error, "Error al guardar la categoría. Asegúrese de que el ID_PADRE exista. Mensaje Oracle: ORA-02291.");
            setMensaje(`Error: ${msg}`);
            console.error("Error en handleSave:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¡ADVERTENCIA! ¿Estás seguro de que quieres ELIMINAR esta categoría? Esta acción puede fallar si está en uso.')) {
            setMensaje('');
            try {
                await axios.delete(`${API_URL}/${id}`); 
                setMensaje('Categoría eliminada con éxito.');
                fetchCategorias(); 
            } catch (error) {
                const msg = getErrorMessage(error, "Error al eliminar la categoría. Probablemente está siendo utilizada por Tickets.");
                setMensaje(`Error: ${msg}`);
                console.error("Error en handleDelete:", error);
            }
        }
    };

    return (
        <div className="catalogos-list-container">
            
            {mensaje && <div className={`alert ${mensaje.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{mensaje}</div>}

            <div className="catalog-items-list">
                <div className="catalog-header">
                    <div><h3>Catálogo de Categorías</h3></div>
                    <div style={{marginLeft: 'auto'}}>
                        <button onClick={handleCreate} className="btn-create">
                            <img src={addIcon} alt="Nuevo" className="action-icon-white" />
                        </button>
                    </div>
                </div>
                
                <div className="items-list" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', padding: '10px'}}>
                    {categorias.map((cat) => ( 
                        <div key={cat.ID} className="item-card" 
                             style={{
                                 background: '#f8f9fa', 
                                 border: '1px solid #cbd5e1', 
                                 borderRadius: '12px', 
                                 padding: '14px',
                                 display: 'flex', 
                                 flexDirection: 'column', 
                                 alignItems: 'center', 
                                 textAlign: 'center',
                                 transition: 'all .15s ease',
                                 boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                             }}>
                            <div style={{marginBottom: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                
                                {/* Renderiza el ÍCONO */}
                                {getIconElement(cat.ICONO)} 

                                <span className="item-title" style={{fontWeight: '700', fontSize: '1.1rem'}}>{cat.NOMBRE}</span>
                                
                                <span className="item-meta" style={{fontSize: '0.8rem', opacity: '0.9', marginTop: '5px'}}>
                                    ID: {cat.ID} 
                                </span>
                                <span className="item-meta" style={{fontSize: '0.8rem', opacity: '0.9', marginTop: '5px', fontWeight: 'bold'}}>
                                    {/* LÓGICA DE TRADUCCIÓN DE ID_PADRE A NOMBRE */}
                                    Padre: 
                                    {cat.ID_PADRE 
                                        ? categorias.find(p => p.ID === cat.ID_PADRE)?.NOMBRE || `ID ${cat.ID_PADRE} (Error)`
                                        : 'N/A (Principal)'}
                                </span>
                                <span className="item-meta" style={{fontSize: '0.8rem', opacity: '0.8'}}>
                                    SLA: {cat.ID_SLA || 'N/A'}
                                </span>
                                <span className="item-meta" style={{fontSize: '0.85rem', marginTop: '5px'}}>
                                    {cat.DESCRIPCION || 'Sin descripción'}
                                </span>
                            </div>
                            <div style={{marginTop: '10px', display: 'flex', gap: '10px', padding: '5px 0'}}>
                                <button className="action-button abrir-button" onClick={() => handleEdit(cat)} data-tooltip="Editar">
                                    <center><img src={updateIcon} alt="Editar" style={{width: '20px', height: '20px'}} /></center>
                                </button>
                                <button className="action-button sla-button" onClick={() => handleDelete(cat.ID)} data-tooltip="Eliminar">
                                    <center><img src={deleteIcon} alt="Eliminar" style={{width: '20px', height: '20px'}} /></center>
                                </button>
                            </div>
                        </div>
                    ))}
                    {categorias.length === 0 && <p style={{padding: '10px'}}>No hay categorías disponibles.</p>}
                </div>
            </div>
            
            {modalOpen && (
                <CategoriaModal
                    categoria={currentCategoria} 
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                    // Pasamos el array completo para crear el <select> de padres
                    categoriasPadre={categorias} 
                />
            )}
        </div>
    );
};

export default CategoriasList;