const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todas las notificaciones
router.get('/', (req, res) => {
    const query = 'SELECT * FROM notificaciones ORDER BY fecha DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Obtener notificaciones no leídas (para el contador)
router.get('/no-leidas', (req, res) => {
    const query = 'SELECT COUNT(*) as total FROM notificaciones WHERE leido = FALSE';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ total: results[0].total });
    });
});

// Crear nueva notificación (cuando agregan al carrito)
router.post('/', (req, res) => {
    const { producto_id, producto_nombre, producto_precio, cliente_ip } = req.body;
    
    const mensaje = `🛒 Cliente agregó al carrito: "${producto_nombre}" - Bs ${producto_precio}`;
    
    const query = 'INSERT INTO notificaciones (producto_id, producto_nombre, producto_precio, cliente_ip, mensaje) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [producto_id, producto_nombre, producto_precio, cliente_ip, mensaje], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            success: true,
            message: 'Notificación creada',
            id: results.insertId 
        });
    });
});

// Marcar notificación como leída
router.put('/:id/leer', (req, res) => {
    const query = 'UPDATE notificaciones SET leido = TRUE WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Notificación marcada como leída ✓' });
    });
});

// Marcar todas como leídas
router.put('/leer-todas', (req, res) => {
    const query = 'UPDATE notificaciones SET leido = TRUE WHERE leido = FALSE';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Todas las notificaciones marcadas como leídas ✓' });
    });
});

// Eliminar notificación
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM notificaciones WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Notificación eliminada ✓' });
    });
});

module.exports = router;