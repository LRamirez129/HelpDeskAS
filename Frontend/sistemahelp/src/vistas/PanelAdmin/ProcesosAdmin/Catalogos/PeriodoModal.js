// PeriodoModal.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// 🚨 Importar los iconos de Guardar y Cancelar
import guardarIcon from '../../../../Iconos/guardar.png';
import cancelarIcon from '../../../../Iconos/cancelar.png';
// Opcional: Si necesitas más estilos específicos, puedes importarlos aquí
import './Catalogos.css'; 

// ⚙️ URL Base de tu API (Asegúrate que el puerto sea correcto)
const API_URL = 'http://localhost:4000/api/periodos'; 

const PeriodoModal = ({ isOpen, isEditing, initialData, onClose, setError }) => {
    const [form, setForm] = useState(initialData);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setForm(initialData);
    }, [initialData]);
    
    if (!isOpen) return null;
    
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        // Manejo de radio buttons y otros inputs
        const newValue = (type === 'radio' && name === 'PER_Activo') ? value : value;
        
        setForm({
            ...form,
            [name]: newValue,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const dataToSend = { ...form };
        const method = isEditing ? 'put' : 'post';
        const url = isEditing ? `${API_URL}/${form.PER_Periodo}` : API_URL;

        try {
            await axios({ method, url, data: dataToSend });
            alert(`Período ${isEditing ? 'actualizado' : 'creado'} con éxito.`);
            onClose(true); // Cierra y notifica refresco
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            setError('Error al guardar: ' + errorMessage); 
        } finally {
            setLoading(false);
        }
    };

    return (
        // Clase principal del fondo del modal
        <div className="modal-backdrop"> 
            
            {/* Clase del contenedor principal del contenido del modal */}
            <div className="modal-content"> 
                
                {/* Título y botón de cierre */}
                <h2>{isEditing ? `Editar Período ${form.PER_Periodo}` : 'Crear Nuevo Período'}</h2>
                <span onClick={() => onClose(false)} className="close-button" role="button" tabIndex="0">
                    &times;
                </span>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* FILA 1: Nombre */}
                    <div className="form-row">
                        <div className="form-group"> 
                            <label htmlFor="PER_Nombre">Nombre (*)</label>
                            <input 
                                type="text" 
                                id="PER_Nombre" 
                                name="PER_Nombre" 
                                value={form.PER_Nombre} 
                                onChange={handleChange} 
                                required 
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* FILA 2: Fechas (Usando form-row para que queden lado a lado) */}
                    <div className="form-row">
                        {/* Fecha Desde */}
                        <div className="form-group"> 
                            <label htmlFor="PER_FechaDesde">Fecha Desde (*)</label>
                            <input 
                                type="date" 
                                id="PER_FechaDesde" 
                                name="PER_FechaDesde" 
                                value={form.PER_FechaDesde} 
                                onChange={handleChange} 
                                required 
                                disabled={loading}
                            />
                        </div>

                        {/* Fecha Hasta */}
                        <div className="form-group"> 
                            <label htmlFor="PER_FechaHasta">Fecha Hasta</label>
                            <input 
                                type="date" 
                                id="PER_FechaHasta" 
                                name="PER_FechaHasta" 
                                value={form.PER_FechaHasta} 
                                onChange={handleChange} 
                                disabled={loading}
                            />
                        </div>
                    </div>
                    
                    {/* FILA 3: Descripción */}
                    <div className="form-row">
                        <div className="form-group"> 
                            <label htmlFor="PER_Descripcion">Descripción</label>
                            <textarea 
                                id="PER_Descripcion" 
                                name="PER_Descripcion" 
                                value={form.PER_Descripcion} 
                                onChange={handleChange} 
                                rows="3"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* FILA 4: Activo (Botones de Radio) */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Activo (*)</label> 
                            
                            {/* Clase de grupo de radio buttons */}
                            <div className="radio-group">
                                {/* Contenedor de las opciones para que se muestren en línea */}
                                <div className="radio-options">
                                    <label htmlFor="activoS" className="radio-label">
                                        <input
                                            type="radio"
                                            id="activoS"
                                            name="PER_Activo"
                                            value="S"
                                            checked={form.PER_Activo === 'S'}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        Sí (S)
                                    </label>
                                    
                                    <label htmlFor="activoN" className="radio-label">
                                        <input
                                            type="radio"
                                            id="activoN"
                                            name="PER_Activo"
                                            value="N"
                                            checked={form.PER_Activo === 'N'}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        No (N)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 🚨 PIE DE MODAL: Botones de acción con iconos */}
                    <div className="form-buttons-icons">
                        {/* Botón de Guardar */}
                        <button type="submit" className="btn-action-icon" style={{border: 'none', background: 'none', cursor: 'pointer'}} disabled={loading}>
                            <img 
                                src={guardarIcon} 
                                alt="Guardar" 
                                className="btn-action-icon" 
                                data-tooltip={isEditing ? 'Actualizar' : 'Guardar'}
                            />
                        </button>
                        
                        {/* Botón de Cancelar */}
                        <img 
                            src={cancelarIcon} 
                            alt="Cancelar" 
                            className="btn-action-icon"
                            data-tooltip="Cancelar"
                            onClick={() => onClose(false)}
                            style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PeriodoModal;