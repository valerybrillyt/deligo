const express = require('express');
const db = require('../patterns/singleton/databaseConnection');
const authService = require('../patterns/singleton/authService');
const logService = require('../patterns/singleton/logService');
const { crearPedido, listarTiposDisponibles } = require('../patterns/factory/orderFactory');
const { aplicarDecoradores, listarExtrasDisponibles } = require('../patterns/decorator/orderDecorator');
const { construirMenuDesdeProductos } = require('../patterns/composite/menuComposite');
const { PedidoContexto, listarEstadosDisponibles } = require('../patterns/state/orderState');
const { PedidoOriginator, historialPedidos } = require('../patterns/memento/orderMemento');
const { listarMicroservicios, describirServicio } = require('../patterns/microservicios/arquitectura');
const { listarAntipatrones } = require('../patterns/antipatrones/catalogo');
const { geocode, obtenerRuta, puntoEnRuta, DEFAULT_LIMA } = require('../services/geoService');
const {
  ROLES,
  DESCRIPCION_ROLES,
  usuarioDesdeRequest,
  requiereSesion,
  requiereRol,
} = require('../middleware/roles');

const router = express.Router();

function clientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '';
}

function guardarMementoPedido(pedidoId, fila) {
  const originator = new PedidoOriginator({
    estado: fila.estado,
    total: fila.total,
    tipo: fila.tipo,
    descripcionExtra: fila.descripcion_extra,
    metodoPago: fila.metodo_pago,
  });
  historialPedidos.guardar(pedidoId, originator.crearMemento());
}

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
      {
        archivo: 'patterns/singleton/logService.js',
        uso: 'Un solo servicio que escribe en la tabla logs (auditoría)',
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
    state: {
      archivo: 'patterns/state/orderState.js',
      uso: 'Cada estado del pedido sabe a cuáles puede pasar (sin if/else gigantes)',
      estados: listarEstadosDisponibles(),
    },
    memento: {
      archivo: 'patterns/memento/orderMemento.js',
      uso: 'Guarda snapshot del pedido antes de cambiar estado; permite deshacer',
      historial: historialPedidos.info(),
    },
    microservicios: listarMicroservicios(),
    antipatrones: listarAntipatrones(),
  });
});

router.get('/microservicios', (_req, res) => {
  res.json(listarMicroservicios());
});

router.get('/microservicios/:codigo', (req, res) => {
  const s = describirServicio(req.params.codigo);
  if (!s) return res.status(404).json({ error: 'Servicio no definido' });
  res.json(s);
});

router.get('/antipatrones', (_req, res) => {
  res.json(listarAntipatrones());
});

router.get('/pedidos/estados', (_req, res) => {
  res.json({ patron: 'State', estados: listarEstadosDisponibles() });
});

