const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const user = db.prepare('SELECT * FROM usuarios WHERE username = ? AND password = ? AND rol = ?').get(username, password, 'admin');
        
        if (user) {
            res.json({ success: true, message: 'Login exitoso ✓' });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;