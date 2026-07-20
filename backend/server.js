const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir frontend completo
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Importar rutas API
const productosRoutes = require('./routes/productos');
const adminRoutes = require('./routes/admin');
const notificacionesRoutes = require('./routes/notificaciones');

app.use('/api/productos', productosRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

// Ruta del admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'admin', 'index.html'));
});

// Ruta principal - Tienda
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'cliente', 'tienda.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('=================================');
    console.log('  ✨ Andreita Moda ✨');
    console.log('  Puerto: ' + PORT);
    console.log('=================================');
});
