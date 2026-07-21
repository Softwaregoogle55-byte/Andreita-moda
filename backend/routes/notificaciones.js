const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    res.json(db.notificaciones.getAll());
});

router.get('/no-leidas', (req, res) => {
    res.json({ total: db.notificaciones.noLeidas() });
});

router.post('/', (req, res) => {
    const { producto_id, producto_nombre, producto_precio, cliente_ip } = req.body;
    const mensaje = `🛒 Cliente agregó: "${producto_nombre}" - Bs ${producto_precio}`;
    const nueva = db.notificaciones.create({ producto_id, producto_nombre, producto_precio, cliente_ip: cliente_ip || 'Anónimo', mensaje });
    res.status(201).json({ success: true, id: nueva.id });
});

router.put('/:id/leer', (req, res) => {
    db.notificaciones.marcarLeida(req.params.id);
    res.json({ success: true });
});

router.put('/leer-todas', (req, res) => {
    db.notificaciones.marcarTodasLeidas();
    res.json({ success: true });
});

router.delete('/:id', (req, res) => {
    db.notificaciones.delete(req.params.id);
    res.json({ success: true });
});

module.exports = router;