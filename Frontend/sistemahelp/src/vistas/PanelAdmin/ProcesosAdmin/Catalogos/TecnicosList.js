import React, { useState } from 'react';
import TecnicoModal from './TecnicoModal';
import './Catalogos.css';

// Importar iconos (asegúrate de que estas rutas sean correctas)
import updateIcon from '../../../../Iconos/editar.png';
import deleteIcon from '../../../../Iconos/eliminar.png';
import addIcon from '../../../../Iconos/add.png'


const initialData = [
    { TEC_TECNICO: 1, NOMBRE: 'Carlos García', CORREO: 'carlos.g@email.com', TELEFONO: '555-1234', EXTENSION: '1001', EQUIPO: '1', ACTIVO: 'S' },
    { TEC_TECNICO: 2, NOMBRE: 'Ana López', CORREO: 'ana.l@email.com', TELEFONO: '555-5678', EXTENSION: '1002', EQUIPO: '2', ACTIVO: 'S' },
    { TEC_TECNICO: 3, NOMBRE: 'Luis Pérez', CORREO: 'luis.p@email.com', TELEFONO: '555-9012', EXTENSION: '1003', EQUIPO: '3', ACTIVO: 'N' },
    { TEC_TECNICO: 4, NOMBRE: 'Marta Diaz', CORREO: 'marta.d@email.com', TELEFONO: '555-1122', EXTENSION: '1004', EQUIPO: '4', ACTIVO: 'S' },
    { TEC_TECNICO: 5, NOMBRE: 'Juan Ramos', CORREO: 'juan.r@email.com', TELEFONO: '555-3344', EXTENSION: '1005', EQUIPO: '5', ACTIVO: 'S' },
];

const TecnicosList = () => {
    const [tecnicos, setTecnicos] = useState(initialData);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTecnico, setCurrentTecnico] = useState(null);

    const handleCreate = () => {
        setCurrentTecnico(null);
        setModalOpen(true);
    };

    const handleEdit = (tecnico) => {
        setCurrentTecnico(tecnico);
        setModalOpen(true);
    };

    const handleSave = (savedTecnico) => {
        if (savedTecnico.TEC_TECNICO) {
            setTecnicos(tecnicos.map(tec =>
                tec.TEC_TECNICO === savedTecnico.TEC_TECNICO ? savedTecnico : tec
            ));
            alert('Técnico actualizado con éxito.');
        } else {
            const newId = Math.max(...tecnicos.map(tec => tec.TEC_TECNICO)) + 1;
            const newTecnico = { ...savedTecnico, TEC_TECNICO: newId };
            setTecnicos([...tecnicos, newTecnico]);
            alert('Técnico agregado con éxito.');
        }
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este técnico?')) {
            setTecnicos(tecnicos.filter(tec => tec.TEC_TECNICO !== id));
            alert('Técnico eliminado con éxito.');
        }
    };

    return (
        <div className="catalogos-list-container">
            {/* Catálogo de Técnicos */}
            <div className="catalog-items-list">
                <div className="catalog-header">
                    <div><h3>Catálogo de Técnicos</h3></div>
                    <div style={{marginLeft: 'auto'}}>
                    <button onClick={handleCreate} className="btn-create">
                        <img src={addIcon} alt="Nuevo" className="action-icon-white" />
                    </button>
                    </div>
                </div>
                <div className="items-list">
                {initialData.map((tec) => (
                    <div key={tec.TEC_TECNICO} className="item-card">
                        <div>
                            <span class="item-title">{tec.NOMBRE}</span>&nbsp;&nbsp;
                            <span className={`status-tag ${tec.ACTIVO==='S'?"active":"inactive"}`}>{tec.ACTIVO === 'S' ? 
                                            <span className="status-dot active"></span> : 
                                            <span className="status-dot inactive"></span>
                                        }
                                        {tec.ACTIVO === 'S' ? ' Activo' : ' Inactivo'}</span><br />
                            <span className="item-meta">
                                <strong>ID {tec.TEC_TECNICO}</strong> | {tec.CORREO} | {tec.TELEFONO}
                            </span>
                        </div>
                        <div style={{marginLeft: 'auto', alignSelf: 'center'}}>
                            <button className="action-button abrir-button" onClick={() => handleEdit(tec)} data-tooltip="Detalle">
                                <center><img src={updateIcon} alt="Abrir" /></center>
                            </button> &nbsp;
                            <button className="action-button sla-button" onClick={() => handleDelete(tec.TEC_TECNICO)} data-tooltip="SLA">
                                <center><img src={deleteIcon} alt="SLA" /></center>
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            {/* Modal para crear/editar técnicos */}    
            {modalOpen && (
                <TecnicoModal
                    tecnico={currentTecnico}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default TecnicosList;