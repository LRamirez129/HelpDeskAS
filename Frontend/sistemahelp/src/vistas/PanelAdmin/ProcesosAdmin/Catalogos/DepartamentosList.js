import React, { useState, useEffect } from 'react';
import { createDepartamento } from '../../../../utilitarios/modelos/departamentoModel';
import DepartamentoModal from './DepartamentoModal';
import './Catalogos.css';

// Importar iconos (asegúrate de que estas rutas sean correctas)
import updateIcon from '../../../../Iconos/editar.png';
import deleteIcon from '../../../../Iconos/eliminar.png';
import addIcon from '../../../../Iconos/add.png'

const DepartamentosList = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentDepartamento, setCurrentDepartamento] = useState(null);

    const fetchDepartamentos = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/read?entidad=DEPARTAMENTO');
            if (!response.ok) throw new Error('Error al obtener departamentos');
            let data = await response.json();
            // Estandariza cada objeto usando el modelo
            data = data.map(dep => createDepartamento(dep));
            setDepartamentos(data);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        fetchDepartamentos();
    }, []);

    const handleCreate = () => {
        setCurrentDepartamento(null);
        setModalOpen(true);
    };

    const handleEdit = (departamento) => {
        setCurrentDepartamento(departamento);
        setModalOpen(true);
    };

    const handleSave = (savedDepartamento) => {
        fetchDepartamentos();
        setModalOpen(false);
    };

    const handleDelete = async (id) => {
        const departamento = departamentos.find(dep => dep.DEP_DEPARTAMENTO === id);
        if (!departamento) return;
        if (window.confirm('¿Estás seguro de que quieres eliminar este departamento?')) {
            try {
                const response = await fetch('http://localhost:4000/api/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(departamento)
                });
                if (!response.ok) throw new Error('Error al eliminar el departamento');
                fetchDepartamentos();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return (
        <div className="catalogos-list-container">
            {/* Catálogo de Departamentos */}
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
                    <div key={dep.DEP_DEPARTAMENTO} className="item-card">
                        <div>
                            <span className="item-title">{dep.DEP_NOMBRE}</span>&nbsp;&nbsp;
                            <span className={`status-tag ${dep.DEP_ACTIVO==='S'?"active":"inactive"}`}>{dep.DEP_ACTIVO === 'S' ? 
                                            <span className="status-dot active"></span> : 
                                            <span className="status-dot inactive"></span>
                                        }
                                        {dep.DEP_ACTIVO === 'S' ? ' Activo' : ' Inactivo'}</span><br />
                            <span className="item-meta">
                                <strong>ID {dep.DEP_DEPARTAMENTO}</strong> | {dep.DEP_UBICACION}
                            </span>
                        </div>
                        <div style={{marginLeft: 'auto', alignSelf: 'center'}}>
                            <button className="action-button abrir-button" onClick={() => handleEdit(dep)} data-tooltip="Detalle">
                                <center><img src={updateIcon} alt="Abrir" /></center>
                            </button> &nbsp;
                            <button className="action-button sla-button" onClick={() => handleDelete(dep.DEP_DEPARTAMENTO)} data-tooltip="Eliminar">
                                <center><img src={deleteIcon} alt="Eliminar" /></center>
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            {/* Modal para crear/editar departamentos */}    
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