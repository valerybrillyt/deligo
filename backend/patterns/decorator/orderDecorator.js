/**
 * PATRÓN DECORATOR — Añade servicios al pedido sin modificar la clase Factory
 */

class PedidoBase {
  constructor(pedido) {
    this.pedido = pedido;
  }
  descripcion() {
    return `Pedido ${this.pedido.tipo}`;
  }
  costoExtra() {
    return 0;
  }
  extrasLista() {
    return [];
  }
}

class DecoradorPropina extends PedidoBase {
  constructor(p) {
    super(p);
    this.monto = 2;
  }
  descripcion() {
    return `${super.descripcion()} + Propina ($${this.monto})`;
  }
  costoExtra() {
    return super.costoExtra() + this.monto;
  }
  extrasLista() {
    return [...super.extrasLista(), { codigo: 'propina', nombre: 'Propina', costo: this.monto }];
  }
}

class DecoradorSeguro extends PedidoBase {
  descripcion() {
    return `${super.descripcion()} + Seguro de envío`;
  }
  costoExtra() {
    return super.costoExtra() + 1.5;
  }
  extrasLista() {
    return [...super.extrasLista(), { codigo: 'seguro', nombre: 'Seguro', costo: 1.5 }];
  }
}

class DecoradorEco extends PedidoBase {
  descripcion() {
    return `${super.descripcion()} + Empaque ecológico`;
  }
  costoExtra() {
    return super.costoExtra() + 0.75;
  }
  extrasLista() {
    return [...super.extrasLista(), { codigo: 'eco', nombre: 'Empaque eco', costo: 0.75 }];
  }
}

const MAPA_DECORADORES = {
  propina: DecoradorPropina,
  seguro: DecoradorSeguro,
  eco: DecoradorEco,
};

function aplicarDecoradores(pedido, extras = []) {
  let envuelto = new PedidoBase(pedido);
  for (const codigo of extras) {
    const Clase = MAPA_DECORADORES[codigo];
    if (Clase) envuelto = new Clase(envuelto);
  }
  return envuelto;
}

function listarExtrasDisponibles() {
  return [
    { codigo: 'propina', nombre: 'Propina para el repartidor', costo: 2 },
    { codigo: 'seguro', nombre: 'Protección del pedido', costo: 1.5 },
    { codigo: 'eco', nombre: 'Empaque sustentable', costo: 0.75 },
  ];
}

module.exports = { aplicarDecoradores, listarExtrasDisponibles };
