CREATE OR REPLACE TRIGGER TRG_AFTER_INSERT_TICKET
AFTER INSERT ON HDK_TICKET
FOR EACH ROW
DECLARE
    v_tecnico HDK_TECNICO.TEC_Tecnico%TYPE;
BEGIN
    -- Localizo al tecnico segun la categoria del ticket
    :NEW.creation_date := SYSDATE;
    SELECT TEC_Tecnico INTO v_tecnico
      FROM HDK_TECNICO
     WHERE EQUIPO = :NEW.categoria;

     :NEW.TIC_Asignado := v_tecnico;

END;
/