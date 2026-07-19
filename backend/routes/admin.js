const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Login del administrador
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log('Intento de login - Usuario:', username, 'Password:', password);
    
    const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ? AND rol = ?';
    
    db.query(query, [username, password, 'admin'], (err, results) => {
        if (err) {
            console.error('Error en login:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        
        console.log('Resultados:', results);
        
        if (results.length > 0) {
            res.json({ 
                success: true,
                message: 'Login exitoso ✓',
                user: { 
                    id: results[0].id, 
                    username: results[0].username 
                }
            });
        } else {
            res.status(401).json({ 
                success: false,
                message: 'Usuario o contraseña incorrectos' 
            });
        }
    });
});

module.exports = router;