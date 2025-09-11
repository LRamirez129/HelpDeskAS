import React, { useState } from 'react';
import './BaseConocimiento.css';
import SlaModal from './SlaModal';
import buscarIcon from '../../../Iconos/buscar.png'; 

// Datos de ejemplo para la Base de Conocimiento
const articulos = [
    { id: 1, titulo: 'Cómo restablecer la contraseña de una cuenta de correo', categoria: 'Software', autor: 'Carlos S.' },
    { id: 2, titulo: 'Guía para reemplazar un cartucho de impresora HP', categoria: 'Hardware', autor: 'Marta D.' },
    { id: 3, titulo: 'Solución a problemas de conexión de red intermitente', categoria: 'Redes', autor: 'Jorge M.' },
];

const BaseConocimiento = ({ setActiveModule }) => {
    const [isSlaModalOpen, setIsSlaModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSlaRequest = (data) => {
        console.log("Solicitud de SLA enviada:", data);
        setIsSlaModalOpen(false);
    };

    const filteredArticulos = articulos.filter(articulo =>
        articulo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        articulo.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        articulo.autor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="base-conocimiento-container">
            <div className="main-content-wrapper">
                <div className="ticket-content">
                    <div className="panel">
                        <h2>Base de Conocimiento</h2>
                        <p>Encuentra soluciones a problemas comunes.</p>
                        
                        <div className="search-bar">
                            <input 
                                type="text" 
                                placeholder="Buscar por título, palabra clave o categoría..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* Botón de búsqueda solo con ícono y tooltip */}
                            <button className="btn-primary icon-only" data-tooltip="Buscar">
                                <img src={buscarIcon} alt="Buscar" className="search-icon" />
                            </button>
                        </div>
                    </div>

                    <div className="panel">
                        <h3>Artículos Disponibles</h3>
                        <div className="knowledge-table-wrapper">
                            <table className="knowledge-table">
                                <thead>
                                    <tr>
                                        <th>Título del Artículo</th>
                                        <th>Categoría</th>
                                        <th>Autor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredArticulos.map(articulo => (
                                        <tr key={articulo.id}>
                                            <td>{articulo.titulo}</td>
                                            <td>{articulo.categoria}</td>
                                            <td>{articulo.autor}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="sidebar-actions">
                    <div className="panel sla-action-panel">
                        <h3>¿No encuentras la solución?</h3>
                        <p>Si el problema requiere más tiempo para resolverse, puedes solicitar una extensión de SLA.</p>
                        <button className="btn-primary" onClick={() => setIsSlaModalOpen(true)}>
                            Solicitar Extensión de SLA
                        </button>
                    </div>
                </div>
            </div>

            <SlaModal
                isOpen={isSlaModalOpen}
                onClose={() => setIsSlaModalOpen(false)}
                onSave={handleSlaRequest}
            />
        </div>
    );
};

export default BaseConocimiento;