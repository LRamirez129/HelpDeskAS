import React, { useState, useEffect } from 'react';
import { createUsuario } from '../../../../utilitarios/modelos/usuarioModel';
import UsuarioModal from './UsuarioModal';
import './Catalogos.css';

// Importar iconos (asegúrate de que estas rutas sean correctas)
import updateIcon from '../../../../Iconos/editar.png';
import deleteIcon from '../../../../Iconos/eliminar.png';
import addIcon from '../../../../Iconos/add.png';
import searchIcon from '../../../../Iconos/buscar.png'; // Asegúrate de tener este icono

const UsuariosList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/read?entidad=USUARIO');
            if (!response.ok) throw new Error('Error al obtener usuarios');
            let data = await response.json();
            // Estandariza cada objeto usando el modelo
            data = data.map(usr => createUsuario(usr));
            setUsuarios(data);
            setFilteredUsuarios(data);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    // Función para manejar la búsqueda en tiempo real
    const handleSearch = (data, term) => {
        setSearchTerm(term);
        if (term === '') {
            setFilteredUsuarios(data);
        } else {
            const filtered = data.filter(d =>
                d.USR_NOMBRE.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredUsuarios(filtered);
        }
    };

    const handleCreate = () => {
        setCurrentUsuario(null);
        setModalOpen(true);
    };

    const handleEdit = (usuario) => {
        setCurrentUsuario(usuario);
        setModalOpen(true);
    };

    const handleSave = () => {
        fetchUsuarios();
        setModalOpen(false);
    };

    const handleDelete = async (id) => {
        const usuario = usuarios.find(usr => usr.USR_USUARIO === id);
        if (!usuario) return;
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                const response = await fetch('http://localhost:4000/api/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuario)
                });
                if (!response.ok) throw new Error('Error al eliminar el usuario');
                fetchUsuarios();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return (
        <div className="catalogos-list-container">
            {/* Catálogo de Usuarios */}
            <div className="catalog-items-list">
                <div className="catalog-header">
                    <div><h3>Catálogo de Usuarios</h3></div>
                    <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        {/* Campo de búsqueda */}
                        <div className="search-container">
                            <img src={searchIcon} alt="Buscar" className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(usuarios, e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <button onClick={handleCreate} className="btn-create">
                            <img src={addIcon} alt="Nuevo" className="action-icon-white" />
                        </button>
                    </div>
                </div>
                <div className="items-list">
                    {filteredUsuarios.map((usr) => (
                        <div key={usr.USR_USUARIO} className="item-card">
                            <div>
                                <span className="item-title">{usr.USR_NOMBRE}</span>&nbsp;&nbsp;
                                <span className={`status-tag ${usr.USR_ACTIVO==='S'?"active":"inactive"}`}>
                                    {usr.USR_ACTIVO === 'S' ? 
                                        <span className="status-dot active"></span> : 
                                        <span className="status-dot inactive"></span>
                                    }
                                    {usr.USR_ACTIVO === 'S' ? ' Activo' : ' Inactivo'}
                                </span><br />
                                <span className="item-meta">
                                    <strong>ID {usr.USR_USUARIO}</strong> | {usr.USR_CORREO} | {usr.USR_TELEFONO} <br />
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
                    {filteredUsuarios.length === 0 && (
                        <div className="no-results">
                            No se encontraron usuarios que coincidan con la búsqueda.
                        </div>
                    )}
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