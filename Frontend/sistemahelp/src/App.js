import React, { useState, useEffect } from 'react';
import './App.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'; 

// Importa los módulos principales de cada panel
import ModuloAdmin from './vistas/PanelAdmin/ModuloAdmin';
import ModuloTecnico from './vistas/PanelTecnico/ModuloTecnico';
import ModuloUsuario from './vistas/PanelUsuario/ModuloUsuario';

function App() {
  const [activePanel, setActivePanel] = useState(null); // Estado para controlar el panel activo
  const [showBackButton, setShowBackButton] = useState(true);

  // Si NO estamos en 'usuario', mostrar siempre el back-button
  useEffect(() => {
    if (activePanel !== 'usuario') setShowBackButton(true);
    }, [activePanel, setShowBackButton]);

  // Función para renderizar el contenido principal
  const renderContent = () => {
    switch (activePanel) {
      case 'admin':
        return <ModuloAdmin />;
      case 'tecnico':
        return <ModuloTecnico />;
      case 'usuario':
        return <ModuloUsuario onToggleBackButton={setShowBackButton} />;
      default:
        return (
          <div className="button-container">
            <button className="panel-button" onClick={() => setActivePanel('admin')}>
              Panel Administrativo
            </button>
            <button className="panel-button" onClick={() => setActivePanel('tecnico')}>
              Panel Técnico
            </button>
            <button className="panel-button" onClick={() => setActivePanel('usuario')}>
              Panel Usuario
            </button>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <header>
        {activePanel && showBackButton && (
          <button className="back-button" onClick={() => setActivePanel(null)}>
            ◄ Regresar
          </button>
        )}
      </header>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;