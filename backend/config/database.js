const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data.json');

let data = {
    productos: [],
    usuarios: [
        { id: 1, username: 'admin', password: 'admin123', rol: 'admin' },
        { id: 2, username: 'Paola', password: '042006', rol: 'admin' }
    ],
    notificaciones: [],
    configuracion: { id: 1, qr_imagen: null, banco_nombre: '', cuenta_titular: '', numero_cuenta: '', whatsapp: '' }
};

if (fs.existsSync(dbPath)) {
    try {
        const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        data = { ...data, ...fileData };
        if (!data.configuracion || !data.configuracion.id) {
            data.configuracion = { id: 1, qr_imagen: null, banco_nombre: '', cuenta_titular: '', numero_cuenta: '', whatsapp: '' };
        }
    } catch (e) {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    }
} else {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function saveData() {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const db = {
    productos: {
        getAll: () => [...data.productos].sort((a, b) => b.id - a.id),
        getById: (id) => data.productos.find(p => p.id == id) || null,
        create: (producto) => {
            const id = data.productos.length > 0 ? Math.max(...data.productos.map(p => p.id)) + 1 : 1;
            const nuevo = { id, ...producto, fecha_creacion: new Date().toISOString() };
            data.productos.push(nuevo);
            saveData();
            return nuevo;
        },
        update: (id, updates) => {
            const index = data.productos.findIndex(p => p.id == id);
            if (index !== -1) {
                data.productos[index] = { ...data.productos[index], ...updates };
                saveData();
                return data.productos[index];
            }
            return null;
        },
        delete: (id) => {
            const before = data.productos.length;
            data.productos = data.productos.filter(p => p.id != id);
            saveData();
            return before !== data.productos.length;
        }
    },
    usuarios: {
        findByLogin: (username, password, rol) => 
            data.usuarios.find(u => u.username === username && u.password === password && u.rol === rol) || null
    },
    notificaciones: {
        getAll: () => [...data.notificaciones].sort((a, b) => b.id - a.id),
        noLeidas: () => data.notificaciones.filter(n => !n.leido).length,
        create: (noti) => {
            const id = data.notificaciones.length > 0 ? Math.max(...data.notificaciones.map(n => n.id)) + 1 : 1;
            const nueva = { id, ...noti, leido: false, fecha: new Date().toISOString() };
            data.notificaciones.push(nueva);
            saveData();
            return nueva;
        },
        marcarLeida: (id) => {
            const n = data.notificaciones.find(n => n.id == id);
            if (n) { n.leido = true; saveData(); return true; }
            return false;
        },
        marcarTodasLeidas: () => {
            data.notificaciones.forEach(n => n.leido = true);
            saveData();
        },
        delete: (id) => {
            data.notificaciones = data.notificaciones.filter(n => n.id != id);
            saveData();
        }
    },
    configuracion: {
        get: () => data.configuracion,
        update: (updates) => {
            data.configuracion = { ...data.configuracion, ...updates };
            saveData();
            return data.configuracion;
        }
    }
};

console.log('Base de datos JSON lista ✓');
module.exports = db;