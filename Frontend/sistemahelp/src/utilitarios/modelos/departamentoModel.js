export const C_ENTIDAD = 'DEPARTAMENTO';

export function createDepartamento({
    DEP_DEPARTAMENTO = null,
    DEP_NOMBRE = '',
    DEP_UBICACION = '',
    DEP_ACTIVO = 'S'
} = {}) {
    return {
        DEP_DEPARTAMENTO,
        DEP_NOMBRE,
        DEP_UBICACION,
        DEP_ACTIVO,
        entidad: C_ENTIDAD
    };
}