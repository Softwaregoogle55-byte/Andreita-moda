const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    try {
        const notificaciones = db.prepare('SELECT * FROM notificaciones ORDER BY fecha DESC').all();
        res.json(notificaciones);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/no-leidas', (req, res) => {
    try {
        const count = db.prepare('SELECT COUNT(*) as total FROM notificaciones WHERE leido = 0').get();
        res.json({ total: count.total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', (req, res) => {
    try {
        const { producto_id, producto_nombre, producto_precio, cliente_ip } = req.body;
        const mensaje = `🛒 Cliente agregó: "${producto_nombre}" - Bs ${producto_precio}`;
        
        const stmt = db.prepare('INSERT INTO notificaciones (producto_id, producto_nombre, producto_precio, cliente_ip, mensaje) VALUES (?, ?, ?, ?, ?)');
        const result = stmt.run(producto_id, producto_nombre, producto_precio, cliente_ip || 'Anónimo', mensaje);
        
        res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id/leer', (req, res) => {
    try {
        db.prepare('UPDATE notificaciones SET leido = 1 WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/leer-todas', (req, res) => {
    try {
        db.prepare('UPDATE notificaciones SET leido = 1 WHERE leido = 0').run();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM notificaciones WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;