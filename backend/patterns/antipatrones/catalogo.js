/**
 * ANTIPATRONES — Qué evitamos en DeliGo (Sesión antipatrones)
 *
 * Un antipatrón parece solución, pero genera más problemas.
 * Aquí documentamos cómo el proyecto los evita con patrones reales.
 */

const ANTIPATRONES = [
  {
    codigo: 'god_class',
    nombre: 'Clase Dios / God Class',
    problema: 'Una clase hace de todo: login, pedidos, menú, pagos, logs.',
    comoLoEvitamos:
      'Separación: authService, orderFactory, menuComposite, logService, orderState, geoService.',
    patronQueAyuda: 'Singleton + Factory + Composite + State',
  },
  {
    codigo: 'spaghetti',
    nombre: 'Código Espagueti',
    problema: 'Muchos if/else anidados para estados del pedido.',
    comoLoEvitamos:
      'Patrón State: cada estado (pendiente, preparando…) sabe a cuáles puede pasar.',
    patronQueAyuda: 'State',
  },
  {
    codigo: 'duplicado',
    nombre: 'Código Duplicado (Copy-Paste)',
    problema: 'Copiar la misma lógica de total/envío en varios archivos.',
    comoLoEvitamos:
      'Factory crea el tipo de pedido una sola vez; Decorator suma extras en un solo flujo.',
    patronQueAyuda: 'Factory + Decorator',
  },
  {
    codigo: 'golden_hammer',
    nombre: 'Martillo de Oro',
    problema: 'Usar siempre la misma herramienta sin analizar (ej. Google Maps de pago para todo).',
    comoLoEvitamos:
      'Mapa gratis con OpenStreetMap + OSRM; SQLite para demo académica; pagos simulados.',
    patronQueAyuda: 'Elección tecnológica según necesidad (sesión microservicios / arquitectura)',
  },
  {
    codigo: 'parche',
    nombre: 'Parche sobre Parche',
    problema: 'Arreglos temporales sin corregir el diseño.',
    comoLoEvitamos:
      'Memento guarda estado antes de cambiar; State valida transiciones; roles en middleware.',
    patronQueAyuda: 'Memento + State + RBAC',
  },
  {
    codigo: 'big_ball',
    nombre: 'Big Ball of Mud',
    problema: 'Proyecto sin carpetas ni arquitectura clara.',
    comoLoEvitamos:
      'Estructura backend/patterns, services, middleware, routes; frontend por componentes.',
    patronQueAyuda: 'Arquitectura modular / límites de microservicios',
  },
];

function listarAntipatrones() {
  return {
    definicion:
      'Prácticas que parecen solucionar problemas pero generan mantenimiento caro y código frágil.',
    evitadosEnDeligo: ANTIPATRONES,
  };
}

module.exports = { listarAntipatrones, ANTIPATRONES };
