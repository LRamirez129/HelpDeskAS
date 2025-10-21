/*import React, { useState } from 'react';
import DepartamentoModal from './DepartamentoModal';
import './Catalogos.css';

// Importar iconos (asegúrate de que estas rutas sean correctas)
import updateIcon from '../../../../Iconos/editar.png';
import deleteIcon from '../../../../Iconos/eliminar.png';
import addIcon from '../../../../Iconos/add.png'


const initialData = [
    { DEP_DEPARTAMENTO: 1, NOMBRE: 'Administración', DESCRIPCION: 'Personal administrativo', ACTIVO: 'S' },
    { DEP_DEPARTAMENTO: 2, NOMBRE: 'Ventas', DESCRIPCION: 'Sales representatives', ACTIVO: 'S' },
    { DEP_DEPARTAMENTO: 3, NOMBRE: 'Marketing', DESCRIPCION: 'Personal de publicidad y mercadeo', ACTIVO: 'N' },
    { DEP_DEPARTAMENTO: 4, NOMBRE: 'Atención al Cliente', DESCRIPCION: 'Personal de atención al cliente', ACTIVO: 'S' },
    { DEP_DEPARTAMENTO: 5, NOMBRE: 'Sistemas', DESCRIPCION: 'Personal área de tecnología', ACTIVO: 'S' },
];

const DepartamentosList = () => {
    const [departamentos, setDepartamentos] = useState(initialData);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentDepartamento, setCurrentDepartamento] = useState(null);

    const handleCreate = () => {
        setCurrentDepartamento(null);
        setModalOpen(true);
    };

    const handleEdit = (departamento) => {
        setCurrentDepartamento(departamento);
        setModalOpen(true);
    };

    const handleSave = (savedDepartamento) => {
        if (savedDepartamento.DEP_DEPARTAMENTO) {
            setDepartamentos(departamentos.map(dep =>
                dep.DEP_DEPARTAMENTO === savedDepartamento.DEP_DEPARTAMENTO ? savedDepartamento : dep
            ));
            alert('Técnico actualizado con éxito.');
        } else {
            const newId = Math.max(...departamentos.map(dep => dep.DEP_DEPARTAMENTO)) + 1;
            const newDepartamento = { ...savedDepartamento, DEP_DEPARTAMENTO: newId };
            setDepartamentos([...departamentos, newDepartamento]);
            alert('Técnico agregado con éxito.');
        }
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este departamento?')) {
            setDepartamentos(departamentos.filter(dep => dep.DEP_DEPARTAMENTO !== id));
            alert('Técnico eliminado con éxito.');
        }
    };

    return (
        <div className="catalogos-list-container">
            {/* Catálogo de Departamentos *//*}
            <div className="catalog-items-list">
                <div className="catalog-header">
                    <div><h3>Catálogo de Departamentos</h3></div>
                    <div style={{marginLeft: 'auto'}}>
                    <button onClick={handleCreate} className="btn-create">
                        <img src={addIcon} alt="Nuevo" className="action-icon-white" />
                    </button>
                    </div>
                </div>
                <div className="items-list">
                {initialData.map((dep) => (
                    <div key={dep.DEP_DEPARTAMENTO} className="item-card">
                        <div>
                            <span class="item-title">{dep.NOMBRE}</span>&nbsp;&nbsp;
                            <span className={`status-tag ${dep.ACTIVO==='S'?"active":"inactive"}`}>{dep.ACTIVO === 'S' ? 
                                            <span className="status-dot active"></span> : 
                                            <span className="status-dot inactive"></span>
                                        }
                                        {dep.ACTIVO === 'S' ? ' Activo' : ' Inactivo'}</span><br />
                            <span className="item-meta">
                                <strong>ID {dep.DEP_DEPARTAMENTO}</strong> | {dep.DESCRIPCION}
                            </span>
                        </div>
                        <div style={{marginLeft: 'auto', alignSelf: 'center'}}>
                            <button className="action-button abrir-button" onClick={() => handleEdit(dep)} data-tooltip="Detalle">
                                <center><img src={updateIcon} alt="Abrir" /></center>
                            </button> &nbsp;
                            <button className="action-button sla-button" onClick={() => handleDelete(dep.DEP_DEPARTAMENTO)} data-tooltip="SLA">
                                <center><img src={deleteIcon} alt="SLA" /></center>
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            {/* Modal para crear/editar departamentos *//*}    
            {modalOpen && (
                <DepartamentoModal
                    departamento={currentDepartamento}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default DepartamentosList;*/
// DepartamentosList.js

// DepartamentosList.js

