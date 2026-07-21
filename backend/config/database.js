const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL NOT NULL,
        categoria TEXT,
        talla TEXT,
        color TEXT,
        imagen TEXT,
        video TEXT,
        destacado INTEGER DEFAULT 0,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT DEFAULT 'cliente'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS notificaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        producto_id INTEGER,
        producto_nombre TEXT,
        producto_precio REAL,
        cliente_ip TEXT,
        mensaje TEXT,
        leido INTEGER DEFAULT 0,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS configuracion (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        qr_imagen TEXT,
        banco_nombre TEXT,
        cuenta_titular TEXT,
        numero_cuenta TEXT,
        whatsapp TEXT
    )`);

    // Insertar admin
    db.get('SELECT id FROM usuarios WHERE username = ?', ['admin'], (err, row) => {
        if (!row) {
            db.run('INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)', ['admin', 'admin123', 'admin']);
        }
    });

    // Insertar Paola
    db.get('SELECT id FROM usuarios WHERE username = ?', ['Paola'], (err, row) => {
        if (!row) {
            db.run('INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)', ['Paola', '042006', 'admin']);
        }
    });

    // Insertar config
    db.get('SELECT id FROM configuracion WHERE id = 1', (err, row) => {
        if (!row) {
            db.run('INSERT INTO configuracion (id) VALUES (1)');
        }
    });
});

console.log('Base de datos SQLite lista ✓');
module.exports = db;