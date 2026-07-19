const express = require('express');
const router = express.Router();
const db = require('../config/database');
const multer = require('multer');
const path = require('path');

// Configurar multer para imágenes QR
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'qr-banco-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo imágenes permitidas'));
        }
    }
});

// Obtener toda la configuración
router.get('/', (req, res) => {
    const query = 'SELECT * FROM configuracion';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Convertir a objeto clave-valor
        const config = {};
        results.forEach(row => {
            config[row.clave] = row.valor;
        });
        res.json(config);
    });
});

// Actualizar configuración de texto
router.put('/', (req, res) => {
    const updates = req.body;
    let completed = 0;
    let errors = [];
    
    Object.keys(updates).forEach(clave => {
        const query = 'UPDATE configuracion SET valor = ? WHERE clave = ?';
        db.query(query, [updates[clave], clave], (err) => {
            if (err) {
                errors.push({ clave, error: err.message });
            }
            completed++;
            
            if (completed === Object.keys(updates).length) {
                if (errors.length > 0) {
                    res.status(400).json({ errors });
                } else {
                    res.json({ message: 'Configuración actualizada ✓' });
                }
            }
        });
    });
});

// Subir imagen QR
router.post('/qr-imagen', upload.single('qr_imagen'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    
    const imagenNombre = req.file.filename;
    
    // Guardar en la base de datos
    const query = 'UPDATE configuracion SET valor = ? WHERE clave = ?';
    db.query(query, [imagenNombre, 'qr_imagen'], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ 
            message: 'QR actualizado ✓',
            imagen: imagenNombre 
        });
    });
});

module.exports = router;