import React, { useState, useEffect } from 'react';
import DepartamentoModal from './DepartamentoModal'; 
import axios from 'axios'; 
import './Catalogos.css';

// Importar iconos (ajusta las rutas si es necesario)
import updateIcon from '../../../../Iconos/editar.png';
import deleteIcon from '../../../../Iconos/eliminar.png';
import addIcon from '../../../../Iconos/add.png';

const API_URL = 'http://localhost:4000/api/departamentos'; 

const DepartamentosList = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentDepartamento, setCurrentDepartamento] = useState(null); 
    const [mensaje, setMensaje] = useState('');

    const getErrorMessage = (error, defaultMsg) => {
        return error.response?.data?.error || error.message || defaultMsg;
    };
    
    const fetchDepartamentos = async () => { 
        setMensaje('');
        try {
            const response = await axios.get(API_URL); 
            setDepartamentos(response.data || []); 
        } catch (error) {
            const msg = getErrorMessage(error, "Error al cargar los departamentos. Revise el backend.");
            setMensaje(`Error: ${msg}`);
            console.error("Error al cargar departamentos:", error);
        }
    };

    useEffect(() => {
        fetchDepartamentos(); 
    }, []);

    const handleCreate = () => {
        setCurrentDepartamento(null); 
        setModalOpen(true);
        setMensaje('');
    };

    const handleEdit = (departamento) => {
        setCurrentDepartamento(departamento); 
        setModalOpen(true);
        setMensaje('');
    };

    const handleSave = async (savedData) => {
        setMensaje('');
        setModalOpen(false); 

        const idToUpdate = savedData.ID; 
        
        const dataToSend = {
            DEP_NOMBRE: savedData.NOMBRE,
            DEP_UBICACION: savedData.UBICACION,
            DEP_ACTIVO: savedData.ACTIVO, // <-- ¡Se envía el estado para PUT!
        };
        
        try {
            if (idToUpdate) {
                // OPERACIÓN UPDATE (PUT)
                await axios.put(`${API_URL}/${idToUpdate}`, dataToSend);
                setMensaje('Departamento actualizado con éxito.');
            } else {
                // OPERACIÓN CREATE (POST)
                // Solo enviamos NOMBRE y UBICACION. El backend asigna el ID y ACTIVO='S' por defecto.
                await axios.post(API_URL, {
                    DEP_NOMBRE: savedData.NOMBRE,
                    DEP_UBICACION: savedData.UBICACION
                });
                setMensaje('Departamento creado con éxito.');
            }

            fetchDepartamentos(); 
        } catch (error) {
            const msg = getErrorMessage(error, "Error al guardar el departamento.");
            setMensaje(`Error: ${msg}`);
            console.error("Error en handleSave:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres INACTIVAR este departamento? (Borrado Suave)')) {
            setMensaje('');
            try {
                await axios.delete(`${API_URL}/${id}`); 
                setMensaje('Departamento inactivado con éxito.');
                fetchDepartamentos(); 
            } catch (error) {
                const msg = getErrorMessage(error, "Error al inactivar el departamento.");
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
                    <div><h3>Catálogo de Departamentos</h3></div>
                    <div style={{marginLeft: 'auto'}}>
                        <button onClick={handleCreate} className="btn-create">
                            <img src={addIcon} alt="Nuevo" className="action-icon-white" />
                        </button>
                    </div>
                </div>
                <div className="items-list">
                    {departamentos.map((dep) => ( 
                        <div key={dep.ID} className="item-card">
                            <div>
                                <span className="item-title">{dep.NOMBRE}</span>
                                <br />
                                <span className="item-meta">
                                    <strong>ID: {dep.ID}</strong> | Ubicación: {dep.UBICACION || 'N/A'} 
                                </span>
                            </div>
                            <div style={{marginLeft: 'auto', alignSelf: 'center'}}>
                                <button className="action-button abrir-button" onClick={() => handleEdit(dep)} data-tooltip="Editar">
                                    <center><img src={updateIcon} alt="Editar" /></center>
                                </button> &nbsp;
                                <button className="action-button sla-button" onClick={() => handleDelete(dep.ID)} data-tooltip="Inactivar">
                                    <center><img src={deleteIcon} alt="Inactivar" /></center>
                                </button>
                            </div>
                        </div>
                    ))}
                    {departamentos.length === 0 && <p style={{padding: '10px'}}>No hay departamentos activos.</p>}
                </div>
            </div>
            
            {modalOpen && (
                <DepartamentoModal
                    departamento={currentDepartamento} 
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default DepartamentosList;