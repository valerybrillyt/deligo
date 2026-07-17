import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type RolUsuario = 'cliente' | 'admin' | 'repartidor' | 'restaurante';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuario$ = new BehaviorSubject<string>(localStorage.getItem('usuarioNombre') || '');

  nombreChanges = this.usuario$.asObservable();

  estaLogueado() {
    return !!localStorage.getItem('usuarioId');
  }

  getNombre() {
    return this.usuario$.value;
  }

  getRol(): RolUsuario {
    return (localStorage.getItem('usuarioRol') as RolUsuario) || 'cliente';
  }

  esAdmin() {
    return this.getRol() === 'admin';
  }

  esCliente() {
    return this.getRol() === 'cliente';
  }

  getRestauranteId(): number | null {
    const id = localStorage.getItem('restauranteId');
    return id ? Number(id) : null;
  }

  setSesion(
    id: number,
    nombre: string,
    token: string,
    rol: RolUsuario = 'cliente',
    restauranteId?: number | null
  ) {
    localStorage.setItem('usuarioId', String(id));
    localStorage.setItem('usuarioNombre', nombre);
    localStorage.setItem('usuarioRol', rol);
    localStorage.setItem('deligo_token', token);
    if (restauranteId) {
      localStorage.setItem('restauranteId', String(restauranteId));
    } else {
      localStorage.removeItem('restauranteId');
    }
    this.usuario$.next(nombre);
  }

  getUsuarioId(): number | null {
    const id = localStorage.getItem('usuarioId');
    return id ? Number(id) : null;
  }

  rutaInicioPorRol(): string {
    switch (this.getRol()) {
      case 'admin':
        return '/admin/logs';
      case 'repartidor':
        return '/repartidor';
      case 'restaurante':
        return '/restaurante';
      default:
        return '/restaurantes';
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioRol');
    localStorage.removeItem('restauranteId');
    localStorage.removeItem('deligo_token');
    localStorage.removeItem('ultimoPedidoId');
    this.usuario$.next('');
  }
}
