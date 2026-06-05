/**
 * Borra deligo.db y vuelve a crear tablas + catálogo completo + cuentas demo.
 * Uso: cd backend && npm run reset-db
 */
const path = require('path');
const fs = require('fs');

const dbPath =
  process.env.DB_PATH ||
  path.join(__dirname, '../../database/deligo.db');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Base anterior eliminada:', dbPath);
}

delete require.cache[require.resolve('../patterns/singleton/databaseConnection')];
const db = require('../patterns/singleton/databaseConnection');
db.connect();

const stats = db.db.prepare(`
  SELECT
    (SELECT COUNT(*) FROM restaurantes) AS restaurantes,
    (SELECT COUNT(*) FROM productos) AS productos,
    (SELECT COUNT(*) FROM usuarios) AS usuarios,
    (SELECT COUNT(*) FROM pedidos) AS pedidos
`).get();

console.log('✅ Nueva base lista:');
console.log('   Restaurantes:', stats.restaurantes);
console.log('   Productos:', stats.productos);
console.log('   Usuarios:', stats.usuarios);
console.log('   Pedidos demo:', stats.pedidos);
console.log('\n🔑 Cuentas de prueba:');
console.log('   demo@deligo.com / demo123');
console.log('   estudiante@deligo.com / deligo2026\n');
