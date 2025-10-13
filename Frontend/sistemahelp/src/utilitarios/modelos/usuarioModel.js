export const C_ENTIDAD = 'USUARIO';

export function createUsuario({
    USR_USUARIO = null,
    USR_NOMBRE = '',
    USR_CORREO = '',
    USR_TELEFONO = '',
    USR_EXTENSION = '',
    DEP_DEPARTAMENTO = null,
    USR_UBICACION = '',
    USR_EQUIPO = '',
    USR_PASSWORD = '',
    USR_ACTIVO = 'S',
    USR_ROL = 'USER'
} = {}) {
    return {
        USR_USUARIO,
        USR_NOMBRE,
        USR_CORREO,
        USR_TELEFONO,
        USR_EXTENSION,
        DEP_DEPARTAMENTO,
        USR_UBICACION,
        USR_EQUIPO,
        USR_PASSWORD,
        USR_ACTIVO,
        USR_ROL,
        entidad: C_ENTIDAD
    };
}