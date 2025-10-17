import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Devolver siempre resultados como objetos { COLUMNA: valor }
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let pool = null;

// Revisa variables de entorno requeridas
function requireEnv() {
    const { ORA_USER, ORA_PASSWORD, ORA_CONNECT_STRING } = process.env;
    if (!ORA_USER || !ORA_PASSWORD || !ORA_CONNECT_STRING) {
        throw new Error("Faltan ORA_USER / ORA_PASSWORD / ORA_CONNECT_STRING en .env");
    }
    return {
        user: ORA_USER,
        password: ORA_PASSWORD,
        connectString: ORA_CONNECT_STRING,
    };
}

// Inicializa el pool de conexiones
export async function initPool() {
    if (pool) return pool;
    const cfg = requireEnv();

    pool = await oracledb.createPool({
        ...cfg,
        poolMin: 0,
        poolMax: 4,
        poolIncrement: 1,
        // Cada conexión usará el schema indicado (si está en .env)
        sessionCallback: async (connection, requestedTag, cb) => {
            try {
                const schema = process.env.ORA_CURRENT_SCHEMA || process.env.ORA_VIEW_OWNER;
                if (schema) {
                    await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = ${schema}`);
                }
                cb();
            } catch (err) {
                cb(err);
            }
        },
    });

    return pool;
}

// Ejecuta una consulta genérica
export async function execute(sql, binds = {}, options = {}) {
    const p = await initPool();
    let conn; // Declaramos conn aquí para el bloque finally
    try {
        conn = await p.getConnection(); // Obtenemos la conexión
        
        // 🏆 CORRECCIÓN CLAVE: Esto asegura que INSERT/UPDATE/DELETE se guarden.
        options.autoCommit = true; 

        const result = await conn.execute(sql, binds, options);
        return result;
    } finally {
        // Asegura que la conexión se cierre correctamente
        if (conn) {
            await conn.close(); 
        }
    }
}

// Cierra el pool (para tests o reinicio del server)
export async function closePool() {
    if (pool) {
        await pool.close(10); // 10s para cerrar conexiones activas
        pool = null;
    }
}

export { oracledb };