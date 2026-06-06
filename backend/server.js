// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// DEBUG
const frontendPath = path.join(__dirname, '../frontend');
console.log('__dirname:', __dirname);
console.log('frontendPath:', frontendPath);
console.log('Existe?', fs.existsSync(frontendPath));
console.log('Archivos:', fs.existsSync(frontendPath) ? fs.readdirSync(frontendPath) : 'CARPETA NO EXISTE');

app.use(cors());
app.use(express.json());

// API
app.use('/api', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));

// Servir archivos estáticos
app.use(express.static(frontendPath));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

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