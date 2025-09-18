import React, { useState, useEffect } from 'react';
import './Catalogos.css';

const EquipoModal = ({ equipo, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        TEC_TECNICO: '',
        ETI_EQUIPOTI: '',
        DESDE: '',
        HASTA: '',
        ES_PRINCIPAL: 'N'
    });

    useEffect(() => {
        if (equipo) {
            setFormData({
                TEC_TECNICO: equipo.TEC_TECNICO,
                ETI_EQUIPOTI: equipo.ETI_EQUIPOTI,
                DESDE: equipo.DESDE,
                HASTA: equipo.HASTA,
                ES_PRINCIPAL: equipo.ES_PRINCIPAL
            });
        } else {
            setFormData({ TEC_TECNICO: '', ETI_EQUIPOTI: '', DESDE: '', HASTA: '', ES_PRINCIPAL: 'N' });
        }
    }, [equipo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, TCE_TECNICOEQUIPO: equipo ? equipo.TCE_TECNICOEQUIPO : null });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{equipo ? 'Editar Asignación' : 'Asignar Equipo'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>ID Técnico</label>
                        <input type="number" name="TEC_TECNICO" value={formData.TEC_TECNICO} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Equipo</label>
                        <input type="text" name="ETI_EQUIPOTI" value={formData.ETI_EQUIPOTI} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Desde</label>
                        <input type="date" name="DESDE" value={formData.DESDE} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Hasta</label>
                        <input type="date" name="HASTA" value={formData.HASTA} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Principal</label>
                        <select name="ES_PRINCIPAL" value={formData.ES_PRINCIPAL} onChange={handleChange}>
                            <option value="S">Sí</option>
                            <option value="N">No</option>
                        </select>
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

export default EquipoModal;