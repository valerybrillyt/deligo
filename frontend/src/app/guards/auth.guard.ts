import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

/** Solo usuarios con sesión pueden entrar a pedir, menú y seguimiento */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const api = inject(ApiService);

  if (auth.estaLogueado()) {
    api.registrarLog('ACCESO_PAGINA', state.url).subscribe({ error: () => {} });
    return true;
  }

  api.registrarLog('ACCESO_DENEGADO', `Sin sesión: ${state.url}`).subscribe({ error: () => {} });
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
