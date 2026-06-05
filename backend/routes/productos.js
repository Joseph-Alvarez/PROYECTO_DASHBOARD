// backend/routes/productos.js

const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const {
    getAll, getById, create, update, remove
} = require('../controllers/productosController');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', verificarToken, remove);

module.exports = router;