import React, { useState } from 'react';
import '../../../estilos/reporteria.css'; // mantiene tus estilos ya definidos

import TecnicosList from './Catalogos/TecnicosList';
import DepartamentosList from './Catalogos/DepartamentosList';
import RepuestosList from './Catalogos/RepuestosList';
import EstadosList from './Catalogos/EstadosList';
import UsuariosList from './Catalogos/UsuariosList';

// Importa otros catálogos según sea necesario

// Tarjetas de catálogos (usa clases de Bootstrap Icons)
const catalogoCards = [
  { id: 'Usuarios',       title: 'Usuarios',                 icon: 'bi-people' },
  { id: 'Tecnicos',       title: 'Técnicos',                 icon: 'bi-person-badge' },
  { id: 'Departamentos',  title: 'Departamentos',            icon: 'bi-building-fill-add' },  
  { id: 'Repuestos',      title: 'Repuestos',                icon: 'bi-hammer' },
  { id: 'Estados',        title: 'Estados',                  icon: 'bi-back' },
  { id: 'KnowledgeBase',  title: 'Base de Conocimientos',    icon: 'bi-database-check' },
  { id: 'CargasMasivas',  title: 'Cargas Masivas',           icon: 'bi-upload' },
  { id: 'Otra2',          title: 'Otra',                     icon: 'bi-9-circle' },
];

function CatalogosAdmin() {
  const [catalogoActual, setCatalogoActual] = useState(null);

  const renderCatalogos = () => {
    switch (catalogoActual) {
      case 'Usuarios': return <div><UsuariosList /></div>;
      case 'Tecnicos': return <div><TecnicosList /></div>;
      case 'Departamentos': return <div><DepartamentosList /></div>;
      case 'Departamentos2': return <div>Aca pones la direccion de tus formularios {catalogoActual}</div>;
      case 'Repuestos': return <div><RepuestosList /></div>;
      case 'Estados': return <div><EstadosList /></div>;
      case 'KnowledgeBase': return <div>Aca pones la direccion de tus formularios {catalogoActual}</div>;
      case 'CargasMasivas': return <div>Aca pones la direccion de tus formularios {catalogoActual}</div>;
      case 'Otra2': return <div>Aca pones la direccion de tus formularios {catalogoActual}</div>;

      default:
        // Cuadrícula de tarjetas (usa las clases definidas en tu CSS)
        return (
          <div className="report-cards-container">
            {catalogoCards.map(card => (
              <div
                key={card.id}
                className="report-card"
                onClick={() => setCatalogoActual(card.id)}
              >
                <i className={`bi ${card.icon} card-icon`}></i>
                <h3 className="card-title">{card.title}</h3>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="reporteria-container">
      {catalogoActual && (
        <button
          className="back-button"
          onClick={() => setCatalogoActual(null)}
        >
          ← Volver a Catálogos
        </button>
      )}

      <div className="reporteria-content">
        {renderCatalogos()}
      </div>
    </div>
  );
}

export default CatalogosAdmin;
