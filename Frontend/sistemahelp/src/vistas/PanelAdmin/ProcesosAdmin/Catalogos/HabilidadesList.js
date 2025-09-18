import React, { useState } from 'react';
import HabilidadModal from './HabilidadModal';
import './Catalogos.css';

const initialData = [
    { THA_TECNICOHABILIDAD: 1, TEC_TECNICO: 1, HAB_HABILIDAD: 'Java', NIVEL: 5, CERTIFICADO: 'S', NOTAS: 'Experto en Spring' },
    { THA_TECNICOHABILIDAD: 2, TEC_TECNICO: 2, HAB_HABILIDAD: 'Redes', NIVEL: 4, CERTIFICADO: 'N', NOTAS: 'Configuración de switches' },
];

const HabilidadesList = () => {
    const [habilidades, setHabilidades] = useState(initialData);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentHabilidad, setCurrentHabilidad] = useState(null);

    const handleCreate = () => {
        setCurrentHabilidad(null);
        setModalOpen(true);
    };

    const handleEdit = (habilidad) => {
        setCurrentHabilidad(habilidad);
        setModalOpen(true);
    };

    const handleSave = (savedHabilidad) => {
        if (savedHabilidad.THA_TECNICOHABILIDAD) {
            setHabilidades(habilidades.map(hab =>
                hab.THA_TECNICOHABILIDAD === savedHabilidad.THA_TECNICOHABILIDAD ? savedHabilidad : hab
            ));
        } else {
            const newId = Math.max(...habilidades.map(hab => hab.THA_TECNICOHABILIDAD)) + 1;
            const newHabilidad = { ...savedHabilidad, THA_TECNICOHABILIDAD: newId };
            setHabilidades([...habilidades, newHabilidad]);
        }
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta habilidad?')) {
            setHabilidades(habilidades.filter(hab => hab.THA_TECNICOHABILIDAD !== id));
        }
    };

    return (
        <div className="list-container">
            <h3>Catálogo de Habilidades</h3>
            <button onClick={handleCreate} className="btn-create">
                <i className="icon-plus"></i> Añadir Habilidad
            </button>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID Técnico</th>
                        <th>Habilidad</th>
                        <th>Nivel</th>
                        <th>Certificado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {habilidades.map((hab) => (
                        <tr key={hab.THA_TECNICOHABILIDAD}>
                            <td>{hab.TEC_TECNICO}</td>
                            <td>{hab.HAB_HABILIDAD}</td>
                            <td>{hab.NIVEL}</td>
                            <td>{hab.CERTIFICADO === 'S' ? 'Sí' : 'No'}</td>
                            <td>
                                <button onClick={() => handleEdit(hab)} className="btn-action edit">
                                    <i className="icon-edit"></i>
                                </button>
                                <button onClick={() => handleDelete(hab.THA_TECNICOHABILIDAD)} className="btn-action delete">
                                    <i className="icon-delete"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalOpen && (
                <HabilidadModal
                    habilidad={currentHabilidad}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default HabilidadesList;