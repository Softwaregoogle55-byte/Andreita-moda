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
    res.json(db.configuracion.get());
});

router.put('/', upload.single('qr_imagen'), (req, res) => {
    const { banco_nombre, cuenta_titular, numero_cuenta, whatsapp, qr_imagen_actual } = req.body;
    const qr_imagen = req.file ? req.file.filename : (qr_imagen_actual || null);
    db.configuracion.update({ qr_imagen, banco_nombre, cuenta_titular, numero_cuenta, whatsapp });
    res.json({ success: true, message: 'Configuración guardada ✓' });
});

module.exports = router;