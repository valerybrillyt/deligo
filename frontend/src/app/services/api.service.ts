import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getPatrones() {
    return this.http.get<PatronesDoc>(`${API}/patrones`);
  }

  getRoles() {
    return this.http.get<{ roles: RolDetalle[] }>(`${API}/roles`);
  }

  getRestaurantes() {
    return this.http.get<Restaurante[]>(`${API}/restaurantes`);
  }

  registrarUsuario(body: object) {
    return this.http.post(`${API}/usuarios/registro`, body);
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${API}/usuarios/login`, { email, password });
  }

  getMenu(restauranteId: number) {
    return this.http.get<MenuResponse>(`${API}/restaurantes/${restauranteId}/menu`);
  }

  getTiposPedido() {
    return this.http.get<{ tipos: TipoPedido[] }>(`${API}/pedidos/tipos`);
  }

  getExtras() {
    return this.http.get<{ extras: ExtraPedido[] }>(`${API}/pedidos/extras`);
  }

  crearPedido(body: object) {
    return this.http.post<RespuestaPedido>(`${API}/pedidos`, body);
  }

  getPedidos(usuarioId?: number) {
    const q = usuarioId ? `?usuarioId=${usuarioId}` : '';
    return this.http.get<PedidoResumen[]>(`${API}/pedidos${q}`);
  }

  getSeguimiento(pedidoId: number) {
    return this.http.get<SeguimientoPedido>(`${API}/pedidos/${pedidoId}/seguimiento`);
  }

  actualizarEstado(pedidoId: number, estado: string) {
    return this.http.patch(`${API}/pedidos/${pedidoId}/estado`, { estado });
  }

  cancelarPedido(pedidoId: number) {
    return this.http.post<{ ok: boolean; mensaje: string }>(`${API}/pedidos/${pedidoId}/cancelar`, {});
  }

  deshacerPedido(pedidoId: number) {
    return this.http.post<{
      ok: boolean;
      estadoRestaurado: string;
      mensaje: string;
      patron: string;
    }>(`${API}/pedidos/${pedidoId}/deshacer`, {});
  }

  getMetodosPago() {
    return this.http.get<{ metodos: Array<{ codigo: string; etiqueta: string }>; simulado: boolean; mensaje: string }>(
      `${API}/pedidos/metodos-pago`
    );
  }

  registrarLog(accion: string, detalle = '', ruta = '') {
    const usuarioId = Number(localStorage.getItem('usuarioId')) || null;
    return this.http.post(`${API}/logs`, { usuarioId, accion, detalle, ruta });
  }

  getLogs(usuarioId?: number) {
    const q = usuarioId ? `?usuarioId=${usuarioId}` : '';
    return this.http.get<LogEntrada[]>(`${API}/logs${q}`);
  }
}

export interface LogEntrada {
  id: number;
  usuario_id: number | null;
  accion: string;
  detalle: string;
  ruta: string;
  exito: number;
  creado_en: string;
  usuario_nombre?: string;
  usuario_email?: string;
  usuario_rol?: string;
}

export interface Restaurante {
  id: number;
  nombre: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
}

export interface MenuCategoria {
  tipo: string;
  nombre?: string;
  items?: Array<{ tipo: string; id: number; nombre: string; precio: number }>;
}

export interface MenuResponse {
  menuArbol: MenuCategoria[];
  productos?: Array<{ id: number; nombre: string; precio: number; categoria?: string; descripcion?: string }>;
  patronUsado?: string;
  totalCategorias?: number;
}

export interface TipoPedido {
  tipo: string;
  etiqueta: string;
  tiempo: number;
  envio: number;
  descripcion: string;
}

export interface ExtraPedido {
  codigo: string;
  nombre: string;
  costo: number;
  patron: string;
}

export interface RespuestaPedido {
  pedidoId: number;
  total: number;
  subtotal?: number;
  costoEnvio?: number;
  costoExtras?: number;
  tiempoEstimadoMin?: number;
  metodoPago?: string;
  metodoPagoLabel?: string;
  pagoSimulado?: boolean;
  patrones?: {
    factory: { tipo: string; etiqueta: string; tiempoEstimadoMin: number; costoEnvio: number };
    decorator: { descripcion: string; extras: Array<{ nombre: string; costo: number }>; costoExtras: number };
  };
}

export interface SeguimientoPedido {
  pedidoId: number;
  estado: string;
  total?: number;
  tipo?: string;
  progreso?: number;
  pasos?: Array<{ nombre: string; completado: boolean; activo: boolean }>;
  origen: { lat: number; lng: number; nombre: string };
  destino: { lat: number; lng: number; direccion: string };
  metodoPago?: string;
  metodoPagoLabel?: string;
  mapa?: {
    proveedor: string;
    coordenadas: Array<[number, number]>;
    repartidor: { lat: number; lng: number };
  };
}

export interface PedidoResumen {
  id: number;
  total: number;
  estado: string;
  tipo: string;
  restaurante: string;
  metodo_pago?: string;
  cliente_nombre?: string;
  cliente_direccion?: string;
  usuario_id?: number;
  restaurante_id?: number;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: 'cliente' | 'admin' | 'repartidor' | 'restaurante';
    restaurante_id?: number | null;
  };
  patronUsado?: string;
}

export interface RolDetalle {
  codigo: string;
  nombre: string;
  emoji: string;
  resumen: string;
  cuentaDemo: { email: string; password: string; local?: string };
  pantallas: string[];
  alLoginVaA: string;
  puede: string[];
  noPuede: string[];
  enBD: string;
}

export interface PatronesDoc {
  singleton: Array<{ archivo: string; uso: string }>;
  factory: { archivo: string; uso: string; tipos: TipoPedido[] };
  decorator: { archivo: string; uso: string; extras: ExtraPedido[] };
  composite: { archivo: string; uso: string };
  state?: {
    archivo: string;
    uso: string;
    estados: Array<{ codigo: string; mensaje: string; siguientes: string[] }>;
  };
  memento?: { archivo: string; uso: string; historial?: { patron: string; pedidosConHistorial: number; descripcion: string } };
  microservicios?: {
    estilo: string;
    comunicacion: string;
    ejemploClase: string;
    servicios: Array<{ codigo: string; nombre: string; responsabilidad: string; endpoints: string[]; moduloActual: string }>;
  };
  antipatrones?: {
    definicion: string;
    evitadosEnDeligo: Array<{
      codigo: string;
      nombre: string;
      problema: string;
      comoLoEvitamos: string;
      patronQueAyuda: string;
    }>;
  };
}
