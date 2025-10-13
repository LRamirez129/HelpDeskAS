/*
USP_READ_USUARIO
Parámetros: CUR_USUARIO OUT SYS_REFCURSOR
Descripción: el obtiene el registro requerido de la tabla USUARIO y lo retorna por medio del cursor de salida CUR_USUARIO.

Autor: Wilson Blanco
Fecha: 2025-10-07
Versión: 1.0
*/

CREATE OR REPLACE PROCEDURE USP_READ_USUARIO (
    CUR_USUARIO OUT SYS_REFCURSOR,
    P_ID IN NUMBER DEFAULT 0
) AS
BEGIN   

    IF ( P_ID IS NOT NULL AND P_ID > 0 ) THEN
        OPEN CUR_USUARIO FOR
            SELECT  USR_USUARIO,
                    USR_NOMBRE,
                    USR_CORREO,
                    USR_TELEFONO,
                    USR_EXTENSION,
                    DEP_DEPARTAMENTO,
                    USR_UBICACION,
                    USR_EQUIPO,
                    USR_PASSWORD,
                    USR_ACTIVO,
                    USR_ROL
            FROM HDK_USUARIO
            WHERE USR_USUARIO = P_ID
            ORDER BY USR_USUARIO;    
        RETURN;
    END IF;
        -- Si no se especifica un ID, se retornan todos los registros.
    OPEN CUR_USUARIO FOR
        SELECT  USR_USUARIO,
                USR_NOMBRE,
                USR_CORREO,
                USR_TELEFONO,
                USR_EXTENSION,
                DEP_DEPARTAMENTO,
                USR_UBICACION,
                USR_EQUIPO,
                USR_PASSWORD,
                USR_ACTIVO,
                USR_ROL
        FROM HDK_USUARIO
        ORDER BY USR_USUARIO;       
END;