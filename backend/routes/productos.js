const express = require('express');
const router = express.Router();
const db = require('../config/database');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Obtener todos
router.get('/', (req, res) => {
    try {
        const productos = db.prepare('SELECT * FROM productos ORDER BY fecha_creacion DESC').all();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener uno
router.get('/:id', (req, res) => {
    try {
        const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
        if (!producto) return res.status(404).json({ message: 'No encontrado' });
        res.json(producto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear
router.post('/', upload.fields([{ name: 'imagen' }, { name: 'video' }]), (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, talla, color } = req.body;
        const imagen = req.files?.imagen?.[0]?.filename || null;
        const video = req.files?.video?.[0]?.filename || null;
        
        const stmt = db.prepare('INSERT INTO productos (nombre, descripcion, precio, categoria, talla, color, imagen, video) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const result = stmt.run(nombre, descripcion, precio, categoria, talla, color, imagen, video);
        
        res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar
router.put('/:id', upload.fields([{ name: 'imagen' }, { name: 'video' }]), (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, talla, color } = req.body;
        const imagen = req.files?.imagen?.[0]?.filename || null;
        const video = req.files?.video?.[0]?.filename || null;
        
        if (imagen) {
            db.prepare('UPDATE productos SET nombre=?, descripcion=?, precio=?, categoria=?, talla=?, color=?, imagen=?, video=COALESCE(?, video) WHERE id=?')
              .run(nombre, descripcion, precio, categoria, talla, color, imagen, video, req.params.id);
        } else {
            db.prepare('UPDATE productos SET nombre=?, descripcion=?, precio=?, categoria=?, talla=?, color=?, video=COALESCE(?, video) WHERE id=?')
              .run(nombre, descripcion, precio, categoria, talla, color, video, req.params.id);
        }
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar
router.delete('/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM productos WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;