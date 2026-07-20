const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'database.db'));

db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
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
    );

    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT DEFAULT 'cliente'
    );

    CREATE TABLE IF NOT EXISTS notificaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        producto_id INTEGER,
        producto_nombre TEXT,
        producto_precio REAL,
        cliente_ip TEXT,
        mensaje TEXT,
        leido INTEGER DEFAULT 0,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

const adminExists = db.prepare('SELECT * FROM usuarios WHERE username = ?').get('admin');
if (!adminExists) {
    db.prepare('INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)').run('admin', 'admin123', 'admin');
}

// Resetear contraseña del admin
db.prepare("UPDATE usuarios SET password = 'admin123' WHERE username = 'admin'").run();
console.log('Contraseña de admin restablecida a: admin123');

module.exports = db;