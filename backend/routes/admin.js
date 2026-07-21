const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Login del administrador
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = db.prepare('SELECT * FROM usuarios WHERE username = ? AND password = ? AND rol = ?').get(username, password, 'admin');
        
        if (user) {
            res.json({ 
                success: true, 
                message: 'Login exitoso ✓',
                user: { id: user.id, username: user.username }
            });
        } else {
            res.status(401).json({ 
                success: false,
                message: 'Usuario o contraseña incorrectos' 
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verificar estado del servidor
router.get('/status', (req, res) => {
    res.json({ status: 'online', message: 'API funcionando ✓' });
});

module.exports = router;