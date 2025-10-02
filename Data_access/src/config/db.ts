import oracledb from "oracledb";

let pool: oracledb.Pool | null = null;

function requireEnv() {
  const { ORA_USER, ORA_PASSWORD, ORA_CONNECT_STRING } = process.env;
  if (!ORA_USER || !ORA_PASSWORD || !ORA_CONNECT_STRING) {
    throw new Error(
      "Faltan variables ORA_USER / ORA_PASSWORD / ORA_CONNECT_STRING en .env"
    );
  }
  return { user: ORA_USER, password: ORA_PASSWORD, connectString: ORA_CONNECT_STRING };
}

export async function initPool() {
  if (pool) return pool;
  const cfg = requireEnv();
  // Modo Thin (no requiere Instant Client). Ajusta límites si necesitas.
  pool = await oracledb.createPool({
    ...cfg,
    poolMin: 0,
    poolMax: 4,
    poolIncrement: 1,
    queueTimeout: 60_000
  });
  return pool;
}

export async function closePool() {
  if (pool) {
    await pool.close(10); // 10s para cerrar conexiones activas
    pool = null;
  }
}

export async function pingDB() {
  const p = pool ?? await initPool();
  const conn = await p.getConnection();
  try {
    const res = await conn.execute(
      "SELECT 1 AS OK FROM dual",
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const row = (res.rows as any[])[0];
    return row?.OK ?? row?.ok ?? null; // debería ser 1
  } finally {
    await conn.close();
  }
}

oracledb.fetchAsString = [oracledb.CLOB];