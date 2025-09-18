import React, { useState } from 'react';
import TecnicosList from './TecnicosList';
import HabilidadesList from './HabilidadesList';
import EquiposList from './EquiposList';
import './Catalogos.css'; // Estilos para el contenedor y las pestañas

const Catalogo = () => {
    const [vistaActual, setVistaActual] = useState('tecnicos');

    return (
        <div className="catalogos-container">
            <h1>Gestión de Catálogos</h1>
            <div className="tabs">
                <button
                    className={vistaActual === 'tecnicos' ? 'active' : ''}
                    onClick={() => setVistaActual('tecnicos')}
                >
                    Técnicos
                </button>
                <button
                    className={vistaActual === 'habilidades' ? 'active' : ''}
                    onClick={() => setVistaActual('habilidades')}
                >
                    Habilidades
                </button>
                <button
                    className={vistaActual === 'equipos' ? 'active' : ''}
                    onClick={() => setVistaActual('equipos')}
                >
                    Equipos
                </button>
            </div>
            <div className="content">
                {vistaActual === 'tecnicos' && <TecnicosList />}
                {vistaActual === 'habilidades' && <HabilidadesList />}
                {vistaActual === 'equipos' && <EquiposList />}
            </div>
        </div>
    );
}

export default Catalogo;