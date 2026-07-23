/**
 * PATRÓN MEMENTO — Guarda y restaura el estado interno de un pedido
 * sin exponer sus detalles (encapsulación).
 *
 * Originator = PedidoOriginator (el pedido)
 * Memento    = snapshot { estado, total, tipo, ... }
 * Caretaker  = HistorialPedidos (pila de mementos por pedidoId)
 *
 * Uso en DeliGo: antes de cambiar/cancelar un pedido se guarda un memento;
 * el admin o el flujo de "deshacer" puede restaurar el estado anterior.
 */

class MementoPedido {
  constructor({ estado, total, tipo, descripcionExtra, metodoPago }) {
    this.estado = estado;
    this.total = total;
    this.tipo = tipo;
    this.descripcionExtra = descripcionExtra || '';
    this.metodoPago = metodoPago || 'efectivo';
    this.guardadoEn = new Date().toISOString();
  }

  /** Solo lectura del snapshot (no se modifica desde fuera) */
  getEstado() {
    return {
      estado: this.estado,
      total: this.total,
      tipo: this.tipo,
      descripcionExtra: this.descripcionExtra,
      metodoPago: this.metodoPago,
      guardadoEn: this.guardadoEn,
    };
  }
}

/** Originator: objeto cuyo estado se guarda / restaura */
class PedidoOriginator {
  constructor(datos = {}) {
    this.estado = datos.estado || 'pendiente';
    this.total = datos.total || 0;
    this.tipo = datos.tipo || 'estandar';
    this.descripcionExtra = datos.descripcionExtra || '';
    this.metodoPago = datos.metodoPago || 'efectivo';
  }

  crearMemento() {
    return new MementoPedido({
      estado: this.estado,
      total: this.total,
      tipo: this.tipo,
      descripcionExtra: this.descripcionExtra,
      metodoPago: this.metodoPago,
    });
  }

  restaurar(memento) {
    if (!memento) throw new Error('No hay memento para restaurar');
    const s = memento.getEstado();
    this.estado = s.estado;
    this.total = s.total;
    this.tipo = s.tipo;
    this.descripcionExtra = s.descripcionExtra;
    this.metodoPago = s.metodoPago;
    return this;
  }

  snapshot() {
    return {
      estado: this.estado,
      total: this.total,
      tipo: this.tipo,
      descripcionExtra: this.descripcionExtra,
      metodoPago: this.metodoPago,
    };
  }
}

/**
 * Caretaker (Singleton de historial en memoria):
 * guarda una pila de mementos por pedidoId para "deshacer".
 */
class HistorialPedidos {
  constructor() {
    if (HistorialPedidos.instance) return HistorialPedidos.instance;
    /** @type {Map<number, MementoPedido[]>} */
    this.pilas = new Map();
    HistorialPedidos.instance = this;
  }

  guardar(pedidoId, memento) {
    const id = Number(pedidoId);
    if (!this.pilas.has(id)) this.pilas.set(id, []);
    const pila = this.pilas.get(id);
    pila.push(memento);
    // máximo 10 snapshots por pedido
    if (pila.length > 10) pila.shift();
  }

  /** Saca el último memento (deshacer) */
  deshacer(pedidoId) {
    const pila = this.pilas.get(Number(pedidoId));
    if (!pila || !pila.length) return null;
    return pila.pop();
  }

  /** Mira el último sin sacarlo */
  ultimo(pedidoId) {
    const pila = this.pilas.get(Number(pedidoId));
    if (!pila || !pila.length) return null;
    return pila[pila.length - 1];
  }

  cantidad(pedidoId) {
    return this.pilas.get(Number(pedidoId))?.length || 0;
  }

  info() {
    return {
      patron: 'Memento',
      pedidosConHistorial: this.pilas.size,
      descripcion: 'Guarda snapshots del pedido para deshacer cambios de estado',
    };
  }
}

const historialPedidos = new HistorialPedidos();

module.exports = {
  MementoPedido,
  PedidoOriginator,
  HistorialPedidos,
  historialPedidos,
};
