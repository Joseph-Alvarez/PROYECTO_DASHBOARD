// backend/controllers/authController.js


const mssql = require('mssql');
const bcrypt = require('bcrypt');
const { getPool } = require('../config/db');

const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena)
        return res.status(400).json({ ok: false, mensaje: 'Correo y contraseña son requeridos.' });

    try {
        const db = await getPool();
        const resultado = await db.request()
            .input('correo', mssql.NVarChar(255), correo)
            .query(`
                SELECT u.Id, u.PrimerNombre, u.PrimerApellido, u.Contrasena, u.Activo,
                       r.Nombre AS Rol
                FROM Usuarios u
                LEFT JOIN UsuariosRoles ur ON u.Id = ur.UsuarioId
                LEFT JOIN Roles r          ON ur.RolId = r.Id
                WHERE u.Correo = @correo
            `);

        const usuario = resultado.recordset[0];

        if (!usuario)
            return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });

        if (!usuario.Activo)
            return res.status(403).json({ ok: false, mensaje: 'Tu cuenta está desactivada.' });

        const valida = await bcrypt.compare(contrasena, usuario.Contrasena);

        if (!valida)
            return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });

        return res.json({
            ok: true,
            mensaje: 'Inicio de sesión exitoso.',
            usuario: {
                id: usuario.Id,
                nombre: `${usuario.PrimerNombre} ${usuario.PrimerApellido}`,
                rol: usuario.Rol || 'Sin rol',
            },
        });

    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
    }
};


const registro = async (req, res) => {
    const { primerNombre, segundoNombre, primerApellido, segundoApellido, correo, contrasena } = req.body;

    if (!primerNombre || !primerApellido || !correo || !contrasena)
        return res.status(400).json({ ok: false, mensaje: 'Faltan campos obligatorios.' });

    if (contrasena.length < 8)
        return res.status(400).json({ ok: false, mensaje: 'La contraseña debe tener al menos 8 caracteres.' });

    try {
        const db = await getPool();

        const existe = await db.request()
            .input('correo', mssql.NVarChar(255), correo)
            .query('SELECT 1 FROM Usuarios WHERE Correo = @correo');

        if (existe.recordset.length > 0)
            return res.status(409).json({ ok: false, mensaje: 'Ya existe una cuenta con ese correo.' });

        const hash = await bcrypt.hash(contrasena, 12);

        await db.request()
            .input('primerNombre', mssql.NVarChar(120), primerNombre)
            .input('segundoNombre', mssql.NVarChar(120), segundoNombre || '')
            .input('primerApellido', mssql.NVarChar(120), primerApellido)
            .input('segundoApellido', mssql.NVarChar(120), segundoApellido || '')
            .input('correo', mssql.NVarChar(255), correo)
            .input('hash', mssql.NVarChar(255), hash)
            .query(`
                INSERT INTO Usuarios (PrimerNombre, SegundoNombre, PrimerApellido, SegundoApellido, Correo, Contrasena)
                VALUES (@primerNombre, @segundoNombre, @primerApellido, @segundoApellido, @correo, @hash)
            `);

        return res.status(201).json({ ok: true, mensaje: 'Cuenta creada exitosamente.' });

    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
    }
};

module.exports = { login, registro };