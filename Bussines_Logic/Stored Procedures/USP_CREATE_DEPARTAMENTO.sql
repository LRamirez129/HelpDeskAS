/*
USP_CREAR_DEPARTAMENTO
Parámetros: JSON_DEPARTAMENTO IN CLOB
Descripción: el procedimiento crea, a partir de lo que venga en el parámetro JSON_DEPARTAMENTO,
un nuevo departamento en la tabla DEPARTAMENTO.

Autor: Wilson Blanco
Fecha: 2025-10-03
Versión: 1.0
*/

CREATE OR REPLACE PROCEDURE USP_CREATE_DEPARTAMENTO (
    JSON_DEPARTAMENTO IN CLOB
) AS

    -- Definición de tipos para almacenar los datos extraídos del JSON.    
    TYPE T_DEPTO_TABLE IS TABLE OF HDK_DEPARTAMENTO%ROWTYPE;

    -- Variables para almacenar los datos extraídos
    V_REGISTRO HDK_DEPARTAMENTO%ROWTYPE;
    V_TEMP_DEPTO T_DEPTO_TABLE;

BEGIN   

    -- 1. Se extraen los dato del JSON y 
    --    se almacenan todos (por medio de BULK COLLECT) en la variable V_TEMP_DEPTO,
    --    la cual aquí funciona como una tabla temporal en memoria.

    SELECT jq.DEP_DEPARTAMENTO, 
           jq.DEP_NOMBRE, 
           jq.DEP_UBICACION, 
           jq.DEP_ACTIVO
    BULK COLLECT INTO V_TEMP_DEPTO
    FROM json_table(JSON_DEPARTAMENTO, '$[*]'
        COLUMNS (
            DEP_DEPARTAMENTO VARCHAR2(100) PATH '$.departamento',
            DEP_NOMBRE VARCHAR2(100) PATH '$.nombre',
            DEP_UBICACION VARCHAR2(100) PATH '$.ubicacion',
            DEP_ACTIVO CHAR(1) PATH '$.activo'
        )
    ) jq;

    -- 2. Se valida primero que se hayan obtenido registros.
    --    Si no se obtuvieron registros, se muestra un mensaje y se termina la ejecución.

    IF V_TEMP_DEPTO.COUNT = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No se han encontrado registros.');
        RETURN;
    END IF;
    
    -- 3. Ya con los datos en memoria, se procede a recorrer la tabla temporal
    --    e insertar uno por uno los registros en la tabla HDK_DEPARTAMENTO.
    --    (Podría hacerse con un INSERT ALL, pero se hace así para mayor claridad).
    
    FOR i IN V_TEMP_DEPTO.FIRST .. V_TEMP_DEPTO.LAST LOOP
        V_REGISTRO := V_TEMP_DEPTO(i);
        INSERT INTO HDK_DEPARTAMENTO (DEP_NOMBRE, 
                                         DEP_UBICACION, 
                                         DEP_ACTIVO)
        VALUES (V_REGISTRO.DEP_NOMBRE, 
                V_REGISTRO.DEP_UBICACION, 
                V_REGISTRO.DEP_ACTIVO);        
    END LOOP;    
END;
