// Este archivo define las rutas relacionadas con las ventas y exporta las funciones que manejan las solicitudes HTTP.

const express = require('express');
const router = express.Router();

// Simulación de una base de datos en memoria
let ventas = [];

// Crear una nueva venta
router.post('/ventas', (req, res) => {
    const nuevaVenta = req.body;
    ventas.push(nuevaVenta);
    res.status(201).json(nuevaVenta);
});

// Obtener todas las ventas
router.get('/ventas', (req, res) => {
    res.status(200).json(ventas);
});

// Obtener una venta por ID
router.get('/ventas/:id', (req, res) => {
    const venta = ventas.find(v => v.id === parseInt(req.params.id));
    if (!venta) return res.status(404).send('Venta no encontrada');
    res.status(200).json(venta);
});

// Actualizar una venta por ID
router.put('/ventas/:id', (req, res) => {
    const venta = ventas.find(v => v.id === parseInt(req.params.id));
    if (!venta) return res.status(404).send('Venta no encontrada');

    Object.assign(venta, req.body);
    res.status(200).json(venta);
});

// Eliminar una venta por ID
router.delete('/ventas/:id', (req, res) => {
    const ventaIndex = ventas.findIndex(v => v.id === parseInt(req.params.id));
    if (ventaIndex === -1) return res.status(404).send('Venta no encontrada');

    ventas.splice(ventaIndex, 1);
    res.status(204).send();
});

module.exports = router;