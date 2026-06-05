import { HttpInterceptorFn } from '@angular/common/http';

/** Envía el id de usuario al backend para que los logs sepan quién hizo cada acción */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const usuarioId = localStorage.getItem('usuarioId');
  if (usuarioId) {
    req = req.clone({ setHeaders: { 'X-Usuario-Id': usuarioId } });
  }
  return next(req);
};
