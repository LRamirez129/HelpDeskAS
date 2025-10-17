// RepuestoModal.js

import React, { useState, useEffect } from 'react';
import './Catalogos.css';
import guardarIcon from '../../../../Iconos/guardar.png';
import cancelarIcon from '../../../../Iconos/cancelar.png';

const RepuestoModal = ({ repuesto, onSave, onClose, ticketsList }) => { 
    const [formData, setFormData] = useState({
        TIC_Ticket: null,       // Campo para el ticket seleccionado
        REP_Repuesto: '',       
        TRP_Cantidad: 1,        
        TRP_Descripcion: ''     
    });
    
    const isEditing = !!repuesto; 

    useEffect(() => {
        if (isEditing) {
            setFormData({
                TIC_Ticket: repuesto.TICKET_ID,
                REP_Repuesto: repuesto.CODIGO_REPUESTO || '', 
                TRP_Cantidad: repuesto.CANTIDAD || 1,        
                TRP_Descripcion: repuesto.DESCRIPCION || ''   
            });
        } else {
            // Para creación: Selecciona el primer ticket o vacío si no hay
            setFormData({
                TIC_Ticket: ticketsList.length > 0 ? ticketsList[0].ID : '', 
                REP_Repuesto: '',
                TRP_Cantidad: 1,
                TRP_Descripcion: ''
            });
        }
    }, [repuesto, isEditing, ticketsList]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            // Aseguramos que TIC_Ticket y TRP_Cantidad sean números
            [name]: (name === 'TRP_Cantidad' || name === 'TIC_Ticket') ? Number(value) : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validación crucial para creación
        if (!isEditing && (!formData.TIC_Ticket || formData.TIC_Ticket === '')) {
             alert("Debe seleccionar un número de ticket.");
             return;
        }

        onSave({ 
            ...formData, 
            TRP_Repuesto: repuesto?.ID 
        });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{maxWidth: '500px'}}>
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{isEditing ? 'Editar Repuesto' : 'Agregar Repuesto'}</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* CAMPO SELECT PARA TICKET (SOLO EN CREACIÓN) */}
                    {!isEditing && (
                        <div className="form-group">
                            <label>Número de Ticket</label>
                            {ticketsList.length > 0 ? (
                                <select 
                                    name="TIC_Ticket" 
                                    value={formData.TIC_Ticket || ''} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="" disabled>Seleccione un Ticket</option>
                                    {ticketsList.map(ticket => (
                                        <option key={ticket.ID} value={ticket.ID}>
                                            {ticket.ID} - {ticket.TITULO}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p style={{color: 'red'}}>No hay tickets disponibles. Cree un ticket primero.</p>
                            )}
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Código o Nombre del Repuesto</label>
                        <input type="text" name="REP_Repuesto" value={formData.REP_Repuesto} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Cantidad</label>
                        <input type="number" name="TRP_Cantidad" value={formData.TRP_Cantidad} onChange={handleChange} min="1" required />
                    </div>

                    <div className="form-group">
                        <label>Descripción / Notas</label>
                        <input type="text" name="TRP_Descripcion" value={formData.TRP_Descripcion} onChange={handleChange} />
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

export default RepuestoModal;