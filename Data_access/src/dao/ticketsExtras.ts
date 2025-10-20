import oracledb from "oracledb";
import { initPool } from "../config/db";

const owner = process.env.ORA_VIEW_OWNER?.trim();
const VW_COM = owner ? `${owner}.VW_TICKET_COMENTARIO` : "VW_TICKET_COMENTARIO";
const VW_ATT = owner ? `${owner}.VW_TICKET_ADJUNTO` : "VW_TICKET_ADJUNTO";

/* ================== COMENTARIOS ================== */
export interface TicketCommentRow {
  COMENTARIO_ID: number;
  TIC_TICKET: number;
  TEXTO: string | null;
  CREADO_EN: string | null;
  AUTOR_EMAIL?: string | null;
  AUTOR_NOMBRE?: string | null;
  VISIBILIDAD?: string | null;
}

export async function listTicketComments(id: number): Promise<TicketCommentRow[]> {
  await initPool();
  const conn = await oracledb.getConnection();
  try {
    const sql = `
      SELECT
        c.TCO_TICKETCOMENTARIO AS COMENTARIO_ID,
        c.TIC_TICKET,
        c.TEXTO,
        c.CREADO_EN,
        c.CREADO_POR_EMAIL     AS AUTOR_EMAIL,
        c.CREADO_POR           AS AUTOR_NOMBRE,
        c.VISIBILIDAD
      FROM ${VW_COM} c
      WHERE c.TIC_TICKET = :id
      ORDER BY c.CREADO_EN DESC
    `;
    const result = await conn.execute(
      sql,
      { id },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        fetchInfo: { TEXTO: { type: oracledb.STRING } }, // ← CLOB → string
      }
    );
    return (result.rows ?? []) as TicketCommentRow[];
  } finally {
    await conn.close();
  }
}

/* ================== ADJUNTOS (metadatos) ================== */
export interface TicketAttachmentRow {
  ADJUNTO_ID: number;
  TIC_TICKET: number;
  NOMBRE_ARCHIVO?: string | null;
  MIME_TYPE?: string | null;
  TAMANIO_BYTES?: number | null;
  CREADO_EN?: string | null;
  CREADO_POR_EMAIL?: string | null;
  VISIBILIDAD?: string | null;
}

export async function listTicketAttachments(id: number): Promise<TicketAttachmentRow[]> {
  await initPool();
  const conn = await oracledb.getConnection();
  try {
    const sql = `
      SELECT
        a.TAD_TICKETADJUNTO AS ADJUNTO_ID,
        a.TIC_TICKET,
        a.NOMBRE_ARCHIVO,
        a.MIME_TYPE,
        a.TAMANIO_BYTES,
        a.CREADO_EN,
      FROM ${VW_ATT} a
      WHERE a.TIC_TICKET = :id
      ORDER BY a.CREADO_EN DESC
    `;
    const r = await conn.execute(sql, { id }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return (r.rows ?? []) as TicketAttachmentRow[];
  } catch (e: any) {
    console.warn("[DAO] listTicketAttachments fallback:", e?.message || e);
    return [];
  } finally {
    await conn.close();
  }
}
