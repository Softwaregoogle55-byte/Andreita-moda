const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rutas
const productosRoutes = require('./routes/productos');
const adminRoutes = require('./routes/admin');
const notificacionesRoutes = require('./routes/notificaciones'); // <-- ESTA LÍNEA
const configuracionRoutes = require('./routes/configuracion');
app.use('/api/configuracion', configuracionRoutes);

// Usar rutas
app.use('/api/productos', productosRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notificaciones', notificacionesRoutes); // <-- ESTA LÍNEA

app.get('/', (req, res) => {
    res.json({ message: 'API Andreita Moda funcionando ✓', status: 'online' });
});

app.listen(PORT, () => {
    console.log('=================================');
    console.log('  ✨ Andreita Moda Backend ✨');
    console.log(`  Servidor en: http://localhost:${PORT}`);
    console.log('=================================');
});