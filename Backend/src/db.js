import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let pool = null;
let activeConnections = 0; // 👈 Monitor de conexiones

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

// 🟢 FUNCIÓN EXPORTADA NECESARIA PARA server.js
export async function initPool() {
    if (pool) return pool;
    const cfg = requireEnv();

    pool = await oracledb.createPool({
        ...cfg,
        poolMin: 2,
        poolMax: 25, // Usamos el valor alto para mayor capacidad
        poolIncrement: 1,
        queueTimeout: 120000, 
        poolTimeout: 60,
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
    console.log(`Pool inicializado: Min 2, Max 25.`);
    return pool;
}

// 🟢 FUNCIÓN EXPORTADA NECESARIA PARA server.js
export async function execute(sql, binds = {}, options = {}) {
    const p = await initPool();
    let conn; 
    try {
        conn = await p.getConnection(); 
        
        // 🟢 REGISTRO DE CONEXIÓN OBTENIDA
        activeConnections++;
        console.log(`[ORADB] Conexión obtenida. Activas: ${activeConnections}`);
        
        const finalOptions = {
            ...options,
            autoCommit: true,
        };

        const result = await conn.execute(sql, binds, finalOptions);
        return result;
    } finally {
        if (conn) {
            await conn.close(); 
            
            // 🔴 REGISTRO DE CONEXIÓN LIBERADA
            activeConnections--;
            console.log(`[ORADB] Conexión liberada. Activas: ${activeConnections}`);
        }
    }
}

// 🟢 FUNCIÓN EXPORTADA NECESARIA PARA tickets.js, etc.
export { oracledb }; 

// 🟢 FUNCIÓN EXPORTADA (Si aún la usas en otro lado)
export async function closePool() {
    if (pool) {
        await pool.close(10);
        pool = null;
    }
}