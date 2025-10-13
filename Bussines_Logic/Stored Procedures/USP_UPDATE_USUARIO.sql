/*
USP_UPDATE_USUARIO
Parámetros: JSON_USUARIO IN CLOB
Descripción: el procedimiento crea, a partir de lo que venga en el parámetro JSON_USUARIO,
un nuevo departamento en la tabla USUARIO.

Autor: Wilson Blanco
Fecha: 2025-10-07
Versión: 1.0
*/

CREATE OR REPLACE PROCEDURE USP_UPDATE_USUARIO (
    JSON_USUARIO IN CLOB,
    P_ID OUT NUMBER
) AS

    -- Definición de tipos para almacenar los datos extraídos del JSON.    
    TYPE T_USR_TABLE IS TABLE OF HDK_USUARIO%ROWTYPE;

    -- Variables para almacenar los datos extraídos
    V_REGISTRO HDK_USUARIO%ROWTYPE;
    V_TEMP_USR T_USR_TABLE;

BEGIN   

    -- 1. Se extraen los dato del JSON y 
    --    se almacenan todos (por medio de BULK COLLECT) en la variable V_TEMP_USR,
    --    la cual aquí funciona como una tabla temporal en memoria.

    SELECT  jq.USR_USUARIO,
            jq.USR_NOMBRE,
            jq.USR_CORREO,
            jq.USR_TELEFONO,
            jq.USR_EXTENSION,
            jq.DEP_DEPARTAMENTO,
            jq.USR_UBICACION,
            jq.USR_EQUIPO,
            jq.USR_PASSWORD,
            jq.USR_ACTIVO,
            jq.USR_ROL
    BULK COLLECT INTO V_TEMP_USR
    FROM json_table(JSON_USUARIO, '$[*]'
        COLUMNS (            
            USR_USUARIO     NUMBER        PATH '$.USR_USUARIO',
            USR_NOMBRE      VARCHAR2(200) PATH '$.USR_NOMBRE',
            USR_CORREO      VARCHAR2(150) PATH '$.USR_CORREO',
            USR_TELEFONO    VARCHAR2(20)  PATH '$.USR_TELEFONO',
            USR_EXTENSION   VARCHAR2(10)  PATH '$.USR_EXTENSION',
            DEP_DEPARTAMENTO       NUMBER PATH '$.DEP_DEPARTAMENTO',
            USR_UBICACION   VARCHAR2(200) PATH '$.USR_UBICACION',
            USR_EQUIPO      VARCHAR2(100) PATH '$.USR_EQUIPO',
            USR_PASSWORD    VARCHAR2(200) PATH '$.USR_PASSWORD',
            USR_ACTIVO      CHAR(1)       PATH '$.USR_ACTIVO',
            USR_ROL         VARCHAR2(50)  PATH '$.USR_ROL'
        )
    ) jq;

    -- 2. Se valida primero que se hayan obtenido registros.
    --    Si no se obtuvieron registros, se muestra un mensaje y se termina la ejecución.

    IF V_TEMP_USR.COUNT = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No se han encontrado registros.');
        RETURN;
    END IF;
    
    -- 3. Ya con los datos en memoria, se procede a recorrer la tabla temporal
    --    e insertar uno por uno los registros en la tabla HDK_USUARIO.
    --    (Podría hacerse con un INSERT ALL, pero se hace así para mayor claridad).
    
    FOR i IN V_TEMP_USR.FIRST .. V_TEMP_USR.LAST LOOP
        V_REGISTRO := V_TEMP_USR(i);
        
        IF (V_REGISTRO.USR_PASSWORD IS NULL OR V_REGISTRO.USR_PASSWORD = '') THEN
            -- Si no se envió password, se obtiene el actual de la BD para no sobreescribirlo con NULL.
            SELECT USR_PASSWORD INTO V_REGISTRO.USR_PASSWORD
            FROM HDK_USUARIO
            WHERE USR_USUARIO = V_REGISTRO.USR_USUARIO;
        END IF;
        
        UPDATE HDK_USUARIO
        SET USR_NOMBRE        = V_REGISTRO.USR_NOMBRE,
            USR_CORREO        = V_REGISTRO.USR_CORREO,
            USR_TELEFONO      = V_REGISTRO.USR_TELEFONO,
            USR_EXTENSION     = V_REGISTRO.USR_EXTENSION,
            DEP_DEPARTAMENTO  = V_REGISTRO.DEP_DEPARTAMENTO,
            USR_UBICACION     = V_REGISTRO.USR_UBICACION,
            USR_EQUIPO        = V_REGISTRO.USR_EQUIPO,
            USR_PASSWORD      = V_REGISTRO.USR_PASSWORD,
            USR_ACTIVO        = V_REGISTRO.USR_ACTIVO,
            USR_ROL           = V_REGISTRO.USR_ROL
        WHERE USR_USUARIO     = V_REGISTRO.USR_USUARIO;
    END LOOP;

    IF V_TEMP_USR.COUNT = 1 THEN
        P_ID := V_REGISTRO.USR_USUARIO;
    ELSE
        SELECT MAX(USR_USUARIO) INTO P_ID FROM HDK_USUARIO;
    END IF;
END;
