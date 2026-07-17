/**
 * Control de acceso por rol (RBAC).
 * Roles: cliente | admin | repartidor | restaurante
 */
const logService = require('../patterns/singleton/logService');

const ROLES = Object.freeze({
  CLIENTE: 'cliente',
  ADMIN: 'admin',
  REPARTIDOR: 'repartidor',
  RESTAURANTE: 'restaurante',
});

const DESCRIPCION_ROLES = [
  {
    codigo: 'cliente',
    nombre: 'Cliente',
    emoji: '🛒',
    resumen: 'Usuario que pide comida a domicilio',
    cuentaDemo: { email: 'demo@deligo.com', password: 'demo123' },
    pantallas: ['/restaurantes', '/menu/:id', '/seguimiento'],
    alLoginVaA: '/restaurantes',
    puede: [
      'Registrarse y crear cuenta (siempre queda como cliente)',
      'Ver restaurantes y menús',
      'Hacer pedidos y elegir pago simulado',
      'Ver y cancelar solo sus propios pedidos',
      'El sistema escribe en logs sus acciones (pero no los ve)',
    ],
    noPuede: [
      'Ver la tabla logs ni /admin/logs',
      'Ver pedidos de otros usuarios',
      'Cambiar estados de entrega (preparando, en camino…)',
      'Entrar al panel de repartidor o restaurante',
    ],
    enBD: 'usuarios.rol = cliente (valor por defecto al registrarse)',
  },
  {
    codigo: 'admin',
    nombre: 'Administrador',
    emoji: '🛡️',
    resumen: 'Dueño del sistema / soporte — acceso total',
    cuentaDemo: { email: 'admin@deligo.com', password: 'admin123' },
    pantallas: ['/admin/logs', '/restaurantes (pruebas)', '/seguimiento (pruebas)'],
    alLoginVaA: '/admin/logs',
    puede: [
      'Ver TODOS los logs en /admin/logs y GET /api/logs',
      'Ver todos los pedidos del sistema',
      'Cambiar cualquier estado de pedido',
      'Revisar logs en DBeaver (SELECT * FROM logs)',
      'Probar pantallas de cliente (admin tiene acceso extra)',
    ],
    noPuede: [
      'Nada bloqueado — es el rol con más permisos',
    ],
    enBD: 'usuarios.rol = admin',
  },
  {
    codigo: 'repartidor',
    nombre: 'Repartidor',
    emoji: '🛵',
    resumen: 'Lleva los pedidos del restaurante al cliente',
    cuentaDemo: { email: 'repartidor@deligo.com', password: 'repart123' },
    pantallas: ['/repartidor'],
    alLoginVaA: '/repartidor',
    puede: [
      'Ver pedidos activos (pendiente, preparando, en camino)',
      'Marcar pedido como en camino (cuando el local terminó)',
      'Marcar pedido como entregado',
    ],
    noPuede: [
      'Ver logs de auditoría',
      'Pedir comida como cliente',
      'Ver pedidos de preparación de cocina (eso es restaurante)',
      'Cancelar pedidos de clientes',
    ],
    enBD: 'usuarios.rol = repartidor',
  },
  {
    codigo: 'restaurante',
    nombre: 'Restaurante',
    emoji: '🍽️',
    resumen: 'Local asociado — solo ve pedidos de su negocio',
    cuentaDemo: {
      email: 'pizza@deligo.com',
      password: 'rest123',
      local: 'Pizza Express',
    },
    pantallas: ['/restaurante'],
    alLoginVaA: '/restaurante',
    puede: [
      'Ver pedidos dirigidos a su local (restaurante_id en BD)',
      'Marcar pedido pendiente → en preparación',
    ],
    noPuede: [
      'Ver logs',
      'Ver pedidos de otros restaurantes',
      'Marcar en camino o entregado (eso es el repartidor)',
      'Pedir comida como cliente',
    ],
    enBD: 'usuarios.rol = restaurante y usuarios.restaurante_id = id del local',
  },
];

function usuarioDesdeRequest(req) {
  const h = req.headers['x-usuario-id'];
  if (h) return Number(h) || null;
  const b = req.body?.usuarioId;
  if (b) return Number(b) || null;
  const q = req.query?.usuarioId;
  if (q) return Number(q) || null;
  return null;
}

function clientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '';
}

function buscarUsuario(db, usuarioId) {
  if (!usuarioId) return null;
  const [rows] = db.getPool().query(
    'SELECT id, nombre, email, rol, restaurante_id FROM usuarios WHERE id = ?',
    [usuarioId]
  );
  return rows[0] || null;
}

function requiereSesion(req, res, db) {
  const id = usuarioDesdeRequest(req);
  if (!id) {
    res.status(401).json({ error: 'Debes iniciar sesión' });
    return null;
  }
  const user = buscarUsuario(db, id);
  if (!user) {
    res.status(401).json({ error: 'Usuario no encontrado' });
    return null;
  }
  return user;
}

function requiereRol(req, res, db, rolesPermitidos) {
  const user = requiereSesion(req, res, db);
  if (!user) return null;

  const permitido =
    rolesPermitidos.includes(user.rol) ||
    (user.rol === ROLES.ADMIN && rolesPermitidos.length > 0);

  if (!permitido) {
    logService.registrar({
      usuarioId: user.id,
      accion: 'ACCESO_DENEGADO',
      detalle: `rol=${user.rol} necesita=${rolesPermitidos.join(',')} ruta=${req.path}`,
      ruta: req.originalUrl || req.path,
      ip: clientIp(req),
      exito: 0,
    });
    res.status(403).json({ error: 'No tienes permiso para esta acción' });
    return null;
  }
  return user;
}

module.exports = {
  ROLES,
  DESCRIPCION_ROLES,
  usuarioDesdeRequest,
  buscarUsuario,
  requiereSesion,
  requiereRol,
};
