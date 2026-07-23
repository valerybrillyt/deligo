/**
 * ARQUITECTURA DE MICROSERVICIOS (Sesión 11)
 *
 * DeliGo hoy corre como monolito modular (un solo Node + SQLite).
 * Esta capa documenta y simula los LÍMITES de microservicios
 * hacia los que el sistema puede evolucionar: cada "servicio"
 * tiene una responsabilidad clara y se comunica vía API REST/JSON.
 *
 * No son procesos separados aún (evitar antipatrón de complejidad
 * prematura), pero el código ya está organizado por dominio.
 */

const MICROSERVICIOS = [
  {
    codigo: 'usuarios',
    nombre: 'Servicio de Usuarios',
    responsabilidad: 'Registro, login, roles y direcciones',
    endpoints: ['POST /api/usuarios/registro', 'POST /api/usuarios/login', 'GET /api/roles'],
    moduloActual: 'middleware/roles.js + authService (Singleton)',
  },
  {
    codigo: 'catalogo',
    nombre: 'Servicio de Catálogo',
    responsabilidad: 'Restaurantes, menú Composite y productos',
    endpoints: ['GET /api/restaurantes', 'GET /api/restaurantes/:id/menu'],
    moduloActual: 'patterns/composite/menuComposite.js',
  },
  {
    codigo: 'pedidos',
    nombre: 'Servicio de Pedidos',
    responsabilidad: 'Crear pedidos (Factory+Decorator), State y Memento',
    endpoints: ['POST /api/pedidos', 'PATCH /api/pedidos/:id/estado', 'POST /api/pedidos/:id/deshacer'],
    moduloActual: 'patterns/factory, decorator, state, memento',
  },
  {
    codigo: 'pagos',
    nombre: 'Servicio de Pagos',
    responsabilidad: 'Métodos de pago simulados (efectivo, tarjeta, Yape)',
    endpoints: ['GET /api/pedidos/metodos-pago'],
    moduloActual: 'routes/api.js → METODOS_PAGO',
  },
  {
    codigo: 'geo',
    nombre: 'Servicio de Geolocalización',
    responsabilidad: 'Geocodificar dirección y ruta del repartidor',
    endpoints: ['seguimiento usa geocode + OSRM'],
    moduloActual: 'services/geoService.js',
  },
  {
    codigo: 'auditoria',
    nombre: 'Servicio de Auditoría',
    responsabilidad: 'Logs de acciones; solo admin consulta',
    endpoints: ['GET /api/logs', 'POST /api/logs'],
    moduloActual: 'patterns/singleton/logService.js',
  },
];

function listarMicroservicios() {
  return {
    estilo: 'Monolito modular → listo para dividir en microservicios',
    comunicacion: 'HTTP REST + JSON (como en sesión 11)',
    ejemploClase: 'Tienda online: usuarios, pagos, productos → en DeliGo: usuarios, pedidos, catálogo, pagos, geo, auditoría',
    servicios: MICROSERVICIOS,
  };
}

/** Facade académica: “llama” a un servicio por código (simulación) */
function describirServicio(codigo) {
  const s = MICROSERVICIOS.find((x) => x.codigo === codigo);
  if (!s) return null;
  return { ...s, disponible: true, despliegue: 'mismo proceso Node (fase académica)' };
}

module.exports = { listarMicroservicios, describirServicio, MICROSERVICIOS };
