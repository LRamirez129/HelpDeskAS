import oracledb from "oracledb";
import { initPool } from "../config/db";
import { ListTicketsQuery } from "../schemas/tickets";
import type { JWTPayload } from "../auth/jwt";

type TicketRow = Record<string, any>;

export interface ListTicketsResult {
  page: number;
  pageSize: number;
  total: number;
  items: TicketRow[];
}

export async function listTickets(q: ListTicketsQuery, viewer: JWTPayload): Promise<ListTicketsResult> {
  const search = q.search ? `%${q.search.toLowerCase()}%` : null;
  const viewerEmailLower = viewer.email.toLowerCase();

  const owner = process.env.ORA_VIEW_OWNER?.trim();
  const VIEW = owner ? `${owner}.VW_TICKET_FULL` : "VW_TICKET_FULL";

  const roleWhere =
    viewer.role === "ADMIN"
      ? "1=1"
      : viewer.role === "TECH"
      ? "(LOWER(v.reportante_email) = :viewerEmailLower1 OR LOWER(v.tecnico_email_actual) = :viewerEmailLower2)"
      : "(LOWER(v.reportante_email) = :viewerEmailLower1)";

  try {
    await initPool();
    const pool = oracledb.getPool();
    const conn = await pool.getConnection();

    if (process.env.ORA_CURRENT_SCHEMA) {
      await conn.execute(`ALTER SESSION SET CURRENT_SCHEMA=${process.env.ORA_CURRENT_SCHEMA}`);
    }

    const baseWhere = `
      WHERE ${roleWhere}
        AND (v.es_final = NVL(:estadoFinal, v.es_final))
        AND (:search IS NULL OR (LOWER(v.titulo) LIKE :search))
        AND (v.categoria = NVL(:categoria, v.categoria))
        AND (v.subcategoria = NVL(:subcategoria, v.subcategoria))
        AND (v.tecnico_nombre_actual = NVL(:tecnico, v.tecnico_nombre_actual))
    `;

    const countSql = `SELECT COUNT(*) AS total FROM ${VIEW} v ${baseWhere}`;
    const pageSql = `
  SELECT * FROM (
    SELECT
      v.TIC_TICKET,
      v.titulo,
      v.categoria,
      v.subcategoria,
      v.estado,
      v.prioridad,
      v.tecnico_nombre_actual,
      v.tecnico_email_actual,
      v.reportante_email,
      v.creado_en,
      v.es_final,
      ROW_NUMBER() OVER (ORDER BY v.creado_en DESC) rn
    FROM ${VIEW} v
    ${baseWhere}
  )
  WHERE rn BETWEEN :a AND :b
`;

    // 🔹 binds comunes (sin a/b)
    const countBinds: Record<string, any> = {
      estadoFinal: q.estadoFinal ?? null,
      search,
      categoria: q.categoria ?? null,
      subcategoria: q.subcategoria ?? null,
      tecnico: q.tecnico ?? null,
    };

    // 🔹 agrega binds según rol (¡sin sobrar!)
    if (viewer.role === "TECH") {
      countBinds.viewerEmailLower1 = viewerEmailLower;
      countBinds.viewerEmailLower2 = viewerEmailLower;
    } else if (viewer.role === "USER") {
      countBinds.viewerEmailLower1 = viewerEmailLower;
    }
    // ADMIN: no agrega viewerEmailLower*

    // 🔹 pageBinds = countBinds + a/b
    const pageBinds = {
      ...countBinds,
      a: (q.page - 1) * q.pageSize + 1,
      b: q.page * q.pageSize,
    };

    const countRes = await conn.execute(countSql, countBinds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    const total = Number((countRes.rows?.[0] as any)?.TOTAL ?? 0);

    const listRes = await conn.execute(pageSql, pageBinds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    const items = (listRes.rows ?? []) as TicketRow[];

    await conn.close();

    console.log("[DAO] /tickets source=DB rows=", items.length, "total=", total, "role=", viewer.role);
    return { page: q.page, pageSize: q.pageSize, total, items };
  } catch (e: any) {
    console.warn("[DAO] /tickets source=MOCK reason=", e?.message || e);

    // MOCK filtrado por rol
    const seed: TicketRow[] = [
      { TIC_TICKET: 1001, titulo: "Login Issue", categoria: "Soporte",   subcategoria: "App",  estado: "Creado",      prioridad: "Media", tecnico_nombre_actual: "María Tech", tecnico_email_actual: "tech@local.test", reportante_email: "user@local.test",  creado_en: new Date().toISOString() },
      { TIC_TICKET: 1002, titulo: "DB Connection", categoria: "Infra",    subcategoria: "DB",   estado: "En Proceso",  prioridad: "Alta",  tecnico_nombre_actual: "Juan Tech",  tecnico_email_actual: "tech@local.test", reportante_email: "admin@local.test", creado_en: new Date(Date.now()-1*864e5).toISOString() },
      { TIC_TICKET: 1003, titulo: "Email Bug",     categoria: "Soporte",  subcategoria: "Mail", estado: "En Proceso",  prioridad: "Baja",  tecnico_nombre_actual: "María Tech", tecnico_email_actual: "tech@local.test", reportante_email: "user@local.test",  creado_en: new Date(Date.now()-2*864e5).toISOString() },
      { TIC_TICKET: 1004, titulo: "Dark Mode",     categoria: "Producto", subcategoria: "UI",   estado: "Terminado",   prioridad: "Media", tecnico_nombre_actual: "Juan Tech",  tecnico_email_actual: "tech@local.test", reportante_email: "admin@local.test", creado_en: new Date(Date.now()-3*864e5).toISOString() },
      { TIC_TICKET: 1005, titulo: "Notificaciones",categoria: "Soporte",  subcategoria: "App",  estado: "Terminado",   prioridad: "Alta",  tecnico_nombre_actual: "María Tech", tecnico_email_actual: "tech@local.test", reportante_email: "user@local.test",  creado_en: new Date(Date.now()-4*864e5).toISOString() },
      { TIC_TICKET: 1006, titulo: "Permisos",      categoria: "Seguridad",subcategoria: "RBAC", estado: "Historial",   prioridad: "Baja",  tecnico_nombre_actual: "Juan Tech",  tecnico_email_actual: "tech@local.test", reportante_email: "admin@local.test", creado_en: new Date(Date.now()-5*864e5).toISOString() },
    ];

    const allowed = seed.filter(row => {
      if (viewer.role === "ADMIN") return true;
      if (viewer.role === "TECH") {
        return row.reportante_email === viewer.email || row.tecnico_email_actual === viewer.email;
      }
      return row.reportante_email === viewer.email;
    });

    const start = (q.page - 1) * q.pageSize;
    const items = allowed.slice(start, start + q.pageSize);
    const total = allowed.length;

    return { page: q.page, pageSize: q.pageSize, total, items };
  }
}
