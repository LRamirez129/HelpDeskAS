import React, { useState } from 'react';
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