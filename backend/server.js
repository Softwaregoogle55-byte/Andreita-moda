const express = require('express');
const cors = require('cors');
const path = require('path');
const productosRoutes = require('./routes/productos');
const adminRoutes = require('./routes/admin');
const notificacionesRoutes = require('./routes/notificaciones');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir archivos del frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rutas API
app.use('/api/productos', productosRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

// Ruta principal - Sirve la tienda
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'cliente', 'tienda.html'));
});

// Ruta admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'admin', 'admin.html'));
});

app.listen(PORT, () => {
    console.log('=================================');
    console.log('  ✨ Andreita Moda Backend ✨');
    console.log(`  Servidor en puerto: ${PORT}`);
    console.log('=================================');
});