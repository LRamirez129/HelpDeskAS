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
    v_nombre NVARCHAR2(50);
    v_ciudad NVARCHAR2(50);
    v_edad NUMBER;
    -- Cursor para consultar el JSON utilizando JSON_TABLE
    CURSOR JSONQUERY IS
    SELECT jt.name, jt.age, jt.city
    FROM json_table(V_JSON_OBJECT_ARRAY, '$[*]'
        COLUMNS (
            name NVARCHAR2(50) PATH '$.name',
            age NUMBER PATH '$.age',
            city NVARCHAR2(50) PATH '$.city'
        )
    ) jt;

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
    OPEN JSONQUERY;
    LOOP
        FETCH JSONQUERY INTO v_nombre, v_edad, v_ciudad;
        EXIT WHEN JSONQUERY%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE('');
        DBMS_OUTPUT.PUT_LINE('Nombre: ' || v_nombre);
        DBMS_OUTPUT.PUT_LINE('Edad: ' || v_edad);
        DBMS_OUTPUT.PUT_LINE('Ciudad: ' || v_ciudad);
        
    END LOOP;
    CLOSE JSONQUERY;
END;
