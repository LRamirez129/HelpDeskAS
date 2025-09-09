import React, { useState, useEffect } from 'react';
import './Catalogos.css';

const HabilidadModal = ({ habilidad, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        TEC_TECNICO: '',
        HAB_HABILIDAD: '',
        NIVEL: 1,
        CERTIFICADO: 'N',
        NOTAS: ''
    });

    useEffect(() => {
        if (habilidad) {
            setFormData({
                TEC_TECNICO: habilidad.TEC_TECNICO,
                HAB_HABILIDAD: habilidad.HAB_HABILIDAD,
                NIVEL: habilidad.NIVEL,
                CERTIFICADO: habilidad.CERTIFICADO,
                NOTAS: habilidad.NOTAS
            });
        } else {
            setFormData({ TEC_TECNICO: '', HAB_HABILIDAD: '', NIVEL: 1, CERTIFICADO: 'N', NOTAS: '' });
        }
    }, [habilidad]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, THA_TECNICOHABILIDAD: habilidad ? habilidad.THA_TECNICOHABILIDAD : null });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{habilidad ? 'Editar Habilidad' : 'Añadir Habilidad'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>ID Técnico</label>
                        <input type="number" name="TEC_TECNICO" value={formData.TEC_TECNICO} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Habilidad</label>
                        <input type="text" name="HAB_HABILIDAD" value={formData.HAB_HABILIDAD} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Nivel</label>
                        <input type="number" name="NIVEL" value={formData.NIVEL} onChange={handleChange} min="1" max="5" required />
                    </div>
                    <div className="form-group">
                        <label>Certificado</label>
                        <select name="CERTIFICADO" value={formData.CERTIFICADO} onChange={handleChange}>
                            <option value="S">Sí</option>
                            <option value="N">No</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Notas</label>
                        <textarea name="NOTAS" value={formData.NOTAS} onChange={handleChange} />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="btn-primary">
                            <i className="icon-save"></i> Guardar
                        </button>
                        <button type="button" onClick={onClose} className="btn-secondary">
                            <i className="icon-cancel"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabilidadModal;