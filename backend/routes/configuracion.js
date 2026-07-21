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

// Obtener configuración
router.get('/', (req, res) => {
    try {
        const config = db.prepare('SELECT * FROM configuracion WHERE id = 1').get();
        res.json(config || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar configuración
router.put('/', upload.single('qr_imagen'), (req, res) => {
    try {
        const { banco_nombre, cuenta_titular, numero_cuenta, whatsapp, qr_imagen_actual } = req.body;
        const qr_imagen = req.file ? req.file.filename : (qr_imagen_actual || null);

        const stmt = db.prepare('UPDATE configuracion SET qr_imagen=?, banco_nombre=?, cuenta_titular=?, numero_cuenta=?, whatsapp=? WHERE id=1');
        stmt.run(qr_imagen, banco_nombre || '', cuenta_titular || '', numero_cuenta || '', whatsapp || '');

        res.json({ success: true, message: 'Configuración guardada ✓' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;