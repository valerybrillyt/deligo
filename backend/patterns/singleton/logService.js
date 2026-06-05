/**
 * PATRÓN SINGLETON — Un solo servicio de logs para toda la aplicación.
 * Guarda en la tabla `logs` cada acción del usuario (auditoría / recuperación).
 */
const db = require('./databaseConnection');

class LogService {
  constructor() {
    if (LogService.instance) return LogService.instance;
    LogService.instance = this;
  }

  registrar({ usuarioId = null, accion, detalle = '', ruta = '', ip = '', exito = 1 }) {
    try {
      db.getPool().query(
        `INSERT INTO logs (usuario_id, accion, detalle, ruta, ip, exito)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [usuarioId, accion, detalle, ruta, ip, exito ? 1 : 0]
      );
    } catch (err) {
      console.error('No se pudo guardar log:', err.message);
    }
  }
}

module.exports = new LogService();
