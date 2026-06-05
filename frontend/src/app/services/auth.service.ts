import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  setSesion(id: number, nombre: string, token: string) {
    localStorage.setItem('usuarioId', String(id));
    localStorage.setItem('usuarioNombre', nombre);
    localStorage.setItem('deligo_token', token);
    this.usuario$.next(nombre);
  }

  getUsuarioId(): number | null {
    const id = localStorage.getItem('usuarioId');
    return id ? Number(id) : null;
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('deligo_token');
    localStorage.removeItem('ultimoPedidoId');
    this.usuario$.next('');
  }
}
