/*import React, { useState, useEffect } from 'react';
import './Catalogos.css';
import guardarIcon from '../../../../Iconos/guardar.png';
import cancelarIcon from '../../../../Iconos/cancelar.png';

const DepartamentoModal = ({ departamento, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        activo: 'S'
    });

    useEffect(() => {
        if (departamento) {
            setFormData({
                nombre: departamento.NOMBRE,
                descripcion: departamento.DESCRIPCION,
                activo: departamento.ACTIVO
            });
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                activo: 'S'
            });
        }
    }, [departamento]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, DEP_DEPARTAMENTO: departamento ? departamento.DEP_DEPARTAMENTO : null });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{departamento ? 'Editar Departamento' : 'Agregar Departamento'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <input type="text" name="correo" value={formData.descripcion} onChange={handleChange} required />
                    </div>                    
                    <div className="form-group radio-group">
                        <label>Estado</label>
                        <div className="radio-options">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="activo"
                                    value="S"
                                    checked={formData.activo === 'S'}
                                    onChange={handleChange}
                                />
                                Activo
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="activo"
                                    value="N"
                                    checked={formData.activo === 'N'}
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

export default DepartamentoModal;*/

// DepartamentoModal.js

// DepartamentoModal.js
// DepartamentoModal.js
import React, { useState, useEffect } from 'react';
import './Catalogos.css';
import guardarIcon from '../../../../Iconos/guardar.png';
import cancelarIcon from '../../../../Iconos/cancelar.png';

const DepartamentoModal = ({ departamento, onSave, onClose }) => { 
    const [formData, setFormData] = useState({
        ID: null,        
        NOMBRE: '',      
        UBICACION: '',   
        ACTIVO: 'S',     // Inicializado en 'S'
    });
    
    const isEditing = !!departamento; 

    useEffect(() => {
        if (isEditing) {
            setFormData({
                ID: departamento.ID, 
                NOMBRE: departamento.NOMBRE || '', 
                UBICACION: departamento.UBICACION || '',
                ACTIVO: departamento.ACTIVO || 'S', 
            });
        } else {
             setFormData({
                ID: null,
                NOMBRE: '',
                UBICACION: '',
                ACTIVO: 'S', // Por defecto en creación
            });
        }
    }, [departamento, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.NOMBRE.trim()) {
            alert('El Nombre del Departamento es obligatorio.');
            return;
        }

        onSave({ 
            ...formData
        });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{maxWidth: '500px'}}>
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{isEditing ? 'Editar Departamento' : 'Crear Nuevo Departamento'}</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* Campo NOMBRE */}
                    <div className="form-group">
                        <label>Nombre del Departamento (*)</label>
                        <input 
                            type="text" 
                            name="NOMBRE" 
                            value={formData.NOMBRE} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    {/* Campo UBICACION */}
                    <div className="form-group">
                        <label>Ubicación</label>
                        <input 
                            type="text" 
                            name="UBICACION" 
                            value={formData.UBICACION} 
                            onChange={handleChange} 
                        />
                    </div>

                    {/* CAMPO ACTIVO: Usando la clase .radio-group y .radio-options */}
                    <div className="form-group radio-group">
                        <label>Activo (*)</label>
                        <div className="radio-options">
                            
                            {/* Opción SÍ (S) */}
                            <label className="radio-label">
                                <input 
                                    type="radio" 
                                    name="ACTIVO" 
                                    value="S" 
                                    checked={formData.ACTIVO === 'S'}
                                    onChange={handleChange}
                                />
                                Sí (S)
                            </label>

                            {/* Opción NO (N) */}
                            <label className="radio-label">
                                <input 
                                    type="radio" 
                                    name="ACTIVO" 
                                    value="N" 
                                    checked={formData.ACTIVO === 'N'}
                                    onChange={handleChange}
                                />
                                No (N)
                            </label>
                        </div>
                    </div>

                    <div className="form-buttons-icons">
                        <button type="submit" className="btn-action-icon" style={{border: 'none', background: 'none', cursor: 'pointer'}}>
                            <img src={guardarIcon} alt="Guardar" className="btn-action-icon" data-tooltip="Guardar"/>
                        </button>
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
