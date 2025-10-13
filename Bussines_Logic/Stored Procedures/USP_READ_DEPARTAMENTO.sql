/*
USP_READ_DEPARTAMENTO
Parámetros: CUR_DEPARTAMENTO OUT SYS_REFCURSOR
Descripción: el obtiene el registro requerido de la tabla DEPARTAMENTO y lo retorna por medio del cursor de salida CUR_DEPARTAMENTO.

Autor: Wilson Blanco
Fecha: 2025-10-03
Versión: 1.0
*/

CREATE OR REPLACE PROCEDURE USP_READ_DEPARTAMENTO (
    CUR_DEPARTAMENTO OUT SYS_REFCURSOR,
    P_ID IN NUMBER DEFAULT 0
) AS
BEGIN   

    IF ( P_ID IS NOT NULL AND P_ID > 0 ) THEN
        OPEN CUR_DEPARTAMENTO FOR
            SELECT DEP_DEPARTAMENTO,
                   DEP_NOMBRE,
                   DEP_UBICACION,
                   DEP_ACTIVO
            FROM HDK_DEPARTAMENTO
            WHERE DEP_DEPARTAMENTO = P_ID;
        RETURN;
    END IF;
        -- Si no se especifica un ID, se retornan todos los registros.
    OPEN CUR_DEPARTAMENTO FOR
        SELECT DEP_DEPARTAMENTO,
               DEP_NOMBRE,
               DEP_UBICACION,
               DEP_ACTIVO
        FROM HDK_DEPARTAMENTO
        ORDER BY DEP_DEPARTAMENTO;

END;