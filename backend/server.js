// ============================================================
//  server.js  –  API REST para el sistema de Ventas
//  Requiere: npm install express mssql bcrypt cors dotenv
// ============================================================

require('dotenv').config();          // carga .env
const express = require('express');
const mssql = require('mssql');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────────────
app.use(cors());                     // permite peticiones desde el frontend
app.use(express.json());             // parsea JSON en el body

// ── Configuración de SQL Server ──────────────────────────────
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,   // ej. "localhost" o ".\SQLEXPRESS"
    database: process.env.DB_NAME,     // Ventas
    options: {
        encrypt: false,     // true si usas Azure
        trustServerCertificate: true,   // necesario en entornos locales
    },
    pool: {
        max: 10, min: 0, idleTimeoutMillis: 30000,
    },
};

// Conexión única reutilizable
let pool;
async function getPool() {
    if (!pool) pool = await mssql.connect(sqlConfig);
    return pool;
}

// ── RUTA: Registrar usuario ──────────────────────────────────
//  POST /api/registro
//  Body: { primerNombre, segundoNombre, primerApellido, segundoApellido, correo, contrasena }
app.post('/api/registro', async (req, res) => {
    const {
        primerNombre, segundoNombre,
        primerApellido, segundoApellido,
        correo, contrasena,
    } = req.body;

    // ── Validación básica ──
    if (!primerNombre || !primerApellido || !correo || !contrasena) {
        return res.status(400).json({ ok: false, mensaje: 'Faltan campos obligatorios.' });
    }

    if (contrasena.length < 8) {
        return res.status(400).json({ ok: false, mensaje: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    try {
        const db = await getPool();

        // ── ¿Ya existe el correo? ──
        const existe = await db.request()
            .input('correo', mssql.NVarChar(255), correo)
            .query('SELECT 1 FROM Usuarios WHERE Correo = @correo');

        if (existe.recordset.length > 0) {
            return res.status(409).json({ ok: false, mensaje: 'Ya existe una cuenta con ese correo.' });
        }

        // ── Hash de contraseña (bcrypt, 12 rondas) ──
        const hash = await bcrypt.hash(contrasena, 12);

        // ── Insertar en BD ──
        await db.request()
            .input('primerNombre', mssql.NVarChar(120), primerNombre)
            .input('segundoNombre', mssql.NVarChar(120), segundoNombre || '')
            .input('primerApellido', mssql.NVarChar(120), primerApellido)
            .input('segundoApellido', mssql.NVarChar(120), segundoApellido || '')
            .input('correo', mssql.NVarChar(255), correo)
            .input('hash', mssql.NVarChar(255), hash)
            .query(`
        INSERT INTO Usuarios
          (PrimerNombre, SegundoNombre, PrimerApellido, SegundoApellido, Correo, Contrasena)
        VALUES
          (@primerNombre, @segundoNombre, @primerApellido, @segundoApellido, @correo, @hash)
      `);

        return res.status(201).json({ ok: true, mensaje: 'Cuenta creada exitosamente.' });

    } catch (err) {
        console.error('Error en /api/registro:', err);
        return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
    }
});

// ── RUTA: Iniciar sesión ─────────────────────────────────────
//  POST /api/login
//  Body: { correo, contrasena }
app.post('/api/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ ok: false, mensaje: 'Correo y contraseña son requeridos.' });
    }

    try {
        const db = await getPool();

        const resultado = await db.request()
            .input('correo', mssql.NVarChar(255), correo)
            .query(`
        SELECT Id, PrimerNombre, PrimerApellido, Contrasena, Activo
        FROM Usuarios
        WHERE Correo = @correo
      `);

        const usuario = resultado.recordset[0];

        if (!usuario) {
            return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
        }

        if (!usuario.Activo) {
            return res.status(403).json({ ok: false, mensaje: 'Tu cuenta está desactivada.' });
        }

        // Comparar contraseña con hash
        const valida = await bcrypt.compare(contrasena, usuario.Contrasena);

        if (!valida) {
            return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
        }

        return res.json({
            ok: true,
            mensaje: 'Inicio de sesión exitoso.',
            usuario: {
                id: usuario.Id,
                nombre: `${usuario.PrimerNombre} ${usuario.PrimerApellido}`,
            },
        });

    } catch (err) {
        console.error('Error en /api/login:', err);
        return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
    }
});

// ── Iniciar servidor ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅  Servidor corriendo en http://localhost:${PORT}`);
});