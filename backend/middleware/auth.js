// backend/middleware/auth.js

function verificarToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ ok: false, mensaje: 'Acceso denegado. Token requerido.' });
    }

    // Por ahora verificacion simple, en produccion usarias JWT
    if (token !== 'mi-token-secreto') {
        return res.status(403).json({ ok: false, mensaje: 'Token invalido.' });
    }

    next();
}

module.exports = verificarToken;