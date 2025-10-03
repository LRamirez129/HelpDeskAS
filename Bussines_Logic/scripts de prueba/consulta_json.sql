/*
2025-10-02 - WBlanco
Consulta de un JSON con JSON_TABLE
El presente script muestra como consultar un JSON utilizando la función JSON_TABLE.
Este ejemplo será la base para los Stored Procedures que se crearán para los CRUD.
*/

DECLARE
    -- Definición de tipos para almacenar los datos extraídos del JSON.
    -- Cuando se hagan los Stored Procedures, este tipo será más bien del tipo de registro
    -- de la tabla en cuestión, algo así: T_ENTIDAD_OBJECT IS ENTIDAD%ROWTYPE;
    TYPE T_PERSONA_OBJECT IS RECORD (
        name NVARCHAR2(50),
        age NUMBER,
        city NVARCHAR2(50)
    );
    TYPE T_PERSONA_TABLE IS TABLE OF T_PERSONA_OBJECT;

    -- Variable para almacenar el JSON
    V_JSON_OBJECT_ARRAY VARCHAR2(1000);    
    -- Variables para almacenar los datos extraídos
    V_REGISTRO T_PERSONA_OBJECT;
    V_TEMP_PERSONA T_PERSONA_TABLE;      

BEGIN
    -- Asignación del JSON a la variable
    -- En los Stored Procedures, este JSON vendrá como parámetro de entrada.
    V_JSON_OBJECT_ARRAY := '[{
        "name": "John",
        "age": 30,
        "city": "New York"
        },
        {
        "name": "Dave",
        "age": 25,
        "city": "Los Angeles"
        }]';

    -- Consulta del JSON y salida de los datos

    SELECT jt.name, jt.age, jt.city
    BULK COLLECT INTO V_TEMP_PERSONA
    FROM json_table(V_JSON_OBJECT_ARRAY, '$[*]'
        COLUMNS (
            name NVARCHAR2(50) PATH '$.name',
            age NUMBER PATH '$.age',
            city NVARCHAR2(50) PATH '$.city'
        )
    ) jt;

    IF V_TEMP_PERSONA.COUNT = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No se han encontrado registros.');
        RETURN;
    END IF;
    
    FOR i IN V_TEMP_PERSONA.FIRST .. V_TEMP_PERSONA.LAST LOOP
        V_REGISTRO := V_TEMP_PERSONA(i);
        DBMS_OUTPUT.PUT_LINE('');
        DBMS_OUTPUT.PUT_LINE('Registro ' || i || ':');
        DBMS_OUTPUT.PUT_LINE('Nombre: ' || V_REGISTRO.name);
        DBMS_OUTPUT.PUT_LINE('Edad: ' || V_REGISTRO.age);
        DBMS_OUTPUT.PUT_LINE('Ciudad: ' || V_REGISTRO.city);
    END LOOP;    
END;
