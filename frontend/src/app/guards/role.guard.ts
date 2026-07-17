import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, RolUsuario } from '../services/auth.service';

export function roleGuard(...roles: RolUsuario[]): CanActivateFn {
  return (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.estaLogueado()) {
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }
    if (auth.esAdmin() || roles.includes(auth.getRol())) {
      return true;
    }
    return router.createUrlTree(['/']);
  };
}

/** Solo clientes (y admin para pruebas) pueden pedir comida */
export const clienteGuard: CanActivateFn = roleGuard('cliente');
