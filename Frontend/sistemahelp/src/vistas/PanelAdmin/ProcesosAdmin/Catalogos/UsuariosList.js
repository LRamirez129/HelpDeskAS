import React, { useState } from 'react';
import UsuarioModal from './UsuarioModal';
import './Catalogos.css';

// Importar iconos (asegúrate de que estas rutas sean correctas)
import updateIcon from '../../../../Iconos/editar.png';
import deleteIcon from '../../../../Iconos/eliminar.png';
import addIcon from '../../../../Iconos/add.png'


const initialData = [
    { USR_USUARIO: 1, NOMBRE: 'Carlos García', CORREO: 'carlos.g@email.com', TELEFONO: '555-1234', EXTENSION: '1001', ACTIVO: 'S', PASSWORD: '', ROL: 'USER', DEPARTAMENTO: '2' },
    { USR_USUARIO: 2, NOMBRE: 'Ana López', CORREO: 'ana.l@email.com', TELEFONO: '555-5678', EXTENSION: '1002', ACTIVO: 'S', PASSWORD: '', ROL: 'USER', DEPARTAMENTO: '2' },
    { USR_USUARIO: 3, NOMBRE: 'Luis Pérez', CORREO: 'luis.p@email.com', TELEFONO: '555-9012', EXTENSION: '1003', ACTIVO: 'N', PASSWORD: '', ROL: 'USER', DEPARTAMENTO: '2' },
    { USR_USUARIO: 4, NOMBRE: 'Marta Diaz', CORREO: 'marta.d@email.com', TELEFONO: '555-1122', EXTENSION: '1004', ACTIVO: 'S', PASSWORD: '', ROL: 'USER', DEPARTAMENTO: '2' },
    { USR_USUARIO: 5, NOMBRE: 'Juan Ramos', CORREO: 'juan.r@email.com', TELEFONO: '555-3344', EXTENSION: '1005', ACTIVO: 'S', PASSWORD: '', ROL: 'USER', DEPARTAMENTO: '2' },
];

const UsuariosList = () => {
    const [usuarios, setUsuarios] = useState(initialData);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);

    const handleCreate = () => {
        setCurrentUsuario(null);
        setModalOpen(true);
    };

    const handleEdit = (usuario) => {
        setCurrentUsuario(usuario);
        setModalOpen(true);
    };

    const handleSave = (savedUsuario) => {
        if (savedUsuario.USR_USUARIO) {
            setUsuarios(usuarios.map(usr =>
                usr.USR_USUARIO === savedUsuario.USR_USUARIO ? savedUsuario : usr
            ));
            alert('Usuario actualizado con éxito.');
        } else {
            const newId = Math.max(...usuarios.map(usr => usr.USR_USUARIO)) + 1;
            const newUsuario = { ...savedUsuario, USR_USUARIO: newId };
            setUsuarios([...usuarios, newUsuario]);
            alert('Usuario agregado con éxito.');
        }
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este técnico?')) {
            setUsuarios(usuarios.filter(usr => usr.USR_USUARIO !== id));
            alert('Usuario eliminado con éxito.');
        }
    };

    return (
        <div className="catalogos-list-container">
            {/* Catálogo de Usuarios */}
            <div className="catalog-items-list">
                <div className="catalog-header">
                    <div><h3>Catálogo de Usuarios</h3></div>
                    <div style={{marginLeft: 'auto'}}>
                    <button onClick={handleCreate} className="btn-create">
                        <img src={addIcon} alt="Nuevo" className="action-icon-white" />
                    </button>
                    </div>
                </div>
                <div className="items-list">
                {initialData.map((usr) => (
                    <div key={usr.USR_USUARIO} className="item-card">
                        <div>
                            <span class="item-title">{usr.NOMBRE}</span>&nbsp;&nbsp;
                            <span className={`status-tag ${usr.ACTIVO==='S'?"active":"inactive"}`}>{usr.ACTIVO === 'S' ? 
                                            <span className="status-dot active"></span> : 
                                            <span className="status-dot inactive"></span>
                                        }
                                        {usr.ACTIVO === 'S' ? ' Activo' : ' Inactivo'}</span><br />
                            <span className="item-meta">
                                <strong>ID {usr.USR_USUARIO}</strong> | {usr.CORREO} | {usr.TELEFONO} <br />

                            </span>
                        </div>
                        <div style={{marginLeft: 'auto', alignSelf: 'center'}}>
                            <button className="action-button abrir-button" onClick={() => handleEdit(usr)} data-tooltip="Detalle">
                                <center><img src={updateIcon} alt="Abrir" /></center>
                            </button> &nbsp;
                            <button className="action-button sla-button" onClick={() => handleDelete(usr.USR_USUARIO)} data-tooltip="SLA">
                                <center><img src={deleteIcon} alt="SLA" /></center>
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            {/* Modal para crear/editar técnicos */}    
            {modalOpen && (
                <UsuarioModal
                    usuario={currentUsuario}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default UsuariosList;