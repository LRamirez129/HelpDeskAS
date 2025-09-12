import React, { useState } from 'react';
import TecnicoModal from './TecnicoModal';
import './Catalogos.css';

// Importar iconos (asegúrate de que estas rutas sean correctas)
import updateIcon from '../../../Iconos/editar.png';
import deleteIcon from '../../../Iconos/eliminar.png';

const initialData = [
    { TEC_TECNICO: 1, NOMBRE: 'Carlos García', CORREO: 'carlos.g@email.com', TELEFONO: '555-1234', EXTENSION: '101', ACTIVO: 'S' },
    { TEC_TECNICO: 2, NOMBRE: 'Ana López', CORREO: 'ana.l@email.com', TELEFONO: '555-5678', EXTENSION: '102', ACTIVO: 'S' },
    { TEC_TECNICO: 3, NOMBRE: 'Luis Pérez', CORREO: 'luis.p@email.com', TELEFONO: '555-9012', EXTENSION: '103', ACTIVO: 'N' },
    { TEC_TECNICO: 4, NOMBRE: 'Marta Diaz', CORREO: 'marta.d@email.com', TELEFONO: '555-1122', EXTENSION: '104', ACTIVO: 'S' },
    { TEC_TECNICO: 5, NOMBRE: 'Juan Ramos', CORREO: 'juan.r@email.com', TELEFONO: '555-3344', EXTENSION: '105', ACTIVO: 'S' },
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
        <div className="tecnicos-list-container">
            <h3>Catálogo de Técnicos</h3>
            <button onClick={handleCreate} className="btn-create">
                Añadir Nuevo Técnico
            </button>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tecnicos.map((tec) => (
                        <tr key={tec.TEC_TECNICO}>
                            <td>{tec.NOMBRE}</td>
                            <td>{tec.CORREO}</td>
                            <td>{tec.TELEFONO}</td>
                            <td>
                                {tec.ACTIVO === 'S' ? 
                                    <span className="status-dot active"></span> : 
                                    <span className="status-dot inactive"></span>
                                }
                                {tec.ACTIVO === 'S' ? ' Activo' : ' Inactivo'}
                            </td>
                            <td>
                                <div className="action-buttons-container">
                                    <button 
                                        onClick={() => handleEdit(tec)} 
                                        className="btn-action edit"
                                        data-tooltip="Actualizar"
                                    >
                                        <img src={updateIcon} alt="Editar" className="action-icon" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(tec.TEC_TECNICO)} 
                                        className="btn-action delete"
                                        data-tooltip="Eliminar"
                                    >
                                        <img src={deleteIcon} alt="Eliminar" className="action-icon" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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