import oracledb from "oracledb";
import { initPool } from "../config/db";

export interface DbUser {
  id: number;                                  // USU_USUARIO (o tu PK)
  email: string;                               // CORREO
  role: "USER" | "TECH" | "ADMIN";             // ROL
  passHash: string | null;                     // PASS_HASH (puede ser NULL en dev)
  activo: "S" | "N";                           // ACTIVO
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  await initPool();

  const owner = process.env.ORA_VIEW_OWNER?.trim();
  const TABLE = owner ? `${owner}.HDESK_USUARIO` : "HDESK_USUARIO";

  const sql = `
    SELECT
      u.USU_USUARIO AS ID,
      u.CORREO      AS EMAIL,
      u.ROL         AS ROLE,
      u.PASS_HASH   AS PASS_HASH,
      u.ACTIVO      AS ACTIVO
    FROM ${TABLE} u
    WHERE TRIM(LOWER(u.CORREO)) = :emailLower
  `;

  const binds = { emailLower: email.toLowerCase().trim() };

  const pool = oracledb.getPool();
  const conn = await pool.getConnection();
  try {
    const res = await conn.execute(sql, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log(sql);
    const row = (res.rows ?? [])[0] as any;
    if (!row) return null;

    return {
      id: Number(row.ID),
      email: row.EMAIL,
      role: row.ROLE,
      passHash: row.PASS_HASH ?? null,
      activo: row.ACTIVO,
    };
  } finally {
    await conn.close();
  }
}
