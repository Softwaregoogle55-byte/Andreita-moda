const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.usuarios.findByLogin(username, password, 'admin');
    if (user) {
        res.json({ success: true, message: 'Login exitoso ✓' });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
});

module.exports = router;