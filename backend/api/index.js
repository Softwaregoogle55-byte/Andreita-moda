const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos JSON simple
const fs = require('fs');
const dataPath = '/tmp/data.json';

let data = {
    productos: [],
    usuarios: [{ id: 1, username: 'admin', password: 'admin123', rol: 'admin' }],
    notificaciones: [],
    configuracion: { id: 1, qr_imagen: null, banco_nombre: '', cuenta_titular: '', numero_cuenta: '', whatsapp: '' }
};

if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveData() {
    fs.writeFileSync(dataPath, JSON.stringify(data));
}

// API Productos
app.get('/api/productos', (req, res) => res.json(data.productos));

app.get('/api/productos/:id', (req, res) => {
    const p = data.productos.find(x => x.id == req.params.id);
    if (!p) return res.status(404).json({ message: 'No encontrado' });
    res.json(p);
});

app.post('/api/productos', express.json(), (req, res) => {
    const id = data.productos.length ? Math.max(...data.productos.map(x => x.id)) + 1 : 1;
    const nuevo = { id, ...req.body, fecha_creacion: new Date().toISOString() };
    data.productos.push(nuevo);
    saveData();
    res.status(201).json({ success: true, id });
});

app.put('/api/productos/:id', express.json(), (req, res) => {
    const index = data.productos.findIndex(x => x.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'No encontrado' });
    data.productos[index] = { ...data.productos[index], ...req.body };
    saveData();
    res.json({ success: true });
});

app.delete('/api/productos/:id', (req, res) => {
    data.productos = data.productos.filter(x => x.id != req.params.id);
    saveData();
    res.json({ success: true });
});

// API Admin
app.post('/api/admin/login', express.json(), (req, res) => {
    const { username, password } = req.body;
    const user = data.usuarios.find(u => u.username === username && u.password === password && u.rol === 'admin');
    if (user) res.json({ success: true });
    else res.status(401).json({ message: 'Credenciales inválidas' });
});

// API Notificaciones
app.get('/api/notificaciones', (req, res) => res.json(data.notificaciones));

app.post('/api/notificaciones', express.json(), (req, res) => {
    const id = data.notificaciones.length ? Math.max(...data.notificaciones.map(x => x.id)) + 1 : 1;
    const { producto_nombre, producto_precio } = req.body;
    const nueva = {
        id,
        producto_nombre,
        producto_precio,
        mensaje: `🛒 Cliente agregó: "${producto_nombre}" - Bs ${producto_precio}`,
        leido: false,
        fecha: new Date().toISOString()
    };
    data.notificaciones.push(nueva);
    saveData();
    res.status(201).json({ success: true, id });
});

// API Configuración
app.get('/api/configuracion', (req, res) => res.json(data.configuracion));

app.put('/api/configuracion', express.json(), (req, res) => {
    data.configuracion = { ...data.configuracion, ...req.body };
    saveData();
    res.json({ success: true });
});

module.exports = app;