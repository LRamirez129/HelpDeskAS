import React, { useState } from 'react';
import '../../PanelAdmin/ProcesosAdmin/Catalogos/Catalogos.css'; // Usamos el mismo CSS para mantener la consistencia
import guardarIcon from '../../../Iconos/guardar.png';
import cancelarIcon from '../../../Iconos/cancelar.png';

const SlaModal = ({ isOpen, onClose, onSave }) => {
    const [extension, setExtension] = useState('');
    const [motivo, setMotivo] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ extension, motivo });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Solicitar Extensión de SLA</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Extensión de Plazo</label>
                        <select
                            name="extension"
                            value={extension}
                            onChange={(e) => setExtension(e.target.value)}
                            required
                        >
                            <option value="">-- Seleccionar --</option>
                            <option value="1">1 día</option>
                            <option value="2">2 días</option>
                            <option value="3">3 días</option>
                            <option value="5">5 días</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Motivo de la Solicitud</label>
                        <textarea
                            name="motivo"
                            rows="4"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Explique la razón para la extensión..."
                            required
                        />
                    </div>
                    <div className="form-buttons-icons">
                        <img 
                            src={guardarIcon} 
                            alt="Guardar" 
                            className="btn-action-icon btn-guardar-azul"
                            data-tooltip="Enviar Solicitud"
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

export default SlaModal;