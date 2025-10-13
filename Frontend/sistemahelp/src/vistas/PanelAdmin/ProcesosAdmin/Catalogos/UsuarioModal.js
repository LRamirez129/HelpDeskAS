import React, { useState, useEffect } from 'react';
import './Catalogos.css';
import guardarIcon from '../../../../Iconos/guardar.png';
import cancelarIcon from '../../../../Iconos/cancelar.png';
import { createUsuario } from '../../../../utilitarios/modelos/usuarioModel';

const UsuarioModal = ({ usuario, onSave, onClose }) => {
    const [formData, setFormData] = useState(createUsuario());

    useEffect(() => {
        if (usuario) {
            setFormData(createUsuario(usuario));
        } else {
            setFormData(createUsuario());
        }
    }, [usuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name === 'nombre' ? 'USR_NOMBRE' : 
                name === 'correo' ? 'USR_CORREO' : 
                name === 'telefono' ? 'USR_TELEFONO' : 
                name === 'extension' ? 'USR_EXTENSION' : 
                name === 'password' ? 'USR_PASSWORD' : 
                name === 'rol' ? 'USR_ROL' : 
                name === 'departamento' ? 'DEP_DEPARTAMENTO' : 
                name === 'activo' ? 'USR_ACTIVO' : 
                name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let apiUrl = 'http://localhost:4000/api/create';
            let updateData = { ...formData };
            if (usuario?.USR_USUARIO) {
                updateData.USR_USUARIO = usuario.USR_USUARIO;
                apiUrl = 'http://localhost:4000/api/update';
            }            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Error al guardar el usuario');
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
                <h2>{usuario ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" name="nombre" value={formData.USR_NOMBRE} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Correo</label>
                        <input type="email" name="correo" value={formData.USR_CORREO} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input type="tel" name="telefono" value={formData.USR_TELEFONO} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Extensión</label>
                            <select name="extension" value={formData.USR_EXTENSION} onChange={handleChange}>
                                <option value="">-- Seleccionar --</option>
                                <option value="1001">1001</option>
                                <option value="1002">1002</option>
                                <option value="1003">1003</option>
                                <option value="1004">1004</option>
                                <option value="1005">1005</option>
                                {/* Agrega más opciones aquí si es necesario */}
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input type="password" name="password" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Confirmar contraseña</label>
                            <input type="password" name="confirmpassword" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Rol</label>
                            <select name="rol" value={formData.USR_ROL} onChange={handleChange}>
                                <option value="USER">Usuario</option>
                                <option value="TECH">Tecnico</option>
                                <option value="ADMIN">Administrador</option>                                
                                {/* Agrega más opciones aquí si es necesario */}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Departamento</label>
                            <select name="departamento" value={formData.DEP_DEPARTAMENTO} onChange={handleChange}>
                                    <option value="">-- Seleccionar --</option>
                                    <option value="1">Administración</option>
                                    <option value="2">Ventas</option>
                                    <option value="3">Marketing</option>
                                    <option value="4">Atención al Cliente</option>
                                    <option value="5">Sistemas</option>                                
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
                                        checked={formData.USR_ACTIVO === 'S'}
                                        onChange={handleChange}
                                    />
                                    Activo
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="activo"
                                        value="N"
                                        checked={formData.USR_ACTIVO === 'N'}
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

export default UsuarioModal;