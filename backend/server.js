require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./patterns/singleton/databaseConnection');
const api = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', api);

app.get('/', (req, res) => {
  res.json({
    app: 'DeliGo API',
    ok: true,
    baseDatos: 'SQLite',
    archivo: path.join(__dirname, '../database/deligo.db'),
  });
});

try {
  db.connect();
  console.log('✅ SQLite conectado');
  console.log('   Archivo:', path.join(__dirname, '../database/deligo.db'));
} catch (err) {
  console.error('❌ Error SQLite:', err.message);
  console.error('   Ejecuta: cd backend && npm install');
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`🛵 DeliGo API → http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Restaurantes: http://localhost:${PORT}/api/restaurantes`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ El puerto ${PORT} ya está en uso.`);
    console.error('   Opción 1: El backend YA está corriendo → abre http://localhost:3000/api/health');
    console.error('   Opción 2: Cierra la otra terminal (Ctrl+C) o ejecuta: npm run reiniciar\n');
    process.exit(1);
  }
  console.error('❌ Error al iniciar:', err.message);
  process.exit(1);
});
