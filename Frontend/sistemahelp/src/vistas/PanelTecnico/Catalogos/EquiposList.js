import React, { useState } from 'react';
import EquipoModal from './EquipoModal';
import './Catalogos.css';

const initialData = [
    { TCE_TECNICOEQUIPO: 1, TEC_TECNICO: 1, ETI_EQUIPOTI: 'Laptop Lenovo', DESDE: '2024-01-15', HASTA: '2025-01-15', ES_PRINCIPAL: 'S' },
    { TCE_TECNICOEQUIPO: 2, TEC_TECNICO: 2, ETI_EQUIPOTI: 'Smartphone Samsung', DESDE: '2024-03-20', HASTA: '', ES_PRINCIPAL: 'S' },
];

const EquiposList = () => {
    const [equipos, setEquipos] = useState(initialData);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentEquipo, setCurrentEquipo] = useState(null);

    const handleCreate = () => {
        setCurrentEquipo(null);
        setModalOpen(true);
    };

    const handleEdit = (equipo) => {
        setCurrentEquipo(equipo);
        setModalOpen(true);
    };

    const handleSave = (savedEquipo) => {
        if (savedEquipo.TCE_TECNICOEQUIPO) {
            setEquipos(equipos.map(eq =>
                eq.TCE_TECNICOEQUIPO === savedEquipo.TCE_TECNICOEQUIPO ? savedEquipo : eq
            ));
        } else {
            const newId = Math.max(...equipos.map(eq => eq.TCE_TECNICOEQUIPO)) + 1;
            const newEquipo = { ...savedEquipo, TCE_TECNICOEQUIPO: newId };
            setEquipos([...equipos, newEquipo]);
        }
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta asignación de equipo?')) {
            setEquipos(equipos.filter(eq => eq.TCE_TECNICOEQUIPO !== id));
        }
    };

    return (
        <div className="list-container">
            <h3>Catálogo de Asignación de Equipos</h3>
            <button onClick={handleCreate} className="btn-create">
                <i className="icon-plus"></i> Asignar Equipo
            </button>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID Técnico</th>
                        <th>Equipo</th>
                        <th>Desde</th>
                        <th>Hasta</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {equipos.map((eq) => (
                        <tr key={eq.TCE_TECNICOEQUIPO}>
                            <td>{eq.TEC_TECNICO}</td>
                            <td>{eq.ETI_EQUIPOTI}</td>
                            <td>{eq.DESDE}</td>
                            <td>{eq.HASTA || 'Actual'}</td>
                            <td>
                                <button onClick={() => handleEdit(eq)} className="btn-action edit">
                                    <i className="icon-edit"></i>
                                </button>
                                <button onClick={() => handleDelete(eq.TCE_TECNICOEQUIPO)} className="btn-action delete">
                                    <i className="icon-delete"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalOpen && (
                <EquipoModal
                    equipo={currentEquipo}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default EquiposList;