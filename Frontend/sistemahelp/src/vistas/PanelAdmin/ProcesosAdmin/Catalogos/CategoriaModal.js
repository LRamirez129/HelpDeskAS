// CategoriaModal.js
import React, { useState, useEffect } from 'react';
import './Catalogos.css';
import guardarIcon from '../../../../Iconos/guardar.png';
import cancelarIcon from '../../../../Iconos/cancelar.png';

// Recibimos 'categoriasPadre' como prop desde CategoriasList.js
const CategoriaModal = ({ categoria, onSave, onClose, categoriasPadre }) => { 
    const [formData, setFormData] = useState({
        ID: null,        
        NOMBRE: '',        
        DESCRIPCION: '',   
        ID_PADRE: '',      // Contendrá el ID seleccionado (o '' si es Padre)
        ICONO: '',         
        ID_SLA: '',        
    });
    
    const isEditing = !!categoria; 

    useEffect(() => {
        if (isEditing) {
            setFormData({
                ID: categoria.ID, 
                NOMBRE: categoria.NOMBRE || '', 
                DESCRIPCION: categoria.DESCRIPCION || '',
                // El ID_PADRE debe ser una cadena vacía si es null en la DB para el <select>
                ID_PADRE: categoria.ID_PADRE ? String(categoria.ID_PADRE) : '',
                ICONO: categoria.ICONO || '',
                ID_SLA: categoria.ID_SLA ? String(categoria.ID_SLA) : '',
            });
        } else {
            setFormData({
                ID: null,
                NOMBRE: '',
                DESCRIPCION: '',
                ID_PADRE: '', // Estado inicial para un nuevo Padre (se convierte a NULL)
                ICONO: '',
                ID_SLA: '',
            });
        }
    }, [categoria, isEditing]);

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
            alert('El Nombre de la Categoría es obligatorio.');
            return;
        }

        onSave({ 
            ...formData
        });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{maxWidth: '600px'}}> 
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* Campo NOMBRE */}
                    <div className="form-group">
                        <label>Nombre de la Categoría (*)</label>
                        <input 
                            type="text" 
                            name="NOMBRE" 
                            value={formData.NOMBRE} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-row">
                        {/* CAMPO ID_PADRE: USANDO UN SELECT CON LAS CATEGORIAS EXISTENTES */}
                        <div className="form-group">
                            <label>Categoría Padre</label>
                            <select 
                                name="ID_PADRE" 
                                // El valor seleccionado es el ID (ej: '1'), o la cadena vacía ('')
                                value={formData.ID_PADRE} 
                                onChange={handleChange}
                                className="form-select"
                            >
                                {/* Opción CLAVE: El valor es una cadena vacía, que el backend convertirá a NULL */}
                                <option value="">-- No tiene Categoría Padre (Primer Nivel) --</option>
                                {categoriasPadre && categoriasPadre
                                    // NO permitimos que una categoría sea su propia padre
                                    .filter(cat => cat.ID !== formData.ID) 
                                    .map(cat => (
                                        <option key={cat.ID} value={cat.ID}>
                                            {cat.NOMBRE} (ID: {cat.ID})
                                        </option>
                                    ))}
                            </select>
                        </div>
                        
                        {/* Campo ID_SLA */}
                        <div className="form-group">
                            <label>SLA Asociado (ID)</label>
                            <input 
                                type="number" 
                                name="ID_SLA" 
                                value={formData.ID_SLA} 
                                onChange={handleChange} 
                                min="1"
                                placeholder="Opcional. ID de la tabla SLA_SLA."
                            />
                        </div>
                    </div>
                    
                    {/* Campo ICONO */}
                    <div className="form-group">
                        <label>Ícono (Clase de Bootstrap Icons)</label>
                        <input 
                            type="text" 
                            name="ICONO" 
                            value={formData.ICONO} 
                            onChange={handleChange} 
                            placeholder="Ej: bi-cpu, bi-wifi, bi-shield-lock-fill"
                        />
                    </div>

                    {/* Campo DESCRIPCION */}
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea 
                            name="DESCRIPCION" 
                            value={formData.DESCRIPCION} 
                            onChange={handleChange} 
                            rows="3"
                        />
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

export default CategoriaModal;