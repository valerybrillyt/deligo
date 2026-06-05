import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getRestaurantes() {
    return this.http.get<
      Array<{ id: number; nombre: string; direccion: string }>
    >(`${API}/restaurantes`);
  }

  registrarUsuario(body: object) {
    return this.http.post(`${API}/usuarios/registro`, body);
  }

  login(email: string, password: string) {
    return this.http.post<{
      token: string;
      usuario: { id: number; nombre: string; email: string };
    }>(`${API}/usuarios/login`, { email, password });
  }

  getMenu(restauranteId: number) {
    return this.http.get<{ menuArbol: MenuCategoria[] }>(
      `${API}/restaurantes/${restauranteId}/menu`
    );
  }

  crearPedido(body: object) {
    return this.http.post<{ pedidoId: number; total: number }>(
      `${API}/pedidos`,
      body
    );
  }

  getSeguimiento(pedidoId: number) {
    return this.http.get<SeguimientoPedido>(
      `${API}/pedidos/${pedidoId}/seguimiento`
    );
  }
}

export interface MenuCategoria {
  tipo: string;
  nombre?: string;
  items?: Array<{ tipo: string; id: number; nombre: string; precio: number }>;
}

export interface SeguimientoPedido {
  pedidoId: number;
  estado: string;
  origen: { lat: number; lng: number; nombre: string };
  destino: { lat: number; lng: number; direccion: string };
}