router.get('/health', (req, res) => {
  try {
    const [rows] = db.getPool().query('SELECT COUNT(*) AS n FROM restaurantes');
    const [logs] = db.getPool().query('SELECT COUNT(*) AS n FROM logs');
    res.json({
      ok: true,
      modo: 'sqlite',
      restaurantes: rows[0].n,
      logs: logs[0].n,
      mensaje: 'Backend y SQLite conectados',
      patronesActivos: [
        'Singleton',
        'Factory',
        'Decorator',
        'Composite',
        'State',
        'Memento',
        'Microservicios',
        'Antipatrones',
      ],
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/** Registrar acción desde el frontend (navegación, etc.) */
router.post('/logs', (req, res) => {
  try {
    const { usuarioId, accion, detalle, ruta } = req.body;
    logService.registrar({
      usuarioId: usuarioId || usuarioDesdeRequest(req),
      accion: accion || 'ACCION_FRONTEND',
      detalle: detalle || '',
      ruta: ruta || req.headers.referer || '',
      ip: clientIp(req),
      exito: 1,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** Roles del sistema (documentación) */
router.get('/roles', (_req, res) => {
  res.json({ roles: DESCRIPCION_ROLES });
});

/** Ver historial de acciones — solo administrador */
router.get('/logs', (req, res) => {
  try {
    const admin = requiereRol(req, res, db, [ROLES.ADMIN]);
    if (!admin) return;

    const [rows] = db.getPool().query(
      `SELECT l.id, l.usuario_id, l.accion, l.detalle, l.ruta, l.exito, l.creado_en,
              u.nombre AS usuario_nombre, u.email AS usuario_email, u.rol AS usuario_rol
       FROM logs l
       LEFT JOIN usuarios u ON u.id = l.usuario_id
       ORDER BY l.id DESC LIMIT 300`
    );
    logService.registrar({
      usuarioId: admin.id,
      accion: 'VER_LOGS_ADMIN',
      ruta: '/api/logs',
      ip: clientIp(req),
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/restaurantes', (req, res) => {
  try {
    const user = requiereRol(req, res, db, [ROLES.CLIENTE, ROLES.ADMIN]);
    if (!user) return;
    const uid = user.id;
    logService.registrar({
      usuarioId: uid,
      accion: 'VER_RESTAURANTES',
      ruta: '/api/restaurantes',
      ip: clientIp(req),
    });
    const [rows] = db.getPool().query(
      'SELECT id, nombre, direccion, latitud, longitud FROM restaurantes'
    );
    res.json(rows);
  } catch (err) {
    logService.registrar({
      usuarioId: usuarioDesdeRequest(req),
      accion: 'VER_RESTAURANTES',
      detalle: err.message,
      exito: 0,
      ip: clientIp(req),
    });
    res.status(500).json({ error: err.message });
  }
});

router.post('/usuarios/registro', async (req, res) => {
  try {
    const { nombre, email, password, direccion, latitud, longitud } = req.body;
    let lat = Number(latitud) || null;
    let lng = Number(longitud) || null;

    if (direccion?.trim()) {
      const geo = await geocode(direccion);
      lat = geo.lat;
      lng = geo.lng;
    }
    if (!lat || !lng) {
      lat = DEFAULT_LIMA.lat;
      lng = DEFAULT_LIMA.lng;
    }

    const [r] = db.getPool().query(
      "INSERT INTO usuarios (nombre, email, password, direccion, latitud, longitud, rol) VALUES (?,?,?,?,?,?,'cliente')",
      [nombre, email, password, direccion || '', lat, lng]
    );
    logService.registrar({
      usuarioId: r.insertId,
      accion: 'REGISTRO_OK',
      detalle: `email=${email} geo=${lat},${lng}`,
      ruta: '/api/usuarios/registro',
      ip: clientIp(req),
    });
    res.status(201).json({ id: r.insertId, mensaje: 'Usuario registrado', latitud: lat, longitud: lng });
  } catch (err) {
    logService.registrar({
      accion: 'REGISTRO_ERROR',
      detalle: err.message,
      ruta: '/api/usuarios/registro',
      ip: clientIp(req),
      exito: 0,
    });
    res.status(400).json({ error: err.message });
  }
});

router.post('/usuarios/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = db.getPool().query(
      'SELECT id, nombre, email, rol, restaurante_id FROM usuarios WHERE email=? AND password=?',
      [email, password]
    );
    if (!rows.length) {
      logService.registrar({
        accion: 'LOGIN_ERROR',
        detalle: `email=${email}`,
        ruta: '/api/usuarios/login',
        ip: clientIp(req),
        exito: 0,
      });
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    const user = rows[0];
    const token = authService.login(user.id, user.email, user.rol, user.restaurante_id);
    logService.registrar({
      usuarioId: user.id,
      accion: 'LOGIN_OK',
      detalle: `email=${email}`,
      ruta: '/api/usuarios/login',
      ip: clientIp(req),
    });
    res.json({
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol || ROLES.CLIENTE,
        restaurante_id: user.restaurante_id,
      },
    });
  } catch (err) {
    logService.registrar({
      accion: 'LOGIN_ERROR',
      detalle: err.message,
      exito: 0,
      ip: clientIp(req),
    });
    res.status(500).json({ error: err.message });
  }
});

router.get('/restaurantes/:id/menu', (req, res) => {
  try {
    const user = requiereRol(req, res, db, [ROLES.CLIENTE, ROLES.ADMIN]);
    if (!user) return;
    const restId = Number(req.params.id);
    const uid = user.id;
    logService.registrar({
      usuarioId: uid,
      accion: 'VER_MENU',
      detalle: `restaurante_id=${restId}`,
      ruta: `/api/restaurantes/${restId}/menu`,
      ip: clientIp(req),
    });
    const [productos] = db.getPool().query(
      'SELECT id, nombre, precio, categoria, descripcion FROM productos WHERE restaurante_id=?',
      [restId]
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

const METODOS_PAGO = {
  efectivo: 'Efectivo al recibir',
  tarjeta: 'Tarjeta (demo — sin cargo real)',
  yape: 'Yape / Plin (demo — sin cargo real)',
};

router.post('/pedidos', (req, res) => {
  try {
    const user = requiereRol(req, res, db, [ROLES.CLIENTE, ROLES.ADMIN]);
    if (!user) return;

    const { restauranteId, items, tipoPedido, extras, subtotal, metodoPago } = req.body;
    const usuarioId = user.rol === ROLES.ADMIN && req.body.usuarioId ? req.body.usuarioId : user.id;
    const pago = METODOS_PAGO[metodoPago] ? metodoPago : 'efectivo';
    const pedido = crearPedido(tipoPedido || 'estandar', { usuarioId, restauranteId, items });
    const decorado = aplicarDecoradores(pedido, extras || []);
    const sub = Number(subtotal) || 0;
    const costoEnvio = pedido.costoEnvio;
    const costoExtras = decorado.costoExtra();
    const total = pedido.calcularTotal(sub) + costoExtras;

    const [r] = db.getPool().query(
      'INSERT INTO pedidos (usuario_id, restaurante_id, tipo, descripcion_extra, total, estado, metodo_pago) VALUES (?,?,?,?,?,?,?)',
      [usuarioId, restauranteId, pedido.tipo, decorado.descripcion(), total, 'pendiente', pago]
    );

    logService.registrar({
      usuarioId,
      accion: 'CREAR_PEDIDO',
      detalle: `pedido_id=${r.insertId} total=${total} pago=${pago}`,
      ruta: '/api/pedidos',
      ip: clientIp(req),
    });

    res.status(201).json({
      pedidoId: r.insertId,
      total,
      subtotal: sub,
      costoEnvio,
      costoExtras,
      tiempoEstimadoMin: pedido.tiempoEstimadoMin,
      metodoPago: pago,
      metodoPagoLabel: METODOS_PAGO[pago],
      pagoSimulado: true,
    });
  } catch (err) {
    logService.registrar({
      usuarioId: req.body?.usuarioId,
      accion: 'CREAR_PEDIDO_ERROR',
      detalle: err.message,
      exito: 0,
      ip: clientIp(req),
    });
    res.status(500).json({ error: err.message });
  }
});

router.get('/pedidos', (req, res) => {
  try {
    const user = requiereSesion(req, res, db);
    if (!user) return;

    logService.registrar({
      usuarioId: user.id,
      accion: 'VER_PEDIDOS',
      detalle: `rol=${user.rol}`,
      ruta: '/api/pedidos',
      ip: clientIp(req),
    });

    const baseSql = `
      SELECT p.id, p.total, p.estado, p.tipo, p.metodo_pago, p.usuario_id, p.restaurante_id,
             r.nombre AS restaurante, u.nombre AS cliente_nombre, u.direccion AS cliente_direccion
      FROM pedidos p
      JOIN restaurantes r ON r.id = p.restaurante_id
      JOIN usuarios u ON u.id = p.usuario_id`;

    let rows;
    switch (user.rol) {
      case ROLES.ADMIN:
        [rows] = db.getPool().query(`${baseSql} ORDER BY p.id DESC LIMIT 100`);
        break;
      case ROLES.REPARTIDOR:
        [rows] = db.getPool().query(
          `${baseSql}
           WHERE p.estado IN ('preparando', 'en_camino', 'pendiente')
           ORDER BY p.id DESC LIMIT 50`
        );
        break;
      case ROLES.RESTAURANTE:
        if (!user.restaurante_id) {
          return res.status(400).json({ error: 'Tu cuenta de restaurante no tiene local asignado' });
        }
        [rows] = db.getPool().query(
          `${baseSql} WHERE p.restaurante_id = ? ORDER BY p.id DESC LIMIT 50`,
          [user.restaurante_id]
        );
        break;
      default:
        [rows] = db.getPool().query(
          `${baseSql} WHERE p.usuario_id = ? ORDER BY p.id DESC`,
          [user.id]
        );
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pedidos/:id/seguimiento', async (req, res) => {
  try {
    const user = requiereSesion(req, res, db);
    if (!user) return;

    const id = Number(req.params.id);
    logService.registrar({
      usuarioId: user.id,
      accion: 'VER_SEGUIMIENTO',
      detalle: `pedido_id=${id} rol=${user.rol}`,
      ruta: `/api/pedidos/${id}/seguimiento`,
      ip: clientIp(req),
    });
    const [rows] = db.getPool().query(
      `SELECT p.estado, p.total, p.tipo, p.metodo_pago, p.usuario_id, p.restaurante_id,
              r.nombre AS restaurante, r.latitud AS rest_lat, r.longitud AS rest_lng,
              u.direccion, u.latitud AS user_lat, u.longitud AS user_lng
       FROM pedidos p
       JOIN restaurantes r ON r.id = p.restaurante_id
       JOIN usuarios u ON u.id = p.usuario_id
       WHERE p.id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Pedido no encontrado' });

    const pedido = rows[0];
    const puedeVer =
      user.rol === ROLES.ADMIN ||
      user.rol === ROLES.REPARTIDOR ||
      (user.rol === ROLES.RESTAURANTE && pedido.restaurante_id === user.restaurante_id) ||
      (user.rol === ROLES.CLIENTE && pedido.usuario_id === user.id);
    if (!puedeVer) {
      return res.status(403).json({ error: 'No puedes ver este pedido' });
    }
    const p = pedido;
    const pasos = ['pendiente', 'preparando', 'en_camino', 'entregado'];
    const indice = pasos.indexOf(p.estado);
    const origen = { lat: p.rest_lat, lng: p.rest_lng };
    const destino = { lat: p.user_lat, lng: p.user_lng };
    const cancelado = p.estado === 'cancelado';
    let coordenadas = [];
    let repartidor = origen;
    if (!cancelado) {
      coordenadas = await obtenerRuta(origen, destino);
      const progresoRuta = { pendiente: 0, preparando: 12, en_camino: 58, entregado: 100 };
      repartidor = puntoEnRuta(coordenadas, progresoRuta[p.estado] ?? 0);
    }

    res.json({
      pedidoId: id,
      estado: p.estado,
      total: p.total,
      tipo: p.tipo,
      metodoPago: p.metodo_pago || 'efectivo',
      metodoPagoLabel: METODOS_PAGO[p.metodo_pago] || METODOS_PAGO.efectivo,
      progreso: indice >= 0 ? Math.round(((indice + 1) / pasos.length) * 100) : 25,
      pasos: pasos.map((nombre, i) => ({
        nombre,
        completado: i <= indice,
        activo: i === indice,
      })),
      origen: { lat: p.rest_lat, lng: p.rest_lng, nombre: p.restaurante },
      destino: { lat: p.user_lat, lng: p.user_lng, direccion: p.direccion },
      mapa: {
        proveedor: 'OpenStreetMap + OSRM (gratis)',
        coordenadas,
        repartidor,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/pedidos/:id/cancelar', (req, res) => {
  try {
    const user = requiereRol(req, res, db, [ROLES.CLIENTE, ROLES.ADMIN]);
    if (!user) return;

    const id = Number(req.params.id);
    const [rows] = db.getPool().query(
      'SELECT estado, usuario_id, total, tipo, descripcion_extra, metodo_pago FROM pedidos WHERE id = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Pedido no encontrado' });
    const ped = rows[0];
    if (user.rol !== ROLES.ADMIN && ped.usuario_id !== user.id) {
      return res.status(403).json({ error: 'Solo puedes cancelar tus propios pedidos' });
    }

    // PATRÓN STATE: solo estados que permiten cancelar
    const ctx = new PedidoContexto(ped.estado);
    try {
      ctx.transicionar('cancelado');
    } catch (e) {
      return res.status(400).json({ error: e.message, patron: 'State' });
    }

    // PATRÓN MEMENTO: guardar estado anterior antes de cancelar
    guardarMementoPedido(id, ped);

    db.getPool().query('UPDATE pedidos SET estado = ? WHERE id = ?', ['cancelado', id]);
    logService.registrar({
      usuarioId: ped.usuario_id,
      accion: 'CANCELAR_PEDIDO',
      detalle: `pedido_id=${id} memento_guardado=1 patron=State+Memento`,
      ip: clientIp(req),
    });
    res.json({
      ok: true,
      estado: 'cancelado',
      mensaje: 'Pedido cancelado. No se realizó ningún cobro.',
      patrones: { state: true, memento: true, historial: historialPedidos.cantidad(id) },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pedidos/metodos-pago', (req, res) => {
  res.json({
    simulado: true,
    mensaje: 'Pagos de demostración — no se conecta a bancos ni Yape real',
    metodos: Object.entries(METODOS_PAGO).map(([codigo, etiqueta]) => ({ codigo, etiqueta })),
  });
});

router.patch('/pedidos/:id/estado', (req, res) => {
  try {
    const user = requiereSesion(req, res, db);
    if (!user) return;

    const { estado } = req.body;
    const validos = ['pendiente', 'preparando', 'en_camino', 'entregado', 'cancelado'];
    if (!validos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const id = Number(req.params.id);
    const [rows] = db.getPool().query(
      'SELECT estado, usuario_id, restaurante_id, total, tipo, descripcion_extra, metodo_pago FROM pedidos WHERE id = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Pedido no encontrado' });
    const ped = rows[0];

    const permitido = {
      [ROLES.ADMIN]: validos,
      [ROLES.REPARTIDOR]: ['en_camino', 'entregado'],
      [ROLES.RESTAURANTE]: ['preparando'],
      [ROLES.CLIENTE]: [],
    };
    const estadosRol = permitido[user.rol] || [];
    const esAdmin = user.rol === ROLES.ADMIN;
    const esRepartidor = user.rol === ROLES.REPARTIDOR && estadosRol.includes(estado);
    const esRestaurante =
      user.rol === ROLES.RESTAURANTE &&
      ped.restaurante_id === user.restaurante_id &&
      estadosRol.includes(estado) &&
      ped.estado === 'pendiente' &&
      estado === 'preparando';

    if (!esAdmin && !esRepartidor && !esRestaurante) {
      return res.status(403).json({ error: 'Tu rol no puede cambiar a ese estado' });
    }

    // PATRÓN STATE: valida la transición (admin puede forzar)
    const ctx = new PedidoContexto(ped.estado);
    let transicion;
    try {
      transicion = ctx.transicionar(estado);
    } catch (e) {
      if (!esAdmin) {
        return res.status(400).json({ error: e.message, patron: 'State' });
      }
      // Admin puede forzar (documentado en respuesta)
      ctx.setEstado(estado);
      transicion = { anterior: ped.estado, actual: estado, forzadoPorAdmin: true };
    }

    // PATRÓN MEMENTO: snapshot antes de actualizar
    guardarMementoPedido(id, ped);

    db.getPool().query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
    logService.registrar({
      usuarioId: usuarioDesdeRequest(req),
      accion: 'CAMBIO_ESTADO_PEDIDO',
      detalle: `pedido_id=${id} ${transicion.anterior}→${transicion.actual} rol=${user.rol}`,
      ip: clientIp(req),
    });
    res.json({
      ok: true,
      estado,
      patron: 'State',
      memento: true,
      historial: historialPedidos.cantidad(id),
      info: ctx.info(),
      forzadoPorAdmin: !!transicion.forzadoPorAdmin,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** Deshacer último cambio de estado (Memento) — admin o dueño del pedido */
router.post('/pedidos/:id/deshacer', (req, res) => {
  try {
    const user = requiereSesion(req, res, db);
    if (!user) return;

    const id = Number(req.params.id);
    const [rows] = db.getPool().query(
      'SELECT estado, usuario_id, total, tipo, descripcion_extra, metodo_pago FROM pedidos WHERE id = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Pedido no encontrado' });
    const ped = rows[0];

    if (user.rol !== ROLES.ADMIN && ped.usuario_id !== user.id) {
      return res.status(403).json({ error: 'No puedes deshacer este pedido' });
    }

    const memento = historialPedidos.deshacer(id);
    if (!memento) {
      return res.status(400).json({
        error: 'No hay historial Memento para este pedido (cambia el estado primero)',
        patron: 'Memento',
      });
    }

    const originator = new PedidoOriginator(ped);
    originator.restaurar(memento);
    const snap = originator.snapshot();

    db.getPool().query(
      'UPDATE pedidos SET estado = ?, total = ?, tipo = ?, descripcion_extra = ?, metodo_pago = ? WHERE id = ?',
      [snap.estado, snap.total, snap.tipo, snap.descripcionExtra, snap.metodoPago, id]
    );

    logService.registrar({
      usuarioId: user.id,
      accion: 'DESHACER_ESTADO_MEMENTO',
      detalle: `pedido_id=${id} restaurado_a=${snap.estado}`,
      ip: clientIp(req),
    });

    res.json({
      ok: true,
      patron: 'Memento',
      estadoRestaurado: snap.estado,
      snapshot: snap,
      historialRestante: historialPedidos.cantidad(id),
      mensaje: `Pedido restaurado a estado "${snap.estado}"`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
