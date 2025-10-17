// RepuestosList.js

import React, { useState, useEffect } from 'react';
import RepuestoModal from './RepuestoModal';
import axios from 'axios'; 
import './Catalogos.css';

// Importar iconos (ajusta las rutas si es necesario)
import updateIcon from '../../../../Iconos/editar.png';
import deleteIcon from '../../../../Iconos/eliminar.png';
import addIcon from '../../../../Iconos/add.png';

const API_URL = 'http://localhost:4000/api/repuestos';
// URL para obtener el listado de tickets, unificada en el router de repuestos
const TICKET_API_URL = 'http://localhost:4000/api/repuestos/listado-tickets'; 

const RepuestosList = () => {
    const [repuestos, setRepuestos] = useState([]);
    const [ticketsList, setTicketsList] = useState([]); // Lista de tickets para el desplegable
    const [modalOpen, setModalOpen] = useState(false);
    const [currentRepuesto, setCurrentRepuesto] = useState(null);
    const [mensaje, setMensaje] = useState('');

    const getErrorMessage = (error, defaultMsg) => {
        return error.response?.data?.error || error.message || defaultMsg;
    };
    
    // Función para obtener la lista de tickets
    const fetchTickets = async () => {
        try {
            const response = await axios.get(TICKET_API_URL);
            setTicketsList(response.data || []);
        } catch (error) {
            console.error("Error al cargar tickets:", error);
            const msg = getErrorMessage(error, "Fallo de conexión");
            // Mantenemos este error solo en consola para no bloquear la lista principal
            // setMensaje(`Error al cargar tickets: ${msg}`); 
        }
    };

    // READ: Obtener TODOS los repuestos
    const fetchRepuestos = async () => { 
        setMensaje('');
        try {
            const response = await axios.get(API_URL);
            setRepuestos(response.data || []); 
        } catch (error) {
            const msg = getErrorMessage(error, "Error al cargar los repuestos. Revise el backend.");
            setMensaje(`Error: ${msg}`);
            console.error("Error al cargar repuestos:", error);
        }
    };

    useEffect(() => {
        fetchRepuestos(); 
        fetchTickets(); 
    }, []);

    const handleCreate = () => {
        setCurrentRepuesto(null); 
        setModalOpen(true);
        setMensaje('');
    };

    const handleEdit = (repuesto) => {
        setCurrentRepuesto(repuesto); 
        setModalOpen(true);
        setMensaje('');
    };

    // Función principal de guardado (INSERT y UPDATE)
    const handleSave = async (savedData) => {
        setMensaje('');
        setModalOpen(false); 

        const idToUpdate = savedData.TRP_Repuesto; 
        
        // El body de la petición
        const dataToSend = {
            // Incluimos TIC_Ticket, obligatorio para el POST
            TIC_Ticket: savedData.TIC_Ticket, 
            REP_Repuesto: savedData.REP_Repuesto,
            TRP_Cantidad: savedData.TRP_Cantidad,
            TRP_Descripcion: savedData.TRP_Descripcion,
        };
        
        try {
            if (idToUpdate) {
                // OPERACIÓN UPDATE (PUT): Se envía a /api/repuestos/:id
                // El backend ignorará TIC_Ticket
                await axios.put(`${API_URL}/${idToUpdate}`, dataToSend);
                setMensaje('Repuesto actualizado con éxito.');
            } else {
                // OPERACIÓN CREATE (POST): Se envía a /api/repuestos
                await axios.post(API_URL, dataToSend);
                setMensaje('Repuesto agregado con éxito.');
            }

            fetchRepuestos(); // Refrescar la lista
            fetchTickets(); // Refrescar la lista de tickets por si acaso
        } catch (error) {
            const msg = getErrorMessage(error, "Error al guardar el repuesto.");
            setMensaje(`Error: ${msg}`);
            console.error("Error en handleSave:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este repuesto?')) {
            setMensaje('');
            try {
                await axios.delete(`${API_URL}/${id}`);
                setMensaje('Repuesto eliminado con éxito.');
                fetchRepuestos(); 
            } catch (error) {
                const msg = getErrorMessage(error, "Error al eliminar el repuesto.");
                setMensaje(`Error: ${msg}`);
                console.error("Error en handleDelete:", error);
            }
        }
    };

    return (
        <div className="catalogos-list-container">
            
            
            {mensaje && <div className={`alert ${mensaje.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{mensaje}</div>}

            <div className="catalog-items-list">
                <div className="catalog-header">
                    <div><h3>Detalle de Repuestos</h3></div>
                    <div style={{marginLeft: 'auto'}}>
                        <button onClick={handleCreate} className="btn-create">
                            <img src={addIcon} alt="Nuevo" className="action-icon-white" />
                        </button>
                    </div>
                </div>
                <div className="items-list">
                    {repuestos.map((rep) => (
                        <div key={rep.ID} className="item-card">
                            <div>
                                <span className="item-title">{rep.CODIGO_REPUESTO}</span>
                                <br />
                                <span className="item-meta">
                                    <strong>ID Fila: {rep.ID}</strong> | Ticket: {rep.TICKET_ID} | Cantidad: {rep.CANTIDAD} <br />
                                    {rep.DESCRIPCION}
                                </span>
                            </div>
                            <div style={{marginLeft: 'auto', alignSelf: 'center'}}>
                                <button className="action-button abrir-button" onClick={() => handleEdit(rep)} data-tooltip="Editar">
                                    <center><img src={updateIcon} alt="Editar" /></center>
                                </button> &nbsp;
                                <button className="action-button sla-button" onClick={() => handleDelete(rep.ID)} data-tooltip="Eliminar">
                                    <center><img src={deleteIcon} alt="Eliminar" /></center>
                                </button>
                            </div>
                        </div>
                    ))}
                    {repuestos.length === 0 && <p style={{padding: '10px'}}>La tabla HDK_TICKET_REPUESTOS está vacía.</p>}
                </div>
            </div>
            
            {modalOpen && (
                <RepuestoModal
                    repuesto={currentRepuesto}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                    ticketsList={ticketsList} // Pasamos la lista de tickets
                />
            )}
        </div>
    );
};

export default RepuestosList;