import React, { useState, useEffect } from 'react';
import './Catalogos.css';
import guardarIcon from '../../../../Iconos/guardar.png';
import cancelarIcon from '../../../../Iconos/cancelar.png';

const UsuarioModal = ({ usuario, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        extension: '',
        activo: 'S',
        password: '',
        rol: 'USER',
        departamento: 1
    });

    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.NOMBRE,
                correo: usuario.CORREO,
                telefono: usuario.TELEFONO,
                extension: usuario.EXTENSION,
                activo: usuario.ACTIVO,
                password: usuario.PASSWORD,
                rol: usuario.ROL,
                departamento: usuario.DEPARTAMENTO
            });
        } else {
            setFormData({
                nombre: '',
                correo: '',
                telefono: '',
                extension: '',
                activo: 'S',
                password: '',
                rol: 'USER',
                departamento: 1
            });
        }
    }, [usuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, TEC_TECNICO: usuario ? usuario.TEC_TECNICO : null });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{usuario ? 'Editar Técnico' : 'Agregar Técnico'}</h2>
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
                            <select name="extension" value={formData.extension} onChange={handleChange}>
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
                            <select name="rol" value={formData.rol} onChange={handleChange}>
                                <option value="USER">Usuario</option>
                                <option value="ADMIN">Administrador</option>
                                <option value="SUPERADMIN">Super Administrador</option>
                                {/* Agrega más opciones aquí si es necesario */}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Departamento</label>
                            <select name="departamento" value={formData.departamento} onChange={handleChange}>
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

export default UsuarioModal;