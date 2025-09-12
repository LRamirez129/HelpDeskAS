import React, { useState, useMemo, useRef, useEffect } from "react";
import "./reportarfalla.css";

/**
 * Formulario para Reportar Falla
 * Props:
 *  - onCancelar(): vuelve al menú
 *  - onEnviar(payload): envía datos (por ahora solo llama y limpia)
 */
export default function ReportarFalla({ onCancelar, onEnviar }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [subcategoria, setSubcategoria] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [showCatError, setShowCatError] = useState(false);
  const [openHelp, setOpenHelp] = useState(null); // 'categoria' | 'subcategoria' | 'prioridad' | null
  const catRef = useRef(null);
  const subRef = useRef(null);
  const priRef = useRef(null);

  // Subcategorías dinámicas por categoría
  const mapaSubcategorias = useMemo(
    () => ({
      Hardware: ["PC/Escritorio", "Laptop", "Impresora", "Monitor", "Periféricos"],
      Software: ["Office/Correo", "ERP", "Licencias", "Actualizaciones", "Errores sistema"],
      Red: ["Internet", "VPN", "Wi-Fi", "Switch/Router", "DNS/DHCP"],
      Accesos: ["Usuario/Contraseña", "Bloqueo de cuenta", "Permisos", "Single Sign-On"],
    }),
    []
  );

  const subcategoriasDisponibles = categoria ? mapaSubcategorias[categoria] || [] : [];
  const MAX_DESC = 500;

  function manejarArchivo(e) {
    const f = e.target.files?.[0] || null;
    setArchivo(f);
  }

  // ⬇️ MOVER AQUÍ (fuera de enviar) — handler para seleccionar tarjeta con teclado
  function handleCardKey(e, id) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCategoria(id);
      setSubcategoria("");
      setShowCatError(false);
    }
  }

  function enviar(e) {
    e.preventDefault();

    if (!categoria) setShowCatError(true);
    if (!titulo || !categoria || !prioridad) return;

    const payload = {
      titulo,
      categoria,
      subcategoria: subcategoria || null,
      prioridad,
      descripcion,
      archivoNombre: archivo?.name || null,
    };

    onEnviar?.(payload);

    // Limpieza
    setTitulo("");
    setCategoria("");
    setSubcategoria("");
    setPrioridad("");
    setDescripcion("");
    setArchivo(null);
  }

  useEffect(() => {
  function onKey(e){ if (e.key === "Escape") setOpenHelp(null); }
  function onClick(e){
    const insideCat = catRef.current?.contains(e.target);
    const insideSub = subRef.current?.contains(e.target);
    const insidePri = priRef.current?.contains(e.target);
    if (!insideCat && !insideSub && !insidePri) setOpenHelp(null);
  }
  document.addEventListener("keydown", onKey);
  document.addEventListener("mousedown", onClick);
  return () => {
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("mousedown", onClick);
  };
  }, []);

  return (
    <section className="rf-card" aria-labelledby="rf-title">
      <h2 id="rf-title" className="rf-title">Reportar Falla</h2>
      <p className="rf-hint">
        Completa los campos obligatorios (<span className="req">*</span>).
      </p>

      <form className="rf-form" onSubmit={enviar}>
        <label className="rf-field">
          <span className="rf-label">
            Título <span className="req">*</span>
          </span>
          <input
            type="text"
            required
            placeholder="Breve título de la falla"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </label>

        {/* === CATEGORÍA (cards) === */}
        <div className="rf-field">
          <span className="rf-label">
            Categoría <span className="req">*</span>
          </span>

          <div className="rf-catgrid" role="radiogroup" aria-label="Categoría">
            {[
              { id: "Hardware", icon: "bi-pc-display" },
              { id: "Software", icon: "bi-window-stack" },
              { id: "Red", icon: "bi-wifi" },
              { id: "Accesos", icon: "bi-shield-lock" },
            ].map(({ id, icon }) => (
              <div
                key={id}
                role="radio"
                tabIndex={0}
                aria-checked={categoria === id}
                className={`rf-cat ${categoria === id ? "active" : ""}`}
                onClick={() => {
                  setCategoria(id);
                  setSubcategoria("");
                  setShowCatError(false);
                }}
                onKeyDown={(e) => handleCardKey(e, id)}
              >
                <i className={`bi ${icon}`} aria-hidden="true"></i>
                <span>{id}</span>
              </div>
            ))}
          </div>

          {showCatError && <div className="rf-error">Selecciona una categoría.</div>}
        </div>

        {/* SUBCATEGORÍA (fila propia) */}
        <div className="rf-row">
        <div className="rf-field">
            <div className="rf-labelwrap" ref={subRef}>
                <label htmlFor="rf-subcategoria" className="rf-label">Subcategoría</label>
                <button
                    type="button"
                    className="rf-help"
                    aria-label="Ayuda sobre subcategoría"
                    aria-expanded={openHelp==='subcategoria'}
                    onClick={() => setOpenHelp(openHelp==='subcategoria' ? null : 'subcategoria')}
                    title="Refina el tipo de problema dentro de la categoría elegida."
                >
                <i className="bi bi-question-circle" aria-hidden="true"></i>
                </button>
                
                {openHelp==='subcategoria' && (
                    <div className="rf-popover" role="dialog" aria-label="Ayuda: subcategoría">
                        <p>Refina el problema dentro de la categoría elegida. Ej.: Hardware → <em>Impresora</em> o <em>Laptop</em>.</p>
                        <div className="rf-popover-actions">
                            <button type="button" className="rf-btn rf-btn-pri" onMouseDown={(e) => {e.preventDefault();e.stopPropagation();setOpenHelp(null);}} onClick={(e) => {e.preventDefault(); setOpenHelp(null);}}>Entendido</button>
                        </div>
                    </div>
                )}
                </div>

                <select
                    id="rf-subcategoria"
                    value={subcategoria}
                    onChange={(e) => setSubcategoria(e.target.value)}
                    disabled={!subcategoriasDisponibles.length}
                >
                <option value="">
                    {subcategoriasDisponibles.length ? "Selecciona una subcategoría" : "No disponible"}
                </option>
                {subcategoriasDisponibles.map((s) => (
                <option key={s} value={s}>{s}</option>
                ))}
                </select>
                </div>
            </div>

        
        {/* PRIORIDAD (fila independiente debajo) */}
        <div className="rf-row2">
        <div className="rf-field">
            <div className="rf-labelwrap" ref={priRef}>
            <label htmlFor="rf-prioridad" className="rf-label">Prioridad <span className="req">*</span></label>
            <button
                type="button"
                className="rf-help"
                aria-label="Ayuda sobre prioridad"
                aria-expanded={openHelp==='prioridad'}
                onClick={() => setOpenHelp(openHelp==='prioridad' ? null : 'prioridad')}
            >
            <i className="bi bi-question-circle" aria-hidden="true"></i>
            </button>
            {openHelp==='prioridad' && (
                <div className="rf-popover" role="dialog" aria-label="Ayuda: prioridad">
                    <p><strong>Baja</strong>: impacto mínimo, puede esperar.</p>
                    <p><strong>Media</strong>: afecta tu trabajo pero hay alternativa temporal.</p>
                    <p><strong>Alta</strong>: bloquea tareas importantes, requiere atención pronta.</p>
                    <p><strong>Crítica</strong>: servicio caído o riesgo mayor, atención inmediata.</p>
                    <div className="rf-popover-actions">
                        <button type="button" className="rf-btn rf-btn-pri" onMouseDown={(e) => {e.preventDefault();e.stopPropagation();setOpenHelp(null);}} onClick={(e) => {e.preventDefault(); setOpenHelp(null);}}>Entendido</button>
                    </div>
                </div>
            )}
            </div>

            <select
            id="rf-prioridad"
            required
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            >
            <option value="">Selecciona prioridad</option>
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
            <option>Crítica</option>
            </select>
        </div>
        </div>

        <label className="rf-field">
          <span className="rf-label">Descripción</span>
          <textarea
            rows={5}
            maxLength={MAX_DESC}
            placeholder="Describe el problema, pasos para reproducir, mensajes de error, etc."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <div className="rf-counter">{descripcion.length}/{MAX_DESC}</div>
        </label>

        <label className="rf-field">
          <span className="rf-label">Adjuntar evidencia (opcional)</span>
          <input type="file" accept="image/*,application/pdf" onChange={manejarArchivo} />
          {archivo && (
            <div className="rf-file">
              Archivo seleccionado: <strong>{archivo.name}</strong>
            </div>
          )}
        </label>

        <div className="rf-actions">
          <button
            type="button"
            className="rf-btn rf-btn-sec"
            onClick={() => onCancelar?.()}
            aria-label="Cancelar y volver al menú"
          >
            Cancelar
          </button>
          <button type="submit" className="rf-btn rf-btn-pri">
            Enviar
          </button>
        </div>
      </form>
    </section>
  );
}
