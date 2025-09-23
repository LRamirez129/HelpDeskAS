import React, { useState } from 'react';
import RepuestoModal from './RepuestoModal';
import './Catalogos.css';

// Importar iconos (asegúrate de que estas rutas sean correctas)
import updateIcon from '../../../../Iconos/editar.png';
import deleteIcon from '../../../../Iconos/eliminar.png';
import addIcon from '../../../../Iconos/add.png'


const initialData = [
    { REP_REPUESTO: 1, SKU: 'RP0001', NOMBRE: 'Motherboard', DESCRIPCION: 'Motherboard Dell Lattitude 7480', COSTOUNITARIO: 1225.00, MONEDA: 'GTQ', ACTIVO: 'S' },
    { REP_REPUESTO: 2, SKU: 'RP0002', NOMBRE: 'Disco SSD 500GB', DESCRIPCION: 'Unidad de estado sólido para laptops y computadoras de escritorio', COSTOUNITARIO: 425.50, MONEDA: 'GTQ', ACTIVO: 'S' },
    { REP_REPUESTO: 3, SKU: 'RP0003', NOMBRE: 'Memoria RAM 8GB DDR4', DESCRIPCION: 'Módulo de memoria RAM para servidores y equipos de oficina', COSTOUNITARIO: 285.75, MONEDA: 'GTQ', ACTIVO: 'S' },
    { REP_REPUESTO: 4, SKU: 'EQ0001', NOMBRE: 'Laptop ThinkPad X1 Carbon', DESCRIPCION: 'Laptop empresarial ultraligera con procesador Intel i7 y 16GB de RAM', COSTOUNITARIO: 9850.00, MONEDA: 'GTQ', ACTIVO: 'S' },
    { REP_REPUESTO: 5, SKU: 'EQ0002', NOMBRE: 'Impresora Multifuncional Laser', DESCRIPCION: 'Impresora láser a color con escáner y copiadora integrados para oficina', COSTOUNITARIO: 3200.00, MONEDA: 'GTQ', ACTIVO: 'S' },
];

const RepuestosList = () => {
    const [repuestos, setRepuestos] = useState(initialData);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentRepuesto, setCurrentRepuesto] = useState(null);

    const handleCreate = () => {
        setCurrentRepuesto(null);
        setModalOpen(true);
    };

    const handleEdit = (repuesto) => {
        setCurrentRepuesto(repuesto);
        setModalOpen(true);
    };

    const handleSave = (savedRepuesto) => {
        if (savedRepuesto.REP_REPUESTO) {
            setRepuestos(repuestos.map(rep =>
                rep.REP_REPUESTO === savedRepuesto.REP_REPUESTO ? savedRepuesto : rep
            ));
            alert('Técnico actualizado con éxito.');
        } else {
            const newId = Math.max(...repuestos.map(rep => rep.REP_REPUESTO)) + 1;
            const newRepuesto = { ...savedRepuesto, REP_REPUESTO: newId };
            setRepuestos([...repuestos, newRepuesto]);
            alert('Técnico agregado con éxito.');
        }
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este repuesto?')) {
            setRepuestos(repuestos.filter(rep => rep.REP_REPUESTO !== id));
            alert('Técnico eliminado con éxito.');
        }
    };

    return (
        <div className="catalogos-list-container">
            {/* Catálogo de Repuestos */}
            <div className="catalog-items-list">
                <div className="catalog-header">
                    <div><h3>Catálogo de Repuestos</h3></div>
                    <div style={{marginLeft: 'auto'}}>
                    <button onClick={handleCreate} className="btn-create">
                        <img src={addIcon} alt="Nuevo" className="action-icon-white" />
                    </button>
                    </div>
                </div>
                <div className="items-list">
                {initialData.map((rep) => (
                    <div key={rep.REP_REPUESTO} className="item-card">
                        <div>
                            <span class="item-title">{rep.NOMBRE}</span>&nbsp;&nbsp;
                            <span className={`status-tag ${rep.ACTIVO==='S'?"active":"inactive"}`}>{rep.ACTIVO === 'S' ? 
                                            <span className="status-dot active"></span> : 
                                            <span className="status-dot inactive"></span>
                                        }
                                        {rep.ACTIVO === 'S' ? ' Activo' : ' Inactivo'}</span><br />
                            <span className="item-meta">
                                <strong>ID {rep.REP_REPUESTO}</strong> | {rep.COSTOUNITARIO} | {rep.MONEDA} <br />
                                {rep.DESCRIPCION}
                            </span>
                        </div>
                        <div style={{marginLeft: 'auto', alignSelf: 'center'}}>
                            <button className="action-button abrir-button" onClick={() => handleEdit(rep)} data-tooltip="Detalle">
                                <center><img src={updateIcon} alt="Abrir" /></center>
                            </button> &nbsp;
                            <button className="action-button sla-button" onClick={() => handleDelete(rep.REP_REPUESTO)} data-tooltip="SLA">
                                <center><img src={deleteIcon} alt="SLA" /></center>
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            {/* Modal para crear/editar repuestos */}    
            {modalOpen && (
                <RepuestoModal
                    repuesto={currentRepuesto}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default RepuestosList;