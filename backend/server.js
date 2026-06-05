// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// API
app.use('/api', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));

// Ruta correcta al frontend
const frontendPath = path.join(__dirname, '../frontend');

// Servir archivos estáticos
app.use(express.static(frontendPath));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Para páginas HTML adicionales
app.get('/register', (req, res) => {
    res.sendFile(path.join(frontendPath, 'register.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(frontendPath, 'indexHome.html'));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});