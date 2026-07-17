/**
 * PATRÓN FACTORY — Crea el tipo correcto de pedido según "estandar" | "express" | "programado"
 */

class PedidoEstandar {
  constructor(d) {
    this.tipo = 'estandar';
    this.etiqueta = 'Pedido estándar';
    this.usuarioId = d.usuarioId;
    this.restauranteId = d.restauranteId;
    this.items = d.items;
    this.tiempoEstimadoMin = 45;
    this.costoEnvio = 5;
  }
  calcularTotal(subtotal) {
    return subtotal + this.costoEnvio;
  }
  info() {
    return { tipo: this.tipo, etiqueta: this.etiqueta, tiempoEstimadoMin: this.tiempoEstimadoMin, costoEnvio: this.costoEnvio };
  }
}

class PedidoExpress {
  constructor(d) {
    this.tipo = 'express';
    this.etiqueta = 'Pedido express';
    this.usuarioId = d.usuarioId;
    this.restauranteId = d.restauranteId;
    this.items = d.items;
    this.tiempoEstimadoMin = 20;
    this.costoEnvio = 8;
  }
  calcularTotal(subtotal) {
    return subtotal + this.costoEnvio;
  }
  info() {
    return { tipo: this.tipo, etiqueta: this.etiqueta, tiempoEstimadoMin: this.tiempoEstimadoMin, costoEnvio: this.costoEnvio };
  }
}

class PedidoProgramado {
  constructor(d) {
    this.tipo = 'programado';
    this.etiqueta = 'Pedido programado';
    this.usuarioId = d.usuarioId;
    this.restauranteId = d.restauranteId;
    this.items = d.items;
    this.tiempoEstimadoMin = 60;
    this.costoEnvio = 3.5;
  }
  calcularTotal(subtotal) {
    return subtotal + this.costoEnvio;
  }
  info() {
    return { tipo: this.tipo, etiqueta: this.etiqueta, tiempoEstimadoMin: this.tiempoEstimadoMin, costoEnvio: this.costoEnvio };
  }
}

function crearPedido(tipo, datos) {
  switch (tipo) {
    case 'express':
      return new PedidoExpress(datos);
    case 'programado':
      return new PedidoProgramado(datos);
    default:
      return new PedidoEstandar(datos);
  }
}

function listarTiposDisponibles() {
  return [
    { tipo: 'estandar', etiqueta: 'Entrega normal', tiempo: 45, envio: 5, descripcion: 'Envío estándar' },
    { tipo: 'express', etiqueta: 'Entrega rápida', tiempo: 20, envio: 8, descripcion: 'Prioridad en cocina y reparto' },
    { tipo: 'programado', etiqueta: 'Programar entrega', tiempo: 60, envio: 3.5, descripcion: 'Elige tu horario' },
  ];
}

module.exports = { crearPedido, listarTiposDisponibles };
