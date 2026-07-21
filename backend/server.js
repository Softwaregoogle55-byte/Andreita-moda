const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'frontend'), { index: false }));

// Rutas API
const productosRoutes = require('./routes/productos');
const adminRoutes = require('./routes/admin');
const notificacionesRoutes = require('./routes/notificaciones');
const configuracionRoutes = require('./routes/configuracion');

app.use('/api/productos', productosRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/configuracion', configuracionRoutes);

// Tienda
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'cliente', 'tienda.html'));
});

// Admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'admin', 'index.html'));
});

app.listen(PORT, () => {
    console.log('=================================');
    console.log('  ✨ Andreita Moda ✨');
    console.log('  Tienda: http://localhost:' + PORT + '/');
    console.log('  Admin:  http://localhost:' + PORT + '/admin');
    console.log('=================================');
});