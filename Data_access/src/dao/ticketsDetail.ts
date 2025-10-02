import oracledb from "oracledb";
import { initPool } from "../config/db";
import type { JWTPayload } from "../auth/jwt";


export interface TicketDetailRow {
  TIC_TICKET: number;
  TITULO: string | null;
  DESCRIPCION: string | null;     // CLOB → STRING
  CREADO_EN: string | Date | null;
  CERRADO_EN: string | Date | null;
  CATEGORIA: string | null;
  SUBCATEGORIA: string | null;
  PRIORIDAD: string | null;
  ESTADO: string | null;
  TECNICO_NOMBRE_ACTUAL: string | null;
  TECNICO_EMAIL_ACTUAL: string | null;
  REPORTANTE_EMAIL: string | null;
}

export type AttachmentRow = {
  TIC_TICKET: number;
  TAD_TICKETADJUNTO: number;
  CREADO_EN: string | Date | null;
  NOMBRE: string | null;
  URL: string | null;
  MIME_TYPE: string | null;
  TAMANO: number | null;
};

export async function getTicketDetail(id: number, viewer: JWTPayload) {
  await initPool();
  const pool = oracledb.getPool();
  const conn = await pool.getConnection();

  const owner = process.env.ORA_VIEW_OWNER?.trim();
  const BASE = owner ? `${owner}.VW_TICKET_BASE` : `VW_TICKET_BASE`;
  const ASIG = owner ? `${owner}.VW_TICKET_ASIGNACION_ACTUAL` : `VW_TICKET_ASIGNACION_ACTUAL`;
  const REP  = owner ? `${owner}.VW_TICKET_REPORTANTE` : `VW_TICKET_REPORTANTE`;

  // Filtro por rol (ADMIN ve todo; TECH ve si es reportante o técnico; USER solo si es reportante)
  const sql = `
    SELECT
      b.TIC_TICKET,
      b.titulo                        AS TITULO,
      b.descripcion                   AS DESCRIPCION,   -- CLOB → fetchInfo
      b.creado_en                     AS CREADO_EN,
      b.cerrado_en                    AS CERRADO_EN,
      b.categoria                     AS CATEGORIA,
      b.subcategoria                  AS SUBCATEGORIA,
      b.prioridad                     AS PRIORIDAD,
      b.estado                        AS ESTADO,
      a.tecnico_nombre_actual         AS TECNICO_NOMBRE_ACTUAL,
      a.tecnico_email_actual          AS TECNICO_EMAIL_ACTUAL,
      r.reportante_email              AS REPORTANTE_EMAIL
    FROM ${BASE} b
    LEFT JOIN ${ASIG} a ON a.TIC_Ticket = b.TIC_TICKET
    LEFT JOIN ${REP}  r ON r.TIC_Ticket = b.TIC_TICKET
    WHERE b.TIC_TICKET = :id
      AND (
        :isAdmin = 1
        OR (:isTech = 1 AND (LOWER(r.reportante_email) = :viewer OR LOWER(a.tecnico_email_actual) = :viewer))
        OR (:isUser = 1 AND LOWER(r.reportante_email) = :viewer)
      )
  `;

  const binds = {
    id,
    isAdmin: viewer.role === "ADMIN" ? 1 : 0,
    isTech:  viewer.role === "TECH"  ? 1 : 0,
    isUser:  viewer.role === "USER"  ? 1 : 0,
    viewer:  viewer.email.toLowerCase(),
  };

  try {
    const res = await conn.execute<TicketDetailRow>(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      fetchInfo: { DESCRIPCION: { type: oracledb.STRING } }, // CLOB → string
      maxRows: 1,
    });
    return res.rows?.[0] ?? null;
  } finally {
    await conn.close();
  }
}

export async function listTicketAttachments(ticketId: number): Promise<AttachmentRow[]> {
  const owner = process.env.ORA_VIEW_OWNER?.trim();
  const VIEW = owner ? `${owner}.VW_TICKET_ADJUNTO` : "VW_TICKET_ADJUNTO";

  console.log("[ATT] using VIEW =", VIEW, "ticketId=", ticketId); // <<<<<<
  await initPool();
  const conn = await oracledb.getPool().getConnection();
  try {
    const sql = `
      SELECT TIC_TICKET, TAD_TICKETADJUNTO, CREADO_EN, NOMBRE, URL, MIME_TYPE, TAMANO
      FROM ${VIEW} v
      WHERE v.TIC_TICKET = :id
      ORDER BY v.CREADO_EN DESC
    `;
    console.log("[ATT] SQL >>>", sql); // <<<<<<

    const rs = await conn.execute(sql, { id: ticketId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    const items = (rs.rows ?? []) as AttachmentRow[];
    console.log("[ATT] rows=", items.length);
    return items;
  } catch (e) {
    console.warn("[ATT] ERROR:", (e as any)?.message || e);
    return [];
  } finally {
    await conn.close();
  }
}

