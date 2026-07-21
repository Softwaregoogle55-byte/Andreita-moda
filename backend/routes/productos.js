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

router.get('/', (req, res) => {
    res.json(db.productos.getAll());
});

router.get('/:id', (req, res) => {
    const p = db.productos.getById(req.params.id);
    if (!p) return res.status(404).json({ message: 'No encontrado' });
    res.json(p);
});

router.post('/', upload.fields([{ name: 'imagen' }, { name: 'video' }]), (req, res) => {
    const { nombre, descripcion, precio, categoria, talla, color } = req.body;
    const imagen = req.files?.imagen?.[0]?.filename || null;
    const video = req.files?.video?.[0]?.filename || null;
    const nuevo = db.productos.create({ nombre, descripcion, precio, categoria, talla, color, imagen, video });
    res.status(201).json({ success: true, id: nuevo.id });
});

router.put('/:id', upload.fields([{ name: 'imagen' }, { name: 'video' }]), (req, res) => {
    const { nombre, descripcion, precio, categoria, talla, color } = req.body;
    const updates = { nombre, descripcion, precio, categoria, talla, color };
    if (req.files?.imagen?.[0]?.filename) updates.imagen = req.files.imagen[0].filename;
    if (req.files?.video?.[0]?.filename) updates.video = req.files.video[0].filename;
    const updated = db.productos.update(req.params.id, updates);
    if (!updated) return res.status(404).json({ message: 'No encontrado' });
    res.json({ success: true });
});

router.delete('/:id', (req, res) => {
    db.productos.delete(req.params.id);
    res.json({ success: true });
});

module.exports = router;