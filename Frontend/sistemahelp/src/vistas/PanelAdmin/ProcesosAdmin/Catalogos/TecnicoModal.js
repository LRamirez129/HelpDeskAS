import React, { useState, useEffect } from 'react';
import './Catalogos.css';
import guardarIcon from '../../../../Iconos/guardar.png';
import cancelarIcon from '../../../../Iconos/cancelar.png';

const TecnicoModal = ({ tecnico, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        extension: '',
        equipo: '',
        activo: 'S'
    });

    useEffect(() => {
        if (tecnico) {
            setFormData({
                nombre: tecnico.NOMBRE,
                correo: tecnico.CORREO,
                telefono: tecnico.TELEFONO,
                extension: tecnico.EXTENSION,
                equipo: tecnico.EQUIPO,
                activo: tecnico.ACTIVO
            });
        } else {
            setFormData({
                nombre: '',
                correo: '',
                telefono: '',
                extension: '',
                equipo: '',
                activo: 'S'
            });
        }
    }, [tecnico]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, TEC_TECNICO: tecnico ? tecnico.TEC_TECNICO : null });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{tecnico ? 'Editar Técnico' : 'Agregar Técnico'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Correo</label>
                        <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Extensión</label>
                            <input type="text" name="extension" value={formData.extension} onChange={handleChange} />
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className='form-group'>
                            <label>Equipo resolutor</label>
                            <select name="Equipo" value={formData.equipo} onChange={handleChange}>
                                <option value="">-- Seleccionar --</option>
                                <option value="1">Help Desk</option>
                                <option value="2">Hardware</option>
                                <option value="3">Sistemas</option>
                                <option value="4">Bases de Datos</option>
                                <option value="5">Redes e infraestructura</option>
                                {/* Agrega más opciones aquí si es necesario */}
                            </select>
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

export default TecnicoModal;