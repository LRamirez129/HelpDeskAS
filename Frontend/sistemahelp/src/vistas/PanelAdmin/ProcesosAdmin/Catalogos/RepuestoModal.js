import React, { useState, useEffect } from 'react';
import './Catalogos.css';
import guardarIcon from '../../../../Iconos/guardar.png';
import cancelarIcon from '../../../../Iconos/cancelar.png';

const RepuestoModal = ({ repuesto, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        activo: 'S'
    });

    useEffect(() => {
        if (repuesto) {
            setFormData({
                sku: repuesto.SKU,
                nombre: repuesto.NOMBRE,
                descripcion: repuesto.DESCRIPCION,
                costounitario: repuesto.COSTOUNITARIO,
                moneda: repuesto.MONEDA,
                activo: repuesto.ACTIVO
            });
        } else {
            setFormData({
                sku:'',
                nombre: '',
                descripcion: '',
                costounitario: 0.00,
                moneda: 'GTQ',
                activo: 'S'
            });
        }
    }, [repuesto]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, REP_REPUESTO: repuesto ? repuesto.REP_REPUESTO : null });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{repuesto ? 'Editar Repuesto' : 'Agregar Repuesto'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>SKU</label>
                            <input type="text" name="sku" value={formData.sku} onChange={handleChange} required />
                        </div>      
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <input type="text" name="correo" value={formData.descripcion} onChange={handleChange} required />
                    </div>  
                    <div className='form-row'>
                        <div className="form-group">
                            <label>Costo Unitario</label>
                            <input type="number" name="costounitario" value={formData.costounitario} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Moneda</label>
                            <input type="text" name="moneda" value={formData.moneda} onChange={handleChange} required />
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

export default RepuestoModal;