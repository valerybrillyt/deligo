/**
 * PATRÓN STATE — El comportamiento del pedido cambia según su estado.
 * Evita if/else anidados: cada estado sabe a cuáles puede pasar.
 *
 * Flujo típico:
 *   pendiente → preparando → en_camino → entregado
 *   pendiente|preparando → cancelado
 */

class EstadoPedido {
  constructor(nombre) {
    this.nombre = nombre;
  }

  /** Transiciones permitidas desde este estado */
  siguientes() {
    return [];
  }

  puedePasarA(nuevo) {
    return this.siguientes().includes(nuevo);
  }

  etiqueta() {
    return this.nombre;
  }

  mensaje() {
    return `Pedido en estado: ${this.nombre}`;
  }
}

class EstadoPendiente extends EstadoPedido {
  constructor() {
    super('pendiente');
  }
  siguientes() {
    return ['preparando', 'cancelado'];
  }
  mensaje() {
    return 'Pedido recibido. Esperando que el restaurante prepare.';
  }
}

class EstadoPreparando extends EstadoPedido {
  constructor() {
    super('preparando');
  }
  siguientes() {
    return ['en_camino', 'cancelado'];
  }
  mensaje() {
    return 'El restaurante está preparando tu comida.';
  }
}

class EstadoEnCamino extends EstadoPedido {
  constructor() {
    super('en_camino');
  }
  siguientes() {
    return ['entregado'];
  }
  mensaje() {
    return 'El repartidor va en camino a tu dirección.';
  }
}

class EstadoEntregado extends EstadoPedido {
  constructor() {
    super('entregado');
  }
  siguientes() {
    return [];
  }
  mensaje() {
    return 'Pedido entregado. ¡Buen provecho!';
  }
}

class EstadoCancelado extends EstadoPedido {
  constructor() {
    super('cancelado');
  }
  siguientes() {
    return [];
  }
  mensaje() {
    return 'Pedido cancelado. No se realizó cobro.';
  }
}

const ESTADOS = {
  pendiente: EstadoPendiente,
  preparando: EstadoPreparando,
  en_camino: EstadoEnCamino,
  entregado: EstadoEntregado,
  cancelado: EstadoCancelado,
};

/** Contexto: el pedido mantiene el estado actual y delega las transiciones */
class PedidoContexto {
  constructor(estadoInicial = 'pendiente') {
    this.setEstado(estadoInicial);
  }

  setEstado(nombre) {
    const Clase = ESTADOS[nombre];
    if (!Clase) throw new Error(`Estado desconocido: ${nombre}`);
    this.estado = new Clase();
  }

  getEstado() {
    return this.estado.nombre;
  }

  info() {
    return {
      estado: this.estado.nombre,
      mensaje: this.estado.mensaje(),
      siguientes: this.estado.siguientes(),
      patron: 'State',
    };
  }

  /**
   * Intenta cambiar de estado. Lanza error si la transición es inválida.
   * @returns {{ anterior: string, actual: string }}
   */
  transicionar(nuevoEstado) {
    if (!this.estado.puedePasarA(nuevoEstado)) {
      throw new Error(
        `Transición inválida (State): no se puede pasar de "${this.estado.nombre}" a "${nuevoEstado}". ` +
          `Permitidos: ${this.estado.siguientes().join(', ') || 'ninguno'}`
      );
    }
    const anterior = this.estado.nombre;
    this.setEstado(nuevoEstado);
    return { anterior, actual: this.estado.nombre };
  }
}

function crearEstado(nombre) {
  const Clase = ESTADOS[nombre];
  if (!Clase) throw new Error(`Estado desconocido: ${nombre}`);
  return new Clase();
}

function listarEstadosDisponibles() {
  return Object.keys(ESTADOS).map((codigo) => {
    const e = new ESTADOS[codigo]();
    return {
      codigo,
      mensaje: e.mensaje(),
      siguientes: e.siguientes(),
    };
  });
}

module.exports = {
  PedidoContexto,
  crearEstado,
  listarEstadosDisponibles,
  ESTADOS,
};
