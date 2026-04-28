// backend/controllers/productosController.js

const mssql = require('mssql');
const { getPool } = require('../config/db');

const getAll = async (req, res) => {
    try {
        const db = await getPool();
        const resultado = await db.request().query('SELECT * FROM Productos');
        res.json(resultado.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar productos.' });
    }
};

const getById = async (req, res) => {
    try {
        const db = await getPool();
        const resultado = await db.request()
            .input('Id', mssql.Int, req.params.id)
            .query('SELECT * FROM Productos WHERE Id = @Id');

        if (resultado.recordset.length === 0)
            return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado.' });

        res.json(resultado.recordset[0]);
    } catch (err) {
        res.status(500).json({ ok: false, mensaje: 'Error al consultar el producto.' });
    }
};

const create = async (req, res) => {
    const { NombreProducto, Precio, Categoria, Stock } = req.body;
    if (!NombreProducto || NombreProducto.trim() === "")
        return res.status(400).json({ ok: false, mensaje: "Nombre requerido." });

    if (!Precio || Number(Precio) <= 0)
        return res.status(400).json({ ok: false, mensaje: "Precio debe ser mayor a 0." });

    if (!Categoria || Categoria.trim() === "")
        return res.status(400).json({ ok: false, mensaje: "Categoria requerida." });

    if (Stock === undefined || Stock === null || Number(Stock) < 0)
        return res.status(400).json({ ok: false, mensaje: "Stock debe ser 0 o mayor." });
    try {
        const db = await getPool();
        await db.request()
            .input('NombreProducto', mssql.NVarChar(100), NombreProducto)
            .input('Precio', mssql.Decimal(10, 2), Precio)
            .input('Categoria', mssql.NVarChar(50), Categoria)
            .input('Stock', mssql.Int, Stock)
            .query(`INSERT INTO Productos (NombreProducto, Precio, Categoria, Stock)
                    VALUES (@NombreProducto, @Precio, @Categoria, @Stock)`);

        res.status(201).json({ ok: true, mensaje: 'Producto creado exitosamente.' });
    } catch (err) {
        res.status(500).json({ ok: false, mensaje: 'Error al crear producto.' });
    }
};

const update = async (req, res) => {
    const { NombreProducto, Precio, Categoria, Stock } = req.body;

    // Agregar estas validaciones que faltan:
    if (!NombreProducto || NombreProducto.trim() === "")
        return res.status(400).json({ ok: false, mensaje: "Nombre requerido." });
    if (!Precio || Number(Precio) <= 0)
        return res.status(400).json({ ok: false, mensaje: "Precio debe ser mayor a 0." });
    if (!Categoria || Categoria.trim() === "")
        return res.status(400).json({ ok: false, mensaje: "Categoria requerida." });
    if (Stock === undefined || Stock === null || Number(Stock) < 0)
        return res.status(400).json({ ok: false, mensaje: "Stock debe ser 0 o mayor." });

    try {
        const db = await getPool();
        await db.request()
            .input('Id', mssql.Int, req.params.id)
            .input('NombreProducto', mssql.NVarChar(100), NombreProducto)
            .input('Precio', mssql.Decimal(10, 2), Precio)
            .input('Categoria', mssql.NVarChar(50), Categoria)
            .input('Stock', mssql.Int, Stock)
            .query(`UPDATE Productos
                    SET NombreProducto = @NombreProducto, Precio = @Precio,
                        Categoria = @Categoria, Stock = @Stock
                    WHERE Id = @Id`);

        res.json({ ok: true, mensaje: 'Producto actualizado.' });
    } catch (err) {
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar producto.' });
    }
};

const remove = async (req, res) => {
    try {
        const db = await getPool();
        await db.request()
            .input('Id', mssql.Int, req.params.id)
            .query('DELETE FROM Productos WHERE Id = @Id');

        res.json({ ok: true, mensaje: 'Producto eliminado.' });
    } catch (err) {
        res.status(500).json({ ok: false, mensaje: 'Error al eliminar producto.' });
    }
};

module.exports = { getAll, getById, create, update, remove };