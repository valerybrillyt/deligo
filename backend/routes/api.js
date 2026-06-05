const express = require('express');
const db = require('../patterns/singleton/databaseConnection');
const authService = require('../patterns/singleton/authService');
const { crearPedido, listarTiposDisponibles } = require('../patterns/factory/orderFactory');
const { aplicarDecoradores, listarExtrasDisponibles } = require('../patterns/decorator/orderDecorator');
const { construirMenuDesdeProductos } = require('../patterns/composite/menuComposite');

const router = express.Router();

/** Documentación de patrones para la exposición / frontend */
router.get('/patrones', (req, res) => {
  res.json({
    singleton: [
      {
        archivo: 'patterns/singleton/databaseConnection.js',
        uso: 'Una sola conexión al archivo SQLite deligo.db',
      },
      {
        archivo: 'patterns/singleton/authService.js',
        uso: 'Un solo servicio de sesión para login (token único)',
      },
    ],
    factory: {
      archivo: 'patterns/factory/orderFactory.js',
      uso: 'Crea PedidoEstandar, PedidoExpress o PedidoProgramado',
      tipos: listarTiposDisponibles(),
    },
    decorator: {
      archivo: 'patterns/decorator/orderDecorator.js',
      uso: 'Envuelve el pedido con propina, seguro o empaque eco',
      extras: listarExtrasDisponibles(),
    },
    composite: {
      archivo: 'patterns/composite/menuComposite.js',
      uso: 'Menú en árbol: categoría (composite) → productos (hojas)',
    },
  });
});

router.get('/health', (req, res) => {
  try {
    const [rows] = db.getPool().query('SELECT COUNT(*) AS n FROM restaurantes');
    res.json({
      ok: true,
      modo: 'sqlite',
      restaurantes: rows[0].n,
      mensaje: 'Backend y SQLite conectados',
      patronesActivos: ['Singleton', 'Factory', 'Decorator', 'Composite'],
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/restaurantes', (req, res) => {
  try {
    const [rows] = db.getPool().query(
      'SELECT id, nombre, direccion, latitud, longitud FROM restaurantes'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/usuarios/registro', (req, res) => {
  try {
    const { nombre, email, password, direccion, latitud, longitud } = req.body;
    const [r] = db.getPool().query(
      'INSERT INTO usuarios (nombre, email, password, direccion, latitud, longitud) VALUES (?,?,?,?,?,?)',
      [nombre, email, password, direccion || '', latitud || 19.4326, longitud || -99.1332]
    );
    res.status(201).json({ id: r.insertId, mensaje: 'Usuario registrado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/usuarios/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = db.getPool().query(
      'SELECT id, nombre, email FROM usuarios WHERE email=? AND password=?',
      [email, password]
    );
    if (!rows.length) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const user = rows[0];
    const token = authService.login(user.id, user.email);
    res.json({ token, usuario: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/restaurantes/:id/menu', (req, res) => {
  try {
    const [productos] = db.getPool().query(
      'SELECT id, nombre, precio, categoria, descripcion FROM productos WHERE restaurante_id=?',
      [Number(req.params.id)]
    );
    const menuArbol = construirMenuDesdeProductos(productos);
    res.json({ productos, menuArbol });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pedidos/tipos', (req, res) => {
  res.json({ patron: 'Factory', tipos: listarTiposDisponibles() });
});

router.get('/pedidos/extras', (req, res) => {
  res.json({ patron: 'Decorator', extras: listarExtrasDisponibles() });
});

router.post('/pedidos', (req, res) => {
  try {
    const { usuarioId, restauranteId, items, tipoPedido, extras, subtotal } = req.body;
    const pedido = crearPedido(tipoPedido || 'estandar', { usuarioId, restauranteId, items });
    const decorado = aplicarDecoradores(pedido, extras || []);
    const sub = Number(subtotal) || 0;
    const costoEnvio = pedido.costoEnvio;
    const costoExtras = decorado.costoExtra();
    const total = pedido.calcularTotal(sub) + costoExtras;

    const [r] = db.getPool().query(
      'INSERT INTO pedidos (usuario_id, restaurante_id, tipo, descripcion_extra, total, estado) VALUES (?,?,?,?,?,?)',
      [usuarioId, restauranteId, pedido.tipo, decorado.descripcion(), total, 'pendiente']
    );

    res.status(201).json({
      pedidoId: r.insertId,
      total,
      subtotal: sub,
      costoEnvio,
      costoExtras,
      tiempoEstimadoMin: pedido.tiempoEstimadoMin,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pedidos', (req, res) => {
  try {
    const usuarioId = req.query.usuarioId;
    let rows;
    if (usuarioId) {
      [rows] = db.getPool().query(
        `SELECT p.id, p.total, p.estado, p.tipo, r.nombre AS restaurante
         FROM pedidos p JOIN restaurantes r ON r.id = p.restaurante_id
         WHERE p.usuario_id = ? ORDER BY p.id DESC`,
        [usuarioId]
      );
    } else {
      [rows] = db.getPool().query(
        `SELECT p.id, p.total, p.estado, p.tipo, r.nombre AS restaurante
         FROM pedidos p JOIN restaurantes r ON r.id = p.restaurante_id
         ORDER BY p.id DESC LIMIT 20`
      );
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pedidos/:id/seguimiento', (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows] = db.getPool().query(
      `SELECT p.estado, p.total, p.tipo, r.nombre AS restaurante, r.latitud AS rest_lat, r.longitud AS rest_lng,
              u.direccion, u.latitud AS user_lat, u.longitud AS user_lng
       FROM pedidos p
       JOIN restaurantes r ON r.id = p.restaurante_id
       JOIN usuarios u ON u.id = p.usuario_id
       WHERE p.id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Pedido no encontrado' });
    const p = rows[0];
    const pasos = ['pendiente', 'preparando', 'en_camino', 'entregado'];
    const indice = pasos.indexOf(p.estado);
    res.json({
      pedidoId: id,
      estado: p.estado,
      total: p.total,
      tipo: p.tipo,
      progreso: indice >= 0 ? Math.round(((indice + 1) / pasos.length) * 100) : 25,
      pasos: pasos.map((nombre, i) => ({
        nombre,
        completado: i <= indice,
        activo: i === indice,
      })),
      origen: { lat: p.rest_lat, lng: p.rest_lng, nombre: p.restaurante },
      destino: { lat: p.user_lat, lng: p.user_lng, direccion: p.direccion },
      ruta: {
        mensaje: 'Coordenadas listas para Google Maps API',
        desde: [p.rest_lat, p.rest_lng],
        hasta: [p.user_lat, p.user_lng],
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/pedidos/:id/estado', (req, res) => {
  try {
    const { estado } = req.body;
    const validos = ['pendiente', 'preparando', 'en_camino', 'entregado'];
    if (!validos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    db.getPool().query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, req.params.id]);
    res.json({ ok: true, estado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
