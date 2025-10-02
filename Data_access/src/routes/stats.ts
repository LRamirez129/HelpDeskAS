import { Router } from "express";
import oracledb from "oracledb";
import { initPool } from "../config/db";
import { authRequired } from "../auth/middleware";
import type { JWTPayload } from "../auth/jwt";

const router = Router();

router.get("/overview", authRequired, async (req, res) => {
  const viewer = (req as any).user as JWTPayload;

  const owner = process.env.ORA_VIEW_OWNER?.trim();
  const VIEW = owner ? `${owner}.VW_TICKET_FULL` : "VW_TICKET_FULL";
  const viewerEmailLower = viewer.email.toLowerCase();

  const roleWhere =
    viewer.role === "ADMIN"
      ? "1=1"
      : viewer.role === "TECH"
      ? "(LOWER(v.reportante_email) = :viewerEmailLower OR LOWER(v.tecnico_email_actual) = :viewerEmailLower)"
      : "(LOWER(v.reportante_email) = :viewerEmailLower)";

  const sql = `
    SELECT
      SUM(CASE WHEN v.es_final = 'N' THEN 1 ELSE 0 END)                       AS ABIERTOS,
      SUM(CASE WHEN UPPER(v.estado) = 'EN PROCESO' THEN 1 ELSE 0 END)         AS EN_PROCESO,
      SUM(CASE WHEN v.es_final = 'S' THEN 1 ELSE 0 END)                       AS FINALIZADOS,
      COUNT(*)                                                                AS TOTAL
    FROM ${VIEW} v
    WHERE ${roleWhere}
  `;

  try {
    await initPool();
    const conn = await oracledb.getConnection();
    const r = await conn.execute(sql, { viewerEmailLower }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await conn.close();

    const row = (r.rows?.[0] as any) || {};
    return res.json({
      ok: true,
      cards: {
        abiertos: Number(row.ABIERTOS ?? 0),
        enProceso: Number(row.EN_PROCESO ?? 0),
        finalizados: Number(row.FINALIZADOS ?? 0),
        total: Number(row.TOTAL ?? 0),
      },
    });
  } catch (e) {
    console.error("[STATS] overview error:", e);
    return res.json({
      ok: true, source: "MOCK",
      cards: { abiertos: 0, enProceso: 0, finalizados: 0, total: 0 }
    });
  }
});

export default router;
