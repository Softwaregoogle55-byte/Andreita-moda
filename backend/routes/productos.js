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

// ========== OBTENER TODOS ==========
router.get('/', (req, res) => {
    res.json(db.productos.getAll());
});

// ========== OBTENER UNO ==========
router.get('/:id', (req, res) => {
    const p = db.productos.getById(req.params.id);
    if (!p) return res.status(404).json({ message: 'No encontrado' });
    res.json(p);
});

// ========== CREAR (hasta 4 fotos) ==========
router.post('/', upload.array('fotos', 4), (req, res) => {
    const { nombre, descripcion, precio, categoria, talla, color } = req.body;
    
    const fotos = req.files ? req.files.map(f => f.filename) : [];
    const imagen = fotos[0] || null;
    const fotosJSON = JSON.stringify(fotos);
    
    const nuevo = db.productos.create({ 
        nombre, 
        descripcion, 
        precio: parseFloat(precio), 
        categoria, 
        talla, 
        color, 
        imagen,
        fotos: fotosJSON
    });
    
    res.status(201).json({ success: true, id: nuevo.id, fotos: fotos.length });
});

// ========== ACTUALIZAR ==========
router.put('/:id', upload.array('fotos', 4), (req, res) => {
    const { nombre, descripcion, precio, categoria, talla, color } = req.body;
    const producto = db.productos.getById(req.params.id);
    
    let fotosExistentes = [];
    try { fotosExistentes = JSON.parse(producto?.fotos || '[]'); } catch(e) {}
    
    const fotosNuevas = req.files ? req.files.map(f => f.filename) : [];
    const todasFotos = [...fotosExistentes, ...fotosNuevas].slice(0, 4);
    const imagen = todasFotos[0] || null;
    
    const updated = db.productos.update(req.params.id, {
        nombre, 
        descripcion, 
        precio: parseFloat(precio), 
        categoria, 
        talla, 
        color,
        imagen,
        fotos: JSON.stringify(todasFotos)
    });
    
    if (!updated) return res.status(404).json({ message: 'No encontrado' });
    res.json({ success: true, fotos: todasFotos.length });
});

// ========== ELIMINAR ==========
router.delete('/:id', (req, res) => {
    db.productos.delete(req.params.id);
    res.json({ success: true });
});

module.exports = router;