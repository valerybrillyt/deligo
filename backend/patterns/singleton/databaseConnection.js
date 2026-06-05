const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const { aplicarSeed } = require('../../seed/seedData');

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) return DatabaseConnection.instance;
    this.db = null;
    DatabaseConnection.instance = this;
  }

  connect() {
    if (this.db) return this.db;

    const dbPath =
      process.env.DB_PATH ||
      path.join(__dirname, '../../../database/deligo.db');

    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    this.db = new Database(dbPath);
    this.db.pragma('foreign_keys = ON');
    this._crearTablas();
    aplicarSeed(this.db);
    return this.db;
  }

  getPool() {
    if (!this.db) this.connect();
    return this;
  }

  /** Compatible con rutas que usaban mysql2 .query() */
  query(sql, params = []) {
    const stmt = this.db.prepare(sql);
    const tipo = sql.trim().split(/\s+/)[0].toUpperCase();

    if (tipo === 'SELECT') {
      return [stmt.all(...params)];
    }
    const info = stmt.run(...params);
    return [{ insertId: info.lastInsertRowid, affectedRows: info.changes }];
  }

  _crearTablas() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        direccion TEXT DEFAULT '',
        latitud REAL DEFAULT 0,
        longitud REAL DEFAULT 0,
        creado_en TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS restaurantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        direccion TEXT,
        latitud REAL NOT NULL,
        longitud REAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurante_id INTEGER NOT NULL,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL NOT NULL,
        categoria TEXT DEFAULT 'General',
        FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id)
      );

      CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        restaurante_id INTEGER NOT NULL,
        tipo TEXT DEFAULT 'estandar',
        descripcion_extra TEXT,
        total REAL NOT NULL,
        estado TEXT DEFAULT 'pendiente',
        creado_en TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id)
      );
    `);
  }

}

module.exports = new DatabaseConnection();
