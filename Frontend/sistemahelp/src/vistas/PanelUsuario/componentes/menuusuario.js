import "./menuusuario.css";
import iconTickets from "../../../Iconos/tickets.gif";
import iconHistorial from "../../../Iconos/history.png";
import iconFalla from "../../../Iconos/falla.png";
import React, { useState } from 'react';



/**
 * Menú central accesible para el panel de Usuario.
 * - Botones grandes, foco visible, soporte teclado (Enter/Espacio)
 * - onNavigate("tickets" | "historial" | "reportar")
 */
export default function MenuUsuario({ onNavigate }) {
  const items = [
    {
      key: "tickets",
      title: "Tickets",
      desc: "Ver y gestionar tus tickets actuales.",
      img: iconTickets,
      aria: "Abrir Tickets del usuario",
    },
    {
      key: "historial",
      title: "Historial",
      desc: "Consulta el historial de tus tickets.",
      img: iconHistorial,
      aria: "Abrir Historial de tickets del usuario",
    },
    {
      key: "reportar",
      title: "Reportar Falla",
      desc: "Crear un nuevo ticket de soporte.",
      img: iconFalla,
      aria: "Abrir formulario para reportar una falla",
    },
  ];

  const navItems = [
    { id: 'tickets', label: 'Tickets', img: iconTickets },
    { id: 'historial', label: 'Historial', img: iconHistorial },
    { id: 'reportar', label: 'Reportar Falla', img: iconFalla },
  ];

  const [activeModule, setActiveModule] = useState('MenuUsuario');

  const handleKey = (e, key) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onNavigate?.(key);
    }
  };

  return (
    <div className="hm-wrap">
      <div className="hm-cardgroup" role="list">
        {items.map(({ key, title, desc, aria, img, navItems }) => (
          <div
            key={key}
            role="button"
            tabIndex={0}
            aria-label={aria}
            className={`hm-card nav-item ${activeModule === key ? "active" : ""}`}
            onClick={() => {
              setActiveModule(key);
              onNavigate?.(key);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveModule(key);
                onNavigate?.(key);
              }
            }}
          >
            <div className="hm-icon">
              <img src={img} alt={title} />
            </div>

            <h3 className="hm-title">{title}</h3>
            <p className="hm-desc">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
