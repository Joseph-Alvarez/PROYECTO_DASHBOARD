// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());



// ── Rutas ── //
app.use('/api', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));



app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
});