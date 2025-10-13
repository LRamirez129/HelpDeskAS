/*
USP_READ
Parámetros: 
    CUR_REGISTRO OUT SYS_REFCURSOR
    P_ENTIDAD IN VARCHAR2
    P_ID IN NUMBER DEFAULT 0
Descripción: el obtiene el registro requerido de la tabla indicada en P_ENTIDAD 
             y lo retorna por medio del cursor de salida CUR_REGISTRO.

Autor: Wilson Blanco
Fecha: 2025-10-03
Versión: 1.0
*/

CREATE OR REPLACE PROCEDURE USP_READ (
    CUR_REGISTRO OUT SYS_REFCURSOR,    
    P_ENTIDAD IN VARCHAR2,
    P_ID IN NUMBER DEFAULT 0
    
) AS
    V_ENTIDAD VARCHAR2(50);
BEGIN
    V_ENTIDAD := UPPER(TRIM(P_ENTIDAD));
    IF(V_ENTIDAD IS NULL) THEN
        RAISE_APPLICATION_ERROR(-20001, 'El parámetro P_ENTIDAD no puede ser nulo.');
    END IF;
    
    CASE V_ENTIDAD
        WHEN 'DEPARTAMENTO' THEN
            USP_READ_DEPARTAMENTO(CUR_REGISTRO, P_ID);
        WHEN 'USUARIO' THEN
            USP_READ_USUARIO(CUR_REGISTRO, P_ID);
        ELSE
            RAISE_APPLICATION_ERROR(-20001, 'Entidad no reconocida: ' || P_ENTIDAD);
    END CASE;
END;
/