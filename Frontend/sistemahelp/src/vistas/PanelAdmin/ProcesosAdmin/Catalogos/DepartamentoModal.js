import React, { useState, useEffect } from 'react';
import { createDepartamento } from '../../../../utilitarios/modelos/departamentoModel';
import './Catalogos.css';
import guardarIcon from '../../../../Iconos/guardar.png';
import cancelarIcon from '../../../../Iconos/cancelar.png';

const DepartamentoModal = ({ departamento, onSave, onClose }) => {
    const [formData, setFormData] = useState(createDepartamento());

    useEffect(() => {
        if (departamento) {
            setFormData(createDepartamento(departamento));
        } else {
            setFormData(createDepartamento());
        }
    }, [departamento]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name === 'nombre' ? 'DEP_NOMBRE' : name === 'ubicacion' ? 'DEP_UBICACION' : name === 'activo' ? 'DEP_ACTIVO' : name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let apiUrl = 'http://localhost:4000/api/create';
            let updateData = { ...formData };
            if (departamento?.DEP_DEPARTAMENTO) {
                updateData.DEP_DEPARTAMENTO = departamento.DEP_DEPARTAMENTO;
                apiUrl = 'http://localhost:4000/api/update';
            }
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });
            if (!response.ok) throw new Error('Error al guardar el departamento');
            const data = await response.json();
            onSave(data);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{departamento ? 'Editar Departamento' : 'Agregar Departamento'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" name="nombre" value={formData.DEP_NOMBRE} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Ubicacion</label>
                        <input type="text" name="ubicacion" value={formData.DEP_UBICACION} onChange={handleChange} required />
                    </div>
                    <div className="form-group radio-group">
                        <label>Estado</label>
                        <div className="radio-options">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="activo"
                                    value="S"
                                    checked={formData.DEP_ACTIVO === 'S'}
                                    onChange={handleChange}
                                />
                                Activo
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="activo"
                                    value="N"
                                    checked={formData.DEP_ACTIVO === 'N'}
                                    onChange={handleChange}
                                />
                                Inactivo
                            </label>
                        </div>
                    </div>
                    <div className="form-buttons-icons">
                        <img
                            src={guardarIcon}
                            alt="Guardar"
                            className="btn-action-icon"
                            data-tooltip="Guardar"
                            onClick={handleSubmit}
                        />
                        <img
                            src={cancelarIcon}
                            alt="Cancelar"
                            className="btn-action-icon"
                            data-tooltip="Cancelar"
                            onClick={onClose}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartamentoModal;