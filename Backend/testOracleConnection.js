// testOracleConnection.js
import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.ORA_USER,
      password: process.env.ORA_PASSWORD,
      connectString: process.env.ORA_CONNECT_STRING
    });
    console.log("¡Conexión exitosa a Oracle!");
    await connection.close();
  } catch (err) {
    console.error("Error de conexión:", err);
  }
}

testConnection();