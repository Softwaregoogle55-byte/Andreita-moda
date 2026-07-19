const express = require('express');
const router = express.Router();
const db = require('../config/database');
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|mp4|webm/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Solo imágenes y videos permitidos');
        }
    }
});

// Obtener todos los productos
router.get('/', (req, res) => {
    const query = 'SELECT * FROM productos ORDER BY fecha_creacion DESC';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Obtener producto por ID
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }
        res.json(results[0]);
    });
});

// Crear nuevo producto
router.post('/', upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), (req, res) => {
    const { nombre, descripcion, precio, categoria, talla, color } = req.body;
    
    let imagen = null;
    let video = null;
    
    if (req.files && req.files.imagen) {
        imagen = req.files.imagen[0].filename;
    }
    if (req.files && req.files.video) {
        video = req.files.video[0].filename;
    }
    
    const query = 'INSERT INTO productos (nombre, descripcion, precio, categoria, talla, color, imagen, video) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [nombre, descripcion, precio, categoria, talla, color, imagen, video], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ 
            message: 'Producto creado exitosamente ✓',
            id: results.insertId 
        });
    });
});

// Actualizar producto
router.put('/:id', upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), (req, res) => {
    const { nombre, descripcion, precio, categoria, talla, color } = req.body;
    
    let updateFields = { nombre, descripcion, precio, categoria, talla, color };
    
    if (req.files && req.files.imagen) {
        updateFields.imagen = req.files.imagen[0].filename;
    }
    if (req.files && req.files.video) {
        updateFields.video = req.files.video[0].filename;
    }
    
    const query = 'UPDATE productos SET ? WHERE id = ?';
    
    db.query(query, [updateFields, req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Producto actualizado exitosamente ✓' });
    });
});

// Eliminar producto
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM productos WHERE id = ?';
    
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Producto eliminado exitosamente ✓' });
    });
});

module.exports = router;