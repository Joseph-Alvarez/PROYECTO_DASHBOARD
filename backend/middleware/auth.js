// backend/middleware/auth.js

function verificarToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ ok: false, mensaje: 'Acceso denegado. Token requerido.' });
    }


    if (token !== 'token1234') {
        return res.status(403).json({ ok: false, mensaje: 'Token invalido.' });
    }

    next();
}

module.exports = verificarToken;





