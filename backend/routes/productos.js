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
    res.json(db.productos.getAll());
});

// Obtener uno
router.get('/:id', (req, res) => {
    const p = db.productos.getById(req.params.id);
    if (!p) return res.status(404).json({ message: 'No encontrado' });
    res.json(p);
});

// Crear producto (Acepta hasta 4 imágenes)
router.post('/', upload.array('imagenes', 4), (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, talla, color } = req.body;
        const imagenes = req.files ? req.files.map(f => f.filename) : [];
        
        const nuevo = db.productos.create({
            nombre,
            descripcion,
            precio,
            categoria,
            talla,
            color,
            imagenes: JSON.stringify(imagenes),
            imagen: imagenes[0] || null  // Compatibilidad con versión anterior
        });
        
        res.status(201).json({ success: true, id: nuevo.id });
    } catch (err) {
        console.error('Error al crear producto:', err);
        res.status(500).json({ error: err.message });
    }
});

// Actualizar producto
router.put('/:id', upload.array('imagenes', 4), (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, talla, color } = req.body;
        const updates = { nombre, descripcion, precio, categoria, talla, color };
        
        if (req.files && req.files.length > 0) {
            const imagenes = req.files.map(f => f.filename);
            updates.imagenes = JSON.stringify(imagenes);
            updates.imagen = imagenes[0];
        }
        
        const updated = db.productos.update(req.params.id, updates);
        if (!updated) return res.status(404).json({ message: 'No encontrado' });
        res.json({ success: true });
    } catch (err) {
        console.error('Error al actualizar:', err);
        res.status(500).json({ error: err.message });
    }
});

// Eliminar
router.delete('/:id', (req, res) => {
    db.productos.delete(req.params.id);
    res.json({ success: true });
});

module.exports = router;