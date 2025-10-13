/*
USP_CREATE
Parámetros: JSON_OBJETO IN CLOB, P_ENTIDAD IN VARCHAR2
Descripción: el procedimiento inserta registros a la tabla indicada en el parámetro P_ENTIDAD, 
             utilizando los datos proporcionados en el objeto JSON.

Autor: Wilson Blanco
Fecha: 2025-10-03
Versión: 1.0
*/

CREATE OR REPLACE PROCEDURE USP_CREATE (
    JSON_OBJETO IN CLOB,    
    P_ID OUT NUMBER,
    P_ENTIDAD IN VARCHAR2 DEFAULT NULL
) AS
    V_ENTIDAD VARCHAR2(50);
BEGIN
    IF(P_ENTIDAD IS NULL) THEN
        SELECT JSON_VALUE(JSON_OBJETO, '$.entidad') INTO V_ENTIDAD FROM DUAL;
    ELSE
        V_ENTIDAD := UPPER(TRIM(P_ENTIDAD));
    END IF;
    IF(V_ENTIDAD IS NULL) THEN
        RAISE_APPLICATION_ERROR(-20001, 'El parámetro P_ENTIDAD no puede ser nulo.');
    END IF;
    
    CASE V_ENTIDAD
        WHEN 'DEPARTAMENTO' THEN
            USP_CREATE_DEPARTAMENTO(JSON_OBJETO, P_ID);
        WHEN 'USUARIO' THEN
            USP_CREATE_USUARIO(JSON_OBJETO, P_ID);
        ELSE
            RAISE_APPLICATION_ERROR(-20001, 'Entidad no reconocida: ' || P_ENTIDAD);
    END CASE;
END;
/