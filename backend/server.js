// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ── Rutas API ── //
app.use('/api', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));

// ── Servir frontend ── //
// Archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta raíz: devuelve index.html del frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Arrancar servidor ── //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
