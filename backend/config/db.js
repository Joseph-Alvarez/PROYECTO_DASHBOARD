const mssql = require('mssql');

// ── Configuración de SQL Server ─── //
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    pool: {
        max: 10, min: 0, idleTimeoutMillis: 30000,
    },
};

// ─── Conexión reutilizable ─── //
let pool;
async function getPool() {
    if (!pool) pool = await mssql.connect(sqlConfig);
    return pool;
}

module.exports = { getPool };