import React, { useState, useEffect } from "react";
import MenuUsuario from "./componentes/menuusuario";
import "../modulo.css"; // mantiene tu estilo general si lo usas en otros paneles

import DetalleTicketTecnico from "../PanelTecnico/ProcesosTec/DetalleTicket";
import TicketTecnico from "../PanelTecnico/Ticket";

import ReportarFalla from "./componentes/reportarfalla";

/**
 * ModuloUsuario: sin sidebar, menú central y vistas internas.
 * Vistas: "menu" | "tickets" | "historial" | "reportar"
 */
export default function ModuloUsuario({ onToggleBackButton }) {
  const [view, setView] = useState("menu");

  // Mostrar el back-button solo en el menú del Usuario
  useEffect(() => {
    onToggleBackButton?.(view === "menu");
    }, [view, onToggleBackButton]);

    // Por seguridad, al desmontar reactivamos el botón
    useEffect(() => {
      return () => onToggleBackButton?.(true);
      }, [onToggleBackButton]);

  const BackBar = ({ title }) => (
    <div className="usuario-topbar" style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
    }}>
      <button
        onClick={() => setView("menu")}
        className="back-button back-button--inline"
        aria-label="Volver al menú"
      >
        ← Menú
      </button>
      <h2 style={{ margin: 0 }}>{title}</h2>
    </div>
  );

  if (view === "tickets") {
    return (
      <div className="usuario-view">
        <BackBar title="Mis Tickets" />
        {/* TODO: Conectar con tu lista real de tickets del usuario.
                 Por ahora un placeholder seguro. */}
        <div style={{ padding: "16px" }}>
          <DetalleTicketTecnico />
        </div>
      </div>
    );
  }

  if (view === "historial") {
    return (
      <div className="usuario-view">
        <BackBar title="Historial de Tickets" />
        <div style={{ padding: "16px" }}>
          <TicketTecnico />
        </div>
      </div>
    );
  }

  if (view === "reportar") {
    return (
      <div className="usuario-view">
        <BackBar title="Reportar Falla" />
        <div className="rf-wrap">
          <ReportarFalla
            onCancelar={() => setView("menu")}
              onEnviar={(payload) => {
                // Aquí podrías llamar API; por ahora solo mensaje y volver
                console.log("Ticket enviado:", payload);
                alert("Ejemplo: Ticket enviado");
                setView("menu");
              }
            }
          />
        </div>          
      </div>
    );
  }

  // Vista MENU (por defecto)
  return <MenuUsuario onNavigate={setView} />;
}

const inputStyle = {
  width: "100%",
  marginTop: 6,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  outline: "none",
};

const btnPri = {
  background: "var(--primary, #0d3b66)",
  color: "#fff",
  border: "none",
  padding: "10px 14px",
  borderRadius: 10,
  cursor: "pointer",
};

const btnSec = {
  background: "transparent",
  color: "var(--primary, #0d3b66)",
  border: "1px solid var(--primary, #0d3b66)",
  padding: "10px 14px",
  borderRadius: 10,
  cursor: "pointer",
};